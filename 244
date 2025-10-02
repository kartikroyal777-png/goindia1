/*
  # [Operation] Rebuild Location Parameters
  [This script completely overhauls the 'locations' table to support a new, detailed 18-parameter structure. It drops all old parameter columns and adds new ones using the flexible 'jsonb' data type.]

  ## Query Description: [WARNING: This is a destructive operation. All data in the old location parameter columns (e.g., 'basic_info', 'safety_risks') will be permanently deleted. Data in core columns like 'name' and 'id' will be preserved. It is STRONGLY recommended to back up your 'locations' table before proceeding if you have existing data you wish to save.]
  
  ## Metadata:
  - Schema-Category: "Dangerous"
  - Impact-Level: "High"
  - Requires-Backup: true
  - Reversible: false
  
  ## Structure Details:
  - DROPS columns: basic_info, access_transport, safety_risks, local_insights, costs_money, amenities, food_stay
  - ADDS columns: about, opening_hours, best_time_to_visit, getting_here, safety_and_risks, local_insights_v2, costs_and_money, amenities_v2, food_and_stay, events_and_festivals, weather_and_air_quality, accessibility, nearby_essentials, crowd_and_experience, traveler_tips, google_reviews, thirty_sixty_view
  
  ## Security Implications:
  - RLS Status: Unchanged
  - Policy Changes: No
  - Auth Requirements: Admin
  
  ## Performance Impact:
  - Indexes: None
  - Triggers: None
  - Estimated Impact: Low. The operation will be fast on tables with a moderate number of rows.
*/

-- Step 1: Drop all old parameter columns if they exist.
-- This is a destructive change. Data in these columns will be lost.
ALTER TABLE public.locations
  DROP COLUMN IF EXISTS basic_info,
  DROP COLUMN IF EXISTS access_transport,
  DROP COLUMN IF EXISTS safety_risks,
  DROP COLUMN IF EXISTS local_insights,
  DROP COLUMN IF EXISTS costs_money,
  DROP COLUMN IF EXISTS amenities,
  DROP COLUMN IF EXISTS food_stay;

-- Step 2: Add all 18 new detailed parameter columns as 'jsonb'
-- We use 'jsonb' for its flexibility and performance with structured data.
-- Defaulting to '{}' ensures we don't have null issues in the frontend.
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS about jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS opening_hours jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS best_time_to_visit jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS getting_here jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS safety_and_risks jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS local_insights_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS costs_and_money jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS amenities_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS food_and_stay jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS events_and_festivals jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS weather_and_air_quality jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS accessibility jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS nearby_essentials jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS crowd_and_experience jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS traveler_tips jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS google_reviews jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS thirty_sixty_view jsonb DEFAULT '{}'::jsonb;

-- Step 3: Rename the columns that had name conflicts to their final names
ALTER TABLE public.locations RENAME COLUMN local_insights_v2 TO "local_insights";
ALTER TABLE public.locations RENAME COLUMN amenities_v2 TO "amenities";

-- Ensure RLS is enabled on the table, as adding columns can sometimes affect this.
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
