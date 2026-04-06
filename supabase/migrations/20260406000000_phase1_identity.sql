-- ParaCompanion Phase 1 Identity & Foundation Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- PHASE 0: FOUNDATION
-- ==========================================

-- 1. Feature Flags
CREATE TABLE public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    is_globally_enabled BOOLEAN DEFAULT false,
    enabled_for_tiers JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TRIGGER handle_updated_at_feature_flags
    BEFORE UPDATE ON public.feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime (updated_at);

-- 2. Audit Log (Immutable)
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID,
    target_user_id UUID,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- No updated_at or deleted_at for immutable tables

-- 3. App Announcements
CREATE TABLE public.app_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    severity TEXT NOT NULL, -- info, warning, critical
    target_tiers JSONB DEFAULT '["all"]'::jsonb,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TRIGGER handle_updated_at_app_announcements
    BEFORE UPDATE ON public.app_announcements
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime (updated_at);

-- 4. Error Reports (Client failures)
CREATE TABLE public.error_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    tool_type TEXT,
    error_code TEXT,
    error_message TEXT,
    stack_trace TEXT,
    app_version TEXT,
    platform TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
-- No updated_at; immutable after creation


-- ==========================================
-- PHASE 1: IDENTITY & AUTHENTICATION
-- ==========================================

-- 1. Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    full_name TEXT,
    clinician_tier TEXT DEFAULT 'free', -- free, learner, practitioner
    registration_number TEXT,
    registration_type TEXT, -- hcpc, nhs_pin, student, other
    pin_hash TEXT,
    avatar_storage_path TEXT,
    onboarding_complete BOOLEAN DEFAULT false,
    accepted_terms_at TIMESTAMPTZ,
    accepted_privacy_at TIMESTAMPTZ,
    crew_network_opt_in BOOLEAN DEFAULT false,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime (updated_at);

-- 2. Consent Logs (Immutable)
CREATE TABLE public.consent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    terms_version TEXT,
    privacy_version TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Push Notification Tokens
CREATE TABLE public.push_notification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    device_token TEXT NOT NULL,
    platform TEXT NOT NULL,
    app_version TEXT,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TRIGGER handle_updated_at_push_notification_tokens
    BEFORE UPDATE ON public.push_notification_tokens
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime (updated_at);


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- Feature Flags: System table, no public write. Just read for clients (if needed) or restricted.
CREATE POLICY "Feature flags are completely readable by all" ON public.feature_flags
    FOR SELECT USING (deleted_at IS NULL);

-- Audit Log: Insert only (usually via service role, but allowing authenticated here per spec if needed)
CREATE POLICY "Audit logs insertable by auth" ON public.audit_log
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Audit logs viewable by admin only" ON public.audit_log
    FOR SELECT USING (false); -- Block standard client read

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id AND deleted_at IS NULL);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = id);

-- Protect sensitive profile fields from client-side update
CREATE OR REPLACE FUNCTION restrict_profile_sensitive_updates() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clinician_tier IS DISTINCT FROM OLD.clinician_tier OR
       NEW.pin_hash IS DISTINCT FROM OLD.pin_hash OR
       NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
       RAISE EXCEPTION 'Cannot update sensitive fields from client';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER block_sensitive_profile_updates
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    WHEN (current_user != 'postgres') -- allow admin/service role to bypass
    EXECUTE FUNCTION restrict_profile_sensitive_updates();

-- Push tokens
CREATE POLICY "Users can read/write own tokens" ON public.push_notification_tokens
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- ==========================================
-- TRIGGER: NEW USER AUTOCREATION
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
