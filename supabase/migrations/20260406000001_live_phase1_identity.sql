-- ParaCompanion Phase 1 Identity & Foundation Migration (LIVE RECONCILIATION)
-- This script is designed to safely update the existing live Supabase environment to v1.3.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;

-- 2. PHASE 0: FOUNDATION (CREATE IF MISSING)

-- Feature Flags (Handle existing table)
CREATE TABLE IF NOT EXISTS public.feature_flags (
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

-- Ensure updated_at trigger for feature_flags
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_feature_flags') THEN
        CREATE TRIGGER handle_updated_at_feature_flags
            BEFORE UPDATE ON public.feature_flags
            FOR EACH ROW
            EXECUTE FUNCTION extensions.moddatetime (updated_at);
    END IF;
END $$;

-- Audit Log (Immutable)
CREATE TABLE IF NOT EXISTS public.audit_log (
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

-- App Announcements
CREATE TABLE IF NOT EXISTS public.app_announcements (
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

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_app_announcements') THEN
        CREATE TRIGGER handle_updated_at_app_announcements
            BEFORE UPDATE ON public.app_announcements
            FOR EACH ROW
            EXECUTE FUNCTION extensions.moddatetime (updated_at);
    END IF;
END $$;

-- Error Reports
CREATE TABLE IF NOT EXISTS public.error_reports (
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

-- 3. PHASE 1: IDENTITY (RECONCILE EXISTING)

-- Profiles Reconciliation
-- Add columns missing in v1.2/v1.3 diff
DO $$ BEGIN
    -- full_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    -- registration_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='registration_type') THEN
        ALTER TABLE public.profiles ADD COLUMN registration_type TEXT;
    END IF;
    -- pin_hash
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='pin_hash') THEN
        ALTER TABLE public.profiles ADD COLUMN pin_hash TEXT;
    END IF;
    -- avatar_storage_path
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatar_storage_path') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_storage_path TEXT;
    END IF;
    -- onboarding_complete (usually exists)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='onboarding_complete') THEN
        ALTER TABLE public.profiles ADD COLUMN onboarding_complete BOOLEAN DEFAULT false;
    END IF;
    -- deleted_at (soft delete)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='deleted_at') THEN
        ALTER TABLE public.profiles ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Consent Logs Reconciliation
-- Add terms_version, privacy_version if missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='consent_logs' AND column_name='terms_version') THEN
        ALTER TABLE public.consent_logs ADD COLUMN terms_version TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='consent_logs' AND column_name='privacy_version') THEN
        ALTER TABLE public.consent_logs ADD COLUMN privacy_version TEXT;
    END IF;
END $$;

-- Push Notification Tokens
CREATE TABLE IF NOT EXISTS public.push_notification_tokens (
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

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_push_notification_tokens') THEN
        CREATE TRIGGER handle_updated_at_push_notification_tokens
            BEFORE UPDATE ON public.push_notification_tokens
            FOR EACH ROW
            EXECUTE FUNCTION extensions.moddatetime (updated_at);
    END IF;
END $$;

-- 4. IDENTITY & SECURITY AUTOMATION

-- handle_new_user() trigger logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- 5. RLS POLICIES (Enforce v1.3 strictness)

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- Drop and recreate to ensure v1.3 standard
DROP POLICY IF EXISTS "Feature flags are completely readable by all" ON public.feature_flags;
CREATE POLICY "Feature flags are completely readable by all" ON public.feature_flags
    FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Audit logs insertable by auth" ON public.audit_log;
CREATE POLICY "Audit logs insertable by auth" ON public.audit_log
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Audit logs viewable by admin only" ON public.audit_log;
CREATE POLICY "Audit logs viewable by admin only" ON public.audit_log
    FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = id);

-- Protect sensitive profile fields
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

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'block_sensitive_profile_updates') THEN
        CREATE TRIGGER block_sensitive_profile_updates
            BEFORE UPDATE ON public.profiles
            FOR EACH ROW
            WHEN (current_user != 'postgres')
            EXECUTE FUNCTION restrict_profile_sensitive_updates();
    END IF;
END $$;

DROP POLICY IF EXISTS "Users can read/write own tokens" ON public.push_notification_tokens;
CREATE POLICY "Users can read/write own tokens" ON public.push_notification_tokens
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);
