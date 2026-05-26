import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedPersonas() {
  const personas = [
    {
      id: 'd0f8c8e1-5e5e-4b4b-8e8e-1c1c1c1c1c1c',
      email: 'student_test@paracompanion.co.uk',
      clinician_tier: 'free',
      full_name: 'Alex Student',
    },
    {
      id: 'd0f8c8e1-5e5e-4b4b-8e8e-2c2c2c2c2c2c',
      email: 'practitioner_test@paracompanion.co.uk',
      clinician_tier: 'practitioner',
      full_name: 'Dr. Jamie Practitioner',
      subscription_status: 'active',
    }
  ];

  for (const persona of personas) {
    const { error } = await supabase
      .from('profiles')
      .upsert(persona, { onConflict: 'id' });
    
    if (error) console.error(`Error seeding ${persona.email}:`, error.message);
    else console.log(`Seeded ${persona.email}`);
  }
}

seedPersonas();
