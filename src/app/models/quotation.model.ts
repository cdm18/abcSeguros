export type QuotationStatus = 'NEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Quotation {
  id: number;
  client_id: number;
  plan_id: number;
  quoted_by: number;
  quote_amount: number;
  status?: QuotationStatus;
  created_at?: string;
}