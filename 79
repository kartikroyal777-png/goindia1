/*
          # [Operation Name]
          Overhaul 'locations' table with detailed JSONB columns

          ## Query Description: "This operation will completely restructure the 'locations' table by replacing several old columns with new, more detailed JSONB columns. This is a destructive change for the dropped columns, but it enables much richer content management. Existing location data in the old columns will be lost. It is highly recommended to back up your 'locations' table before applying this migration if you have important data."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - Table: public.locations
          - Dropped Columns: `basic_info`, `access_transport`, `safety_risks`, `local_insights`, `costs_money`, `amenities`, `food_stay`
          - Added Columns: `about`, `opening_hours`, `best_time_to_visit`, `transport`, `safety`, `etiquette`, `costs`, `amenities_v2`, `food_stay_v2`, `events`, `accessibility`, `essentials`, `experience`, `insider_tips`, `reviews`, `virtual_tour_url`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Updating existing policies to include new columns)
          - Auth Requirements: Admin role
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Low. This is a structural change and should not significantly impact query performance for typical app usage.
          */

-- Drop old columns
ALTER TABLE public.locations
  DROP COLUMN IF EXISTS basic_info,
  DROP COLUMN IF EXISTS access_transport,
  DROP COLUMN IF EXISTS safety_risks,
  DROP COLUMN IF EXISTS local_insights,
  DROP COLUMN IF EXISTS costs_money,
  DROP COLUMN IF EXISTS amenities,
  DROP COLUMN IF EXISTS food_stay;

-- Add new detailed columns with defaults to prevent null issues
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS about jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS opening_hours jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS best_time_to_visit jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS transport jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS safety jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS etiquette jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS costs jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS amenities_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS food_stay_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS events jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS accessibility jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS essentials jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS insider_tips jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS virtual_tour_url text;

-- Rename new amenity and food columns to avoid conflicts if script is run multiple times
ALTER TABLE public.locations RENAME COLUMN IF EXISTS amenities_v2 TO amenities;
ALTER TABLE public.locations RENAME COLUMN IF EXISTS food_stay_v2 TO food_stay;

-- Recreate the policy to ensure it covers the new columns for admin
DROP POLICY IF EXISTS "Admin has full access" ON public.locations;
CREATE POLICY "Admin has full access"
ON public.locations
FOR ALL
TO authenticated
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');

-- Ensure public can read all location data
DROP POLICY IF EXISTS "Locations are publicly visible" ON public.locations;
CREATE POLICY "Locations are publicly visible"
ON public.locations
FOR SELECT
TO public
USING (true);
