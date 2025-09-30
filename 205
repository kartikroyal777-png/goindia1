/*
# [Operation Name]
Location Schema Overhaul

## Query Description: [This operation completely overhauls the `locations` table to support a much richer, structured data format. It drops several old columns and replaces them with new `jsonb` columns to store detailed information about each location as per the new requirements. This is a destructive change for the dropped columns, but necessary for the new features.]

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- **Table Affected:** `public.locations`
- **Columns Dropped:** `basic_info`, `access_transport`, `safety_risks`, `local_insights`, `costs_money`, `amenities`, `food_stay`.
- **Columns Added:** `about_location`, `opening_hours`, `best_time_to_visit_v2`, `getting_here`, `safety_risks_v2`, `local_insights_v2`, `costs_money_v2`, `amenities_v2`, `food_stay_v2`, `events_festivals`, `weather_air_quality`, `accessibility`, `nearby_essentials`, `crowd_experience`, `traveler_tips`, `google_reviews`, `virtual_tour`. All new columns are of type `jsonb`.

## Security Implications:
- RLS Status: Unchanged. Existing policies will apply.
- Policy Changes: No.
- Auth Requirements: Admin privileges required to run this migration.

## Performance Impact:
- Indexes: No indexes are added or removed.
- Triggers: No triggers are affected.
- Estimated Impact: This is a schema change and will be fast on tables with few rows. It will require a full table rewrite, which could be slow on very large tables.
*/

-- Step 1: Drop all old, deprecated columns from the locations table.
-- Using IF EXISTS to make the script safe and re-runnable.
ALTER TABLE public.locations
  DROP COLUMN IF EXISTS basic_info,
  DROP COLUMN IF EXISTS access_transport,
  DROP COLUMN IF EXISTS safety_risks,
  DROP COLUMN IF EXISTS local_insights,
  DROP COLUMN IF EXISTS costs_money,
  DROP COLUMN IF EXISTS amenities,
  DROP COLUMN IF EXISTS food_stay;

-- Step 2: Add all the new, comprehensive JSONB columns.
-- We use a `_v2` suffix where a similar name might have existed to avoid conflicts.
-- The default value is an empty JSON object.
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS about_location jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS opening_hours jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS best_time_to_visit_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS getting_here jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS safety_risks_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS local_insights_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS costs_money_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS amenities_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS food_stay_v2 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS events_festivals jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS weather_air_quality jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS accessibility jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS nearby_essentials jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS crowd_experience jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS traveler_tips jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS google_reviews jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS virtual_tour jsonb DEFAULT '{}'::jsonb;
