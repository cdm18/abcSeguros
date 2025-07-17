export interface Client {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  birth_date?: string;      // formato: YYYY-MM-DD
  city?: string;
  occupation?: string;
  income?: number;
  address?: string;
  created_at?: string;
}
