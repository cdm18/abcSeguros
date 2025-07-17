export interface User {
  id: number;
  username: string;
  password: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}