export interface PlanOption {
  id: number;
  base_plan_id: number;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  coverage: string[];
  benefits: string[];
}
