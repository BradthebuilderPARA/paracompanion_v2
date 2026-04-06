'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  clinician_role: string | null;
  hcpc_number: string | null;
  employer_name: string | null;
  subscription_tier: 'free' | 'learner' | 'practitioner';
  avatar_seed: string | null;
  verified: boolean;
  onboarding_complete: boolean;
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          display_name: profile.display_name,
          clinician_role: profile.clinician_role,
          hcpc_number: profile.hcpc_number,
          employer_name: profile.employer_name || profile.employer_trust,
          subscription_tier: (profile.subscription_tier as any) || 'free',
          avatar_seed: (profile as any).avatar_seed || authUser.id,
          verified: profile.verified || false,
          onboarding_complete: (profile as any).onboarding_complete || false,
        });
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }

    return { error };
  };

  const rerollAvatar = async () => {
    const newSeed = Math.random().toString(36).substring(7);
    return updateProfile({ avatar_seed: newSeed });
  };

  return { user, loading, updateProfile, rerollAvatar };
}
