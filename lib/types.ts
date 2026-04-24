export type PackageStatus =
  | 'pending_payment' | 'created' | 'picked_up'
  | 'in_transit' | 'out_for_delivery' | 'delivered'
  | 'failed_delivery' | 'returned';

export const PACKAGE_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  CREATED: 'created',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED_DELIVERY: 'failed_delivery',
  RETURNED: 'returned',
} as const;

export const QUOTE_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  EXPIRED: 'expired',
  CONVERTED_TO_INVOICE: 'converted_to_invoice',
} as const;

export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  BITCOIN: 'bitcoin',
  ETHEREUM: 'ethereum',
  USDC: 'usdc',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const DELIVERY_TIME_SLOTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  EXPRESS: 'express',
  WEEKEND: 'weekend',
} as const;

export interface Package {
  id: number;
  tracking_id: string;
  sender_name: string;
  sender_address: string;
  sender_phone?: string;
  sender_email?: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone?: string;
  recipient_email?: string;
  package_description?: string;
  weight?: string;
  dimensions?: string;
  shipping_cost?: string;
  payment_method?: string;
  payment_status?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  scheduled_delivery_date?: string;
  scheduled_time_slot?: string;
  delivery_price_adjustment?: string;
  qr_code?: string;
  current_status: string;
  current_location?: string;
  delivery_instructions?: string;
  signature_required?: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: number;
  package_id: number;
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
  created_at: string;
}

export interface Quote {
  id: number;
  quote_number: string;
  sender_name: string;
  sender_email?: string;
  sender_phone?: string;
  sender_address: string;
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_address: string;
  package_description?: string;
  weight?: string;
  dimensions?: string;
  delivery_time_slot?: string;
  base_cost: string;
  delivery_fee?: string;
  total_cost: string;
  valid_until: string;
  status: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  quote_id?: number;
  package_id?: number;
  customer_name: string;
  customer_email: string;
  customer_address?: string;
  total_amount: string;
  tax_amount?: string;
  payment_method: string;
  payment_status?: string;
  paid_at?: string;
  due_date: string;
  items: any[];
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
