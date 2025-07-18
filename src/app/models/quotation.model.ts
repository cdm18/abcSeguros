/* quotation.model.ts */
import { Client }    from './client.model';
import { PlanBase }  from './plan-base.model';

export type QuotationStatus = 'NEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Quotation {
  id: number;
  client_id: number;
  plan_id: number;
  /** NUEVO ↓ */
  plan_option_id?: number | null;

  quoted_by: number;
  quote_amount: number;
  status?: QuotationStatus;
  created_at?: string;

  /* datos relacionados opcionales */
  client?: Client;
  plan?:   PlanBase;
}
