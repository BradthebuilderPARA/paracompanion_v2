import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from apps/web/.env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or Service Role Key in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const TEST_USERS = [
  {
    email: 'free_TEST@paracompanion.co.uk',
    password: 'Password123!',
    role: 'Other',
    tier: 'free'
  },
  {
    email: 'learner_TEST@paracompanion.co.uk',
    password: 'Password123!',
    role: 'Student Paramedic',
    tier: 'learner'
  },
  {
    email: 'practitioner_TEST@paracompanion.co.uk',
    password: 'Password123!',
    role: 'Qualified Paramedic',
    tier: 'practitioner'
  }
];

async function seedUsers() {
  console.log('🌱 Starting Database Seeding...');

  for (const user of TEST_USERS) {
    console.log(`\n⏳ Processing ${user.email}...`);

    // 1. Create or Get Auth User
    let userId: string;

    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
    });

    if (createError) {
        if (createError.message.includes('already been registered') || createError.message.includes('already exists')) {
             console.log(`   User already exists in auth. Finding user...`);
             const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
             if (listError) throw listError;
             const foundUser = listData.users.find(u => u.email === user.email.toLowerCase());
             if (!foundUser) throw new Error('User exists but could not be found in list.');
             userId = foundUser.id;
        } else {
            console.error(`   ❌ Failed to create user:`, createError.message);
            continue;
        }
    } else {
        userId = authData.user.id;
        console.log(`   ✅ Auth user created: ${userId}`);
    }

    // 2. Setup Profile with Metadata
    const now = new Date().toISOString();
    const dbTier = user.tier === 'learner' ? 'student' : user.tier === 'practitioner' ? 'qualified' : 'admin';
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: user.email,
        clinician_tier: dbTier,
        onboarding_complete: true,
        accepted_terms_at: now,
        accepted_privacy_at: now,
        clinical_safety_onboarding_at: now,
        updated_at: now
      });

    if (profileError) {
      console.error(`   ❌ Failed to upsert profile:`, profileError.message);
      continue;
    }
    console.log(`   ✅ Profile populated with tier: ${user.tier}`);

    // 3. Clinical Consent is already logged to profiles table via timestamps
  }

  console.log('\n🎉 Seeding complete!');
}

seedUsers().catch(console.error);
