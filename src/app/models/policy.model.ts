export type PolicyStatus = 'ACTIVE' | 'PENDING' | 'LATE' | 'CANCELLED';

export interface Policy {
  id: number;
  client_id: number;
  plan_id: number;
  policy_number: string;
  start_date: string;
  end_date: string;
  total_premium: number;
  status?: PolicyStatus;
  created_from_q?: number;
  created_at?: string;
}