/*
# [Fix & Feature] Correct Categories and Add Image/Category Tables
This migration corrects a previous seeding error and properly introduces new tables for advanced content management, including city categories and multiple location images.

## Query Description:
This script creates three new tables: `categories`, `city_categories`, and `location_images`, and correctly seeds the `categories` table.
- `categories`: Stores a central list of categories (e.g., Forts, Beaches).
- `city_categories`: A join table linking cities to these categories (many-to-many).
- `location_images`: Allows associating multiple image URLs with a single location.
This script is idempotent; it uses `IF NOT EXISTS` and `ON CONFLICT` clauses to prevent errors if run multiple times.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the created tables)

## Structure Details:
- **New Tables:**
  - `public.categories` (id, name, icon, emoji, created_at)
  - `public.city_categories` (city_id, category_id)
  - `public.location_images` (id, location_id, image_url, alt_text, created_at)

## Security Implications:
- RLS Status: Enabled on all new tables.
- Policy Changes: Yes. New policies are created to allow public read access and grant full admin control to 'kartikroyal777@gmail.com'.
- Auth Requirements: Admin role is required for write operations.

## Performance Impact:
- Indexes: Primary keys and foreign keys are indexed automatically.
- Triggers: None.
- Estimated Impact: Negligible on existing operations.
*/

-- Step 1: Create the 'categories' table to store different content categories.
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying NOT NULL UNIQUE,
    icon character varying,
    emoji character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 2: Enable Row Level Security and define policies for the 'categories' table.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');


-- Step 3: Create the 'city_categories' join table.
CREATE TABLE IF NOT EXISTS public.city_categories (
    city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (city_id, category_id)
);

-- Step 4: Enable Row Level Security and define policies for the 'city_categories' table.
ALTER TABLE public.city_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.city_categories;
CREATE POLICY "Enable read access for all users" ON public.city_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage city categories" ON public.city_categories;
CREATE POLICY "Admins can manage city categories" ON public.city_categories FOR ALL
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');


-- Step 5: Create the 'location_images' table.
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 6: Enable Row Level Security and define policies for the 'location_images' table.
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage location images" ON public.location_images;
CREATE POLICY "Admins can manage location images" ON public.location_images FOR ALL
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');

-- Step 7: Seed the 'categories' table with initial data.
-- This uses ON CONFLICT to prevent errors if the migration is run again.
INSERT INTO public.categories (name, icon, emoji) VALUES
('Forts', 'castle', '🏰'),
('Lakes', 'waves', '🌊'),
('Beaches', 'palmtree', '🏝️'),
('Temples', 'building', '🛕'),
('Wildlife', 'trees', '🐅'),
('Trekking', 'mountain', '⛰️'),
('Food', 'utensils', '🍛'),
('Markets', 'shopping-bag', '🛍️')
ON CONFLICT (name) DO NOTHING;
