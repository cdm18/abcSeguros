export type PaymentStatus = 'PENDING' | 'ON_TIME' | 'LATE' | 'CANCELLED';

export interface Payment {
  id: number;
  policy_id: number;
  amount: number;
  due_date: string;
  paid_date?: string;
  status?: PaymentStatus;
  created_at?: string;
}