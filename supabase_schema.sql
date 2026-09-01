-- Schema for PISQA POS
-- Run this in your Supabase SQL Editor

CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  mesa text NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pendiente',
  payment_method text
);

-- Turn on Row Level Security (optional for a simple POS, but good practice)
-- If you want to disable it so you don't need auth, run:
-- ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Allow anonymous access for the POS (since there is no user login per se, just a passcode in frontend)
CREATE POLICY "Enable read access for all users" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for all users" ON "public"."orders"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON "public"."orders"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON "public"."orders"
AS PERMISSIVE FOR DELETE
TO public
USING (true);
