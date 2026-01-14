-- Add column to store seat details (IDs and categories)
ALTER TABLE public.bookings 
ADD COLUMN seat_details JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.bookings.seat_details IS 'Array of selected seats with their IDs and categories, e.g. [{"id": "A1", "category": "vip"}, {"id": "B2", "category": "premium"}]';