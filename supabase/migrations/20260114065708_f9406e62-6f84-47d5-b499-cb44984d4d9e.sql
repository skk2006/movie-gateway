-- Create seat category enum
CREATE TYPE public.seat_category AS ENUM ('regular', 'premium', 'vip');

-- Create seat_categories table for pricing tiers
CREATE TABLE public.seat_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category seat_category NOT NULL UNIQUE,
  price_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seat_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view seat categories
CREATE POLICY "Anyone can view seat categories"
ON public.seat_categories
FOR SELECT
USING (true);

-- Insert default categories
INSERT INTO public.seat_categories (name, category, price_multiplier, color, description) VALUES
  ('Regular', 'regular', 1.0, '#22c55e', 'Standard seating with good view'),
  ('Premium', 'premium', 1.5, '#3b82f6', 'Better viewing angle and extra legroom'),
  ('VIP', 'vip', 2.0, '#a855f7', 'Best seats with recliner and complimentary snacks');