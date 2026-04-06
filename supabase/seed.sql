-- Supabase Seed Data for ParaCompanion Test Accounts
-- Passwords are set to "TestPass123!" using bcrypt hash.

-- INSERT auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'test.free@paracompanion.dev',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"display_name": "Test Free"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'test.learner@paracompanion.dev',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"display_name": "Test Learner"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'test.practitioner@paracompanion.dev',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"display_name": "Test Practitioner"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000004',
    'authenticated',
    'authenticated',
    'test.admin@paracompanion.dev',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"display_name": "Test Admin"}',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;


-- Seed identities for auth
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'a0000000-0000-0000-0000-000000000001',
    format('{"sub": "a0000000-0000-0000-0000-000000000001", "email": "%s"}', 'test.free@paracompanion.dev')::jsonb,
    'email',
    now(),
    now(),
    now()
),
(
    gen_random_uuid(),
    'a0000000-0000-0000-0000-000000000002',
    format('{"sub": "a0000000-0000-0000-0000-000000000002", "email": "%s"}', 'test.learner@paracompanion.dev')::jsonb,
    'email',
    now(),
    now(),
    now()
),
(
    gen_random_uuid(),
    'a0000000-0000-0000-0000-000000000003',
    format('{"sub": "a0000000-0000-0000-0000-000000000003", "email": "%s"}', 'test.practitioner@paracompanion.dev')::jsonb,
    'email',
    now(),
    now(),
    now()
),
(
    gen_random_uuid(),
    'a0000000-0000-0000-0000-000000000004',
    format('{"sub": "a0000000-0000-0000-0000-000000000004", "email": "%s"}', 'test.admin@paracompanion.dev')::jsonb,
    'email',
    now(),
    now(),
    now()
) ON CONFLICT DO NOTHING;

-- INSERT into profiles
-- Bypasses trigger rule for local seed manually
INSERT INTO public.profiles (
    id, 
    email, 
    display_name, 
    clinician_tier, 
    registration_number,
    registration_type,
    onboarding_complete
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'test.free@paracompanion.dev',
    'Test Free',
    'free',
    'PA999001',
    'hcpc',
    true
),
(
    'a0000000-0000-0000-0000-000000000002',
    'test.learner@paracompanion.dev',
    'Test Learner',
    'learner',
    NULL,
    'student',
    true
),
(
    'a0000000-0000-0000-0000-000000000003',
    'test.practitioner@paracompanion.dev',
    'Test Practitioner',
    'practitioner',
    'PA999003',
    'hcpc',
    true
),
(
    'a0000000-0000-0000-0000-000000000004',
    'test.admin@paracompanion.dev',
    'Test Admin',
    'practitioner',
    'PA999004',
    'hcpc',
    true
) ON CONFLICT (id) DO UPDATE SET clinician_tier = EXCLUDED.clinician_tier;
