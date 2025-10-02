-- =================================================================
--  Fix is_admin function and dependent RLS policies
-- =================================================================

-- Drop the old function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS is_admin(user_id uuid);

-- Create a new, correct is_admin function that checks the email directly
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id AND email = 'kartikroyal777@gmail.com'
  );
END;
$$;

-- Re-apply policies on all tables to use the correct function
-- This ensures admins have full access
ALTER POLICY "Enable all access for admins" ON public.locations
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable all access for admins" ON public.location_images
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable all access for admins" ON public.cities
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
  
ALTER POLICY "Enable all access for admins" ON public.tehsils
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable all access for admins" ON public.notifications
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
  
ALTER POLICY "Enable all access for admins" ON public.phrases
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable all access for admins" ON public.bargaining_price_guide
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable all access for admins" ON public.city_categories
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));


-- =================================================================
--  Create `saved_places` table for saving locations
-- =================================================================
CREATE TABLE IF NOT EXISTS public.saved_places (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, location_id)
);

-- RLS Policies for saved_places
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.saved_places;
CREATE POLICY "Enable read access for all users" ON public.saved_places
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own saved places" ON public.saved_places;
CREATE POLICY "Users can insert their own saved places" ON public.saved_places
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved places" ON public.saved_places;
CREATE POLICY "Users can delete their own saved places" ON public.saved_places
  FOR DELETE USING (auth.uid() = user_id);


-- =================================================================
--  Create `saved_trips` table for the Trip Planner
-- =================================================================
CREATE TABLE IF NOT EXISTS public.saved_trips (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_details jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS Policies for saved_trips
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own trips" ON public.saved_trips;
CREATE POLICY "Users can manage their own trips" ON public.saved_trips
  FOR ALL USING (auth.uid() = user_id);

-- =================================================================
--  Fix for `city_categories` admin panel issue
-- =================================================================
-- The primary fix is in the frontend code, but we ensure the RLS is correct.
-- This policy allows authenticated users to read the city-category links.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.city_categories;
CREATE POLICY "Enable read access for all users" ON public.city_categories
  FOR SELECT USING (true);
