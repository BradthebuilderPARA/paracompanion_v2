export interface MyDoc {
  id: string;
  user_id: string;
  storage_path: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  display_name?: string;
  tags: string[];
  review_date?: string; // ISO date string
  expiry_date?: string; // ISO date string
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MyDocShare {
  id: string;
  doc_id: string;
  owner_user_id: string;
  share_token: string;
  recipient_email?: string;
  expires_at: string;
  revoked_at?: string;
  accessed_at?: string;
  created_at: string;
  deleted_at?: string;
}

export type MyDocTag = 'SOP' | 'Guideline' | 'Personal' | 'Certificate';
