-- Create theaters table
CREATE TABLE public.theaters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mumbai',
  screens INTEGER DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create showtimes table linking movies to theaters
CREATE TABLE public.showtimes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TEXT NOT NULL,
  screen_number INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 250,
  available_seats INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(movie_id, theater_id, show_date, show_time, screen_number)
);

-- Enable RLS
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;

-- Theaters are public read
CREATE POLICY "Anyone can view theaters"
  ON public.theaters FOR SELECT
  USING (true);

-- Showtimes are public read
CREATE POLICY "Anyone can view showtimes"
  ON public.showtimes FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_showtimes_movie_id ON public.showtimes(movie_id);
CREATE INDEX idx_showtimes_theater_id ON public.showtimes(theater_id);
CREATE INDEX idx_showtimes_date ON public.showtimes(show_date);