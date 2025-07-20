export interface PlanBase {
  id: number;
  code: string;
  name: string;
  company_id: number | null;
  base_premium: number;
  description: string;
  price_monthly: number;
  price_yearly: number;
  coverage: string[];
  benefits: string[];
  created_at: string;

}
