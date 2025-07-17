export interface Plan {
  id: number;
  code: string;
  name: string;
  company_id?: number;
  base_premium: number;
  created_at?: string;
}