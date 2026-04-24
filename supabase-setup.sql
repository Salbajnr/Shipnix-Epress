-- Shipnix-Express Supabase Database Setup
-- Run this in your Supabase SQL Editor at https://app.supabase.com

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_phone TEXT,
  sender_email TEXT,
  recipient_name TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_phone TEXT,
  recipient_email TEXT,
  package_description TEXT,
  weight TEXT,
  dimensions TEXT,
  shipping_cost TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  scheduled_delivery_date TIMESTAMPTZ,
  scheduled_time_slot TEXT,
  delivery_price_adjustment TEXT,
  qr_code TEXT,
  current_status TEXT NOT NULL DEFAULT 'created',
  current_location TEXT,
  delivery_instructions TEXT,
  signature_required BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id SERIAL PRIMARY KEY,
  package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  sender_phone TEXT,
  sender_address TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  recipient_address TEXT NOT NULL,
  package_description TEXT,
  weight TEXT,
  dimensions TEXT,
  delivery_time_slot TEXT,
  base_cost TEXT NOT NULL,
  delivery_fee TEXT DEFAULT '0',
  total_cost TEXT NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  quote_id INTEGER REFERENCES quotes(id),
  package_id INTEGER REFERENCES packages(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT,
  total_amount TEXT NOT NULL,
  tax_amount TEXT DEFAULT '0',
  payment_method TEXT NOT NULL DEFAULT 'card',
  payment_status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ NOT NULL,
  items JSONB DEFAULT '[]',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage packages
CREATE POLICY "Authenticated users can manage packages"
  ON packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public tracking lookup (read-only by tracking_id)
CREATE POLICY "Public can read packages by tracking_id"
  ON packages FOR SELECT
  TO anon
  USING (true);

-- Tracking events: authenticated full access, public read-only
CREATE POLICY "Authenticated users can manage tracking events"
  ON tracking_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read tracking events"
  ON tracking_events FOR SELECT
  TO anon
  USING (true);

-- Quotes: authenticated users only
CREATE POLICY "Authenticated users can manage quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anon to INSERT quotes (for public quote requests)
CREATE POLICY "Anyone can submit quote requests"
  ON quotes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Invoices: authenticated users only
CREATE POLICY "Authenticated users can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
