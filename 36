-- This migration fixes the is_admin function and consolidates the schema.

-- 1. Drop the faulty function if it exists to avoid conflicts.
DROP FUNCTION IF EXISTS public.is_admin(user_id uuid);

-- 2. Create the correct is_admin() function.
-- This function checks if the currently authenticated user's email is the admin email.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.email() = 'kartikroyal777@gmail.com';
$$;

-- Grant usage on the new function to roles that will use it in RLS
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;


-- 3. Ensure all necessary columns exist on the 'locations' table.
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='locations' AND column_name='details') THEN
    ALTER TABLE public.locations ADD COLUMN details jsonb;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='locations' AND column_name='latitude') THEN
    ALTER TABLE public.locations ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='locations' AND column_name='longitude') THEN
    ALTER TABLE public.locations ADD COLUMN longitude double precision;
  END IF;
END $$;


-- 4. Create 'location_images' table if it doesn't exist.
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Create 'bargaining_price_guide' table if it doesn't exist.
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


-- 6. Reset and apply all RLS policies using the correct is_admin() function.
-- Drop old policies first to prevent conflicts.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.locations;
DROP POLICY IF EXISTS "Enable all access for admin" ON public.locations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
DROP POLICY IF EXISTS "Enable all access for admin" ON public.location_images;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bargaining_price_guide;
DROP POLICY IF EXISTS "Enable all access for admin" ON public.bargaining_price_guide;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.notifications;
DROP POLICY IF EXISTS "Enable all access for admin" ON public.notifications;

-- Enable RLS on all relevant tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for 'locations'
CREATE POLICY "Enable read access for all users" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Enable all access for admin" ON public.locations FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Create policies for 'location_images'
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
CREATE POLICY "Enable all access for admin" ON public.location_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Create policies for 'bargaining_price_guide'
CREATE POLICY "Enable read access for all users" ON public.bargaining_price_guide FOR SELECT USING (true);
CREATE POLICY "Enable all access for admin" ON public.bargaining_price_guide FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Create policies for 'notifications'
CREATE POLICY "Enable read access for all users" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Enable all access for admin" ON public.notifications FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
