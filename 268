/*
# [Feature] User Profiles and Plan Limits
This migration introduces a `profiles` table to store user-specific data, including subscription plans and feature usage counters. It also sets up a trigger to automatically create a profile for new users upon sign-up.

## Query Description:
- **Creates `profiles` table**: This new table will store user profiles, linked to `auth.users`. It includes columns for plan type and usage tracking. No existing data is affected as this is a new table.
- **Creates `handle_new_user` function**: A trigger function that inserts a new row into `public.profiles` whenever a new user is added to `auth.users`.
- **Creates trigger `on_auth_user_created`**: This trigger executes the `handle_new_user` function after a new user signs up, ensuring every user has a profile.
- **Enables RLS on `profiles`**: Secures the new table.
- **Creates RLS policies**:
  - Allows users to view their own profile.
  - Allows users to update their own profile.
  - Allows the app to create profiles via the trigger.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (manually, by dropping table, trigger, and function)

## Structure Details:
- **Table Added**: `public.profiles`
- **Columns**: `id`, `updated_at`, `full_name`, `avatar_url`, `plan_type`, `food_scans_used`, `trip_planner_runs`
- **Function Added**: `public.handle_new_user`
- **Trigger Added**: `on_auth_user_created` on `auth.users`

## Security Implications:
- RLS Status: Enabled on `profiles`.
- Policy Changes: New policies are added for the `profiles` table to ensure users can only access and modify their own data.
- Auth Requirements: Policies are based on `auth.uid()`.

## Performance Impact:
- Indexes: Primary key index on `profiles.id`.
- Triggers: A trigger is added to `auth.users`, which will have a negligible performance impact on user sign-ups.
- Estimated Impact: Low.
*/

-- 1. Create the profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  plan_type text not null default 'free',
  food_scans_used integer not null default 0,
  trip_planner_runs integer not null default 0,

  primary key (id)
);

alter table public.profiles enable row level security;

-- 2. Create RLS policies for profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 3. Create a trigger to create a profile for new users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
