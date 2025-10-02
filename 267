/*
  ## 2025-10-28: Add Profiles and Usage Tracking (Idempotent)

  This migration creates the `profiles` table to store user-specific data, including their subscription plan and usage of premium features. It also sets up a trigger to automatically create a profile for each new user who signs up.

  This version is idempotent and safe to re-run. It uses `IF NOT EXISTS` to prevent errors if objects already exist.
*/

-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  plan_type text NOT NULL DEFAULT 'free'::text,
  food_scans_used integer NOT NULL DEFAULT 0,
  trip_planner_runs integer NOT NULL DEFAULT 0
);

-- Add comments to the table and columns
COMMENT ON TABLE public.profiles IS 'Stores public-facing user data and subscription details.';
COMMENT ON COLUMN public.profiles.id IS 'References the internal auth.users table.';
COMMENT ON COLUMN public.profiles.plan_type IS 'User subscription plan (free or paid).';
COMMENT ON COLUMN public.profiles.food_scans_used IS 'Counter for food scanner feature usage.';
COMMENT ON COLUMN public.profiles.trip_planner_runs IS 'Counter for trip planner feature usage.';

-- Set up Row Level Security for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
-- 1. Allow users to see their own profile
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Create a trigger to call the function when a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
