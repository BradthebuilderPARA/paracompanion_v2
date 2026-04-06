export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_verification_queue: {
        Row: {
          evidence_url: string
          grace_expires_at: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          evidence_url: string
          grace_expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          evidence_url?: string
          grace_expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ambulance_trusts: {
        Row: {
          country: string
          created_at: string
          id: string
          is_private: boolean
          is_statutory: boolean
          is_trust: boolean
          is_uni: boolean
          region: string
          short_code: string | null
          trust_name: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          is_private?: boolean
          is_statutory?: boolean
          is_trust?: boolean
          is_uni?: boolean
          region: string
          short_code?: string | null
          trust_name: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_private?: boolean
          is_statutory?: boolean
          is_trust?: boolean
          is_uni?: boolean
          region?: string
          short_code?: string | null
          trust_name?: string
        }
        Relationships: []
      }
      app_announcements: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          expires_at: string | null
          id: string
          published_at: string | null
          severity: string
          target_tiers: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          severity: string
          target_tiers?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          severity?: string
          target_tiers?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          record_id: string | null
          table_name: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          table_name?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          table_name?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      consent_logs: {
        Row: {
          agreed_at: string
          consent_version: string
          cpd_consent: boolean
          id: string
          ip_address: string | null
          marketing_consent: boolean
          privacy_version: string | null
          terms_version: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          agreed_at?: string
          consent_version: string
          cpd_consent?: boolean
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean
          privacy_version?: string | null
          terms_version?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          agreed_at?: string
          consent_version?: string
          cpd_consent?: boolean
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean
          privacy_version?: string | null
          terms_version?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      error_reports: {
        Row: {
          app_version: string | null
          created_at: string
          deleted_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          platform: string | null
          stack_trace: string | null
          tool_type: string | null
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          created_at?: string
          deleted_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          platform?: string | null
          stack_trace?: string | null
          tool_type?: string | null
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          created_at?: string
          deleted_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          platform?: string | null
          stack_trace?: string | null
          tool_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          deleted_at: string | null
          enabled_for_tiers: Json
          flag_key: string
          id: string
          is_globally_enabled: boolean
          label: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          enabled_for_tiers?: Json
          flag_key: string
          id?: string
          is_globally_enabled?: boolean
          label: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          enabled_for_tiers?: Json
          flag_key?: string
          id?: string
          is_globally_enabled?: boolean
          label?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      onboarding_events: {
        Row: {
          clinician_role: string | null
          created_at: string
          id: string
          skipped: boolean
          step_index: number
          step_name: string
          tier_selected: string | null
          time_on_step_ms: number | null
          trust_id: string | null
          user_id: string
        }
        Insert: {
          clinician_role?: string | null
          created_at?: string
          id?: string
          skipped?: boolean
          step_index: number
          step_name: string
          tier_selected?: string | null
          time_on_step_ms?: number | null
          trust_id?: string | null
          user_id: string
        }
        Update: {
          clinician_role?: string | null
          created_at?: string
          id?: string
          skipped?: boolean
          step_index?: number
          step_name?: string
          tier_selected?: string | null
          time_on_step_ms?: number | null
          trust_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_events_trust_id_fkey"
            columns: ["trust_id"]
            isOneToOne: false
            referencedRelation: "ambulance_trusts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_privacy_at: string | null
          accepted_terms_at: string | null
          avatar_storage_path: string | null
          career_stage: string | null
          clinician_role: string | null
          clinician_tier: string | null
          created_at: string | null
          crew_network_opt_in: boolean
          deleted_at: string | null
          display_name: string | null
          email: string | null
          employer_name: string | null
          employer_trust: string | null
          employer_type: string | null
          first_name: string | null
          full_name: string | null
          hcpc_number: string | null
          hcpc_skipped: boolean | null
          hcpc_verified: boolean | null
          hourly_rate: number | null
          id: string
          last_name: string | null
          learner_approved_at: string | null
          learner_evidence_url: string | null
          learner_expires_at: string | null
          learner_status: string | null
          newsletter_opt_in: boolean | null
          onboarding_complete: boolean | null
          onboarding_completed_at: string | null
          permission_role: string | null
          pin_hash: string | null
          privacy_version: string | null
          profile_completeness: number
          registration_number: string | null
          registration_type: string | null
          role: string | null
          role_category: string | null
          role_other_text: string | null
          service_type: string | null
          stripe_customer_id: string | null
          subscription_tier: string | null
          terms_version: string | null
          time_on_step: Json | null
          trust_id: string | null
          university: string | null
          university_id: string | null
          updated_at: string
          verified: boolean | null
          work_pin: string | null
        }
        Insert: {
          accepted_privacy_at?: string | null
          accepted_terms_at?: string | null
          avatar_storage_path?: string | null
          career_stage?: string | null
          clinician_role?: string | null
          clinician_tier?: string | null
          created_at?: string | null
          crew_network_opt_in?: boolean
          deleted_at?: string | null
          display_name?: string | null
          email?: string | null
          employer_name?: string | null
          employer_trust?: string | null
          employer_type?: string | null
          first_name?: string | null
          full_name?: string | null
          hcpc_number?: string | null
          hcpc_skipped?: boolean | null
          hcpc_verified?: boolean | null
          hourly_rate?: number | null
          id: string
          last_name?: string | null
          learner_approved_at?: string | null
          learner_evidence_url?: string | null
          learner_expires_at?: string | null
          learner_status?: string | null
          newsletter_opt_in?: boolean | null
          onboarding_complete?: boolean | null
          onboarding_completed_at?: string | null
          permission_role?: string | null
          pin_hash?: string | null
          privacy_version?: string | null
          profile_completeness?: number
          registration_number?: string | null
          registration_type?: string | null
          role?: string | null
          role_category?: string | null
          role_other_text?: string | null
          service_type?: string | null
          stripe_customer_id?: string | null
          subscription_tier?: string | null
          terms_version?: string | null
          time_on_step?: Json | null
          trust_id?: string | null
          university?: string | null
          university_id?: string | null
          updated_at?: string
          verified?: boolean | null
          work_pin?: string | null
        }
        Update: {
          accepted_privacy_at?: string | null
          accepted_terms_at?: string | null
          avatar_storage_path?: string | null
          career_stage?: string | null
          clinician_role?: string | null
          clinician_tier?: string | null
          created_at?: string | null
          crew_network_opt_in?: boolean
          deleted_at?: string | null
          display_name?: string | null
          email?: string | null
          employer_name?: string | null
          employer_trust?: string | null
          employer_type?: string | null
          first_name?: string | null
          full_name?: string | null
          hcpc_number?: string | null
          hcpc_skipped?: boolean | null
          hcpc_verified?: boolean | null
          hourly_rate?: number | null
          id?: string
          last_name?: string | null
          learner_approved_at?: string | null
          learner_evidence_url?: string | null
          learner_expires_at?: string | null
          learner_status?: string | null
          newsletter_opt_in?: boolean | null
          onboarding_complete?: boolean | null
          onboarding_completed_at?: string | null
          permission_role?: string | null
          pin_hash?: string | null
          privacy_version?: string | null
          profile_completeness?: number
          registration_number?: string | null
          registration_type?: string | null
          role?: string | null
          role_category?: string | null
          role_other_text?: string | null
          service_type?: string | null
          stripe_customer_id?: string | null
          subscription_tier?: string | null
          terms_version?: string | null
          time_on_step?: Json | null
          trust_id?: string | null
          university?: string | null
          university_id?: string | null
          updated_at?: string
          verified?: boolean | null
          work_pin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_trust_id_fkey"
            columns: ["trust_id"]
            isOneToOne: false
            referencedRelation: "ambulance_trusts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notification_tokens: {
        Row: {
          app_version: string | null
          created_at: string
          deleted_at: string | null
          device_token: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          platform: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          created_at?: string
          deleted_at?: string | null
          device_token: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          platform: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          created_at?: string
          deleted_at?: string | null
          device_token?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          platform?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_notification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_links: {
        Row: {
          code: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          id: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          signup_date: string | null
        }
        Insert: {
          converted_at?: string | null
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          signup_date?: string | null
        }
        Update: {
          converted_at?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_id?: string
          signup_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          provider: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          start_date: string | null
          status: string
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          provider: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          start_date?: string | null
          status: string
          tier: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          start_date?: string | null
          status?: string
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          country: string
          created_at: string | null
          id: string
          is_hcpc_approved: boolean | null
          short_name: string | null
          uni_name: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          is_hcpc_approved?: boolean | null
          short_name?: string | null
          uni_name: string
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          is_hcpc_approved?: boolean | null
          short_name?: string | null
          uni_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          code: string
          created_at: string | null
          current_redemptions: number | null
          duration_days: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_redemptions: number | null
          tier_granted: string
        }
        Insert: {
          code: string
          created_at?: string | null
          current_redemptions?: number | null
          duration_days: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          tier_granted: string
        }
        Update: {
          code?: string
          created_at?: string | null
          current_redemptions?: number | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          tier_granted?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_updated_at_trigger: {
        Args: { schema_name: string; table_name: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
