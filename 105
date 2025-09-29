-- Migration to fix admin role issue and add features for saved places and trips.

/*
# [Operation 1: Add Role to Profiles]
[Adds a 'role' column to the 'profiles' table to manage user permissions, fixing an RLS-related error.]

## Query Description: [This operation adds a new 'role' column to your user profiles table. It defaults to 'user' for all existing users. It is a non-destructive structural change.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.profiles
- Column Added: role (TEXT)

## Security Implications:
- RLS Status: [Unaffected by this specific statement, but enables role-based policies]
- Policy Changes: [No]
- Auth Requirements: [Admin privileges to alter table]
*/
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

/*
# [Operation 2: Assign Admin Role]
[Assigns the 'admin' role to the specified admin user to grant elevated permissions.]

## Query Description: [This updates a single user's profile to set their role to 'admin'. This is critical for the admin panel functionality. Ensure the email is correct.]

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.profiles
- Column Updated: role

## Security Implications:
- RLS Status: [Enables admin access based on this role.]
- Policy Changes: [No]
- Auth Requirements: [Admin privileges to update table]
*/
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'kartikroyal777@gmail.com');

/*
# [Operation 3: Create saved_locations Table]
[Creates a new table to store locations saved by users.]

## Query Description: [This creates the 'saved_locations' table to link users to their favorite locations. This is a new, non-destructive addition to your schema.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table Created: public.saved_locations
- Columns: user_id, location_id, created_at

## Security Implications:
- RLS Status: [Will be enabled]
- Policy Changes: [Yes, new policies will be added]
- Auth Requirements: [Admin privileges to create table]
*/
CREATE TABLE IF NOT EXISTS public.saved_locations (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, location_id)
);

/*
# [Operation 4: Enable RLS and Define Policies for saved_locations]
[Secures the 'saved_locations' table so users can only access their own saved data.]

## Query Description: [This enables Row Level Security on the new 'saved_locations' table and adds policies to ensure users can only create, view, and delete their own saved locations. This is a critical security measure.]

## Metadata:
- Schema-Category: ["Security"]
- Impact-Level: ["Medium"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.saved_locations

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Authenticated user]
*/
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to view their own saved locations" ON public.saved_locations;
CREATE POLICY "Allow authenticated users to view their own saved locations"
ON public.saved_locations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated users to save locations" ON public.saved_locations;
CREATE POLICY "Allow authenticated users to save locations"
ON public.saved_locations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated users to delete their own saved locations" ON public.saved_locations;
CREATE POLICY "Allow authenticated users to delete their own saved locations"
ON public.saved_locations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

/*
# [Operation 5: Create trips Table]
[Creates a new table to store user-generated trip itineraries.]

## Query Description: [This creates the 'trips' table for the Trip Planner feature. It will store user preferences and generated itineraries as JSON. This is a new, non-destructive addition.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table Created: public.trips
- Columns: id, user_id, title, preferences, itinerary, created_at, updated_at

## Security Implications:
- RLS Status: [Will be enabled]
- Policy Changes: [Yes, new policies will be added]
- Auth Requirements: [Admin privileges to create table]
*/
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    preferences JSONB,
    itinerary JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

/*
# [Operation 6: Enable RLS and Define Policies for trips]
[Secures the 'trips' table so users can only manage their own trip plans.]

## Query Description: [This enables Row Level Security on the new 'trips' table and adds policies to ensure users can only create, view, update, and delete their own trips. This is a critical security measure.]

## Metadata:
- Schema-Category: ["Security"]
- Impact-Level: ["Medium"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.trips

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Authenticated user]
*/
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to manage their own trips" ON public.trips;
CREATE POLICY "Allow authenticated users to manage their own trips"
ON public.trips FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

/*
# [Operation 7: Create function to check admin role]
[Creates a helper function to check if the current user is an admin.]

## Query Description: [This function simplifies RLS policies by providing a reusable way to check if a user has the 'admin' role. It improves maintainability.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Function Created: public.is_admin()

## Security Implications:
- RLS Status: [Used by RLS policies]
- Policy Changes: [No]
- Auth Requirements: [N/A]
*/
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/*
# [Operation 8: Secure locations table with admin-only write access]
[Updates RLS policies on the 'locations' table to allow any authenticated user to read, but only admins to write.]

## Query Description: [This is a critical security update. It ensures that all users can view location data, but only users with the 'admin' role can create, update, or delete locations. This prevents unauthorized modifications to your core content.]

## Metadata:
- Schema-Category: ["Security"]
- Impact-Level: ["High"]
- Requires-Backup: [true]
- Reversible: [true]

## Structure Details:
- Table: public.locations

## Security Implications:
- RLS Status: [Enabled/Modified]
- Policy Changes: [Yes]
- Auth Requirements: [Admin for write, Authenticated for read]
*/
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users to read locations" ON public.locations;
CREATE POLICY "Allow all authenticated users to read locations"
ON public.locations FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admins to manage locations" ON public.locations;
CREATE POLICY "Allow admins to manage locations"
ON public.locations FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
