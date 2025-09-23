/*
          # [Feature: Admin & Location Enhancements]
          This migration adds tables for category management and enhances locations to support multiple images.

          ## Query Description: [This script creates a 'categories' table, a 'city_categories' join table to link cities to categories, and adds an 'image_urls' array to the 'locations' table. It populates the new tables with existing data from the application's hardcoded values. This is a structural change and is not easily reversible without losing the new relationships.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: [true]
          - Reversible: [false]
          
          ## Structure Details:
          - Creates table: `public.categories`
          - Creates table: `public.city_categories`
          - Alters table: `public.locations` (adds `image_urls` column)
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Admin policies are applied for write access.]
          
          ## Performance Impact:
          - Indexes: [Primary keys and foreign keys are indexed.]
          - Triggers: [None]
          - Estimated Impact: [Low performance impact on existing queries.]
          */

-- 1. Create categories table
CREATE TABLE public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    icon text NOT NULL,
    emoji text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_name_key UNIQUE (name)
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON public.categories FOR INSERT WITH CHECK ( (select auth.email()) = 'kartikroyal777@gmail.com' );
CREATE POLICY "Enable update for admins" ON public.categories FOR UPDATE USING ( (select auth.email()) = 'kartikroyal777@gmail.com' );
CREATE POLICY "Enable delete for admins" ON public.categories FOR DELETE USING ( (select auth.email()) = 'kartikroyal777@gmail.com' );

-- 2. Populate categories table from existing mock data
INSERT INTO public.categories (id, name, icon, emoji) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Forts', 'castle', '🏰'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Lakes', 'waves', '🌊'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef2', 'Beaches', 'palmtree', '🏝️'),
('d4e5f6a7-b8c9-0123-4567-890abcdef3', 'Temples', 'building', '🛕'),
('e5f6a7b8-c9d0-1234-5678-90abcdef4', 'Wildlife', 'trees', '🐅'),
('f6a7b8c9-d0e1-2345-6789-0abcdef5', 'Trekking', 'mountain', '⛰️'),
('a7b8c9d0-e1f2-3456-7890-1abcdef6', 'Food', 'utensils', '🍛'),
('b8c9d0e1-f2a3-4567-8901-bcdef1234567', 'Markets', 'shopping-bag', '🛍️');

-- 3. Create city_categories join table
CREATE TABLE public.city_categories (
    city_id uuid NOT NULL,
    category_id uuid NOT NULL,
    CONSTRAINT city_categories_pkey PRIMARY KEY (city_id, category_id),
    CONSTRAINT city_categories_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id) ON DELETE CASCADE,
    CONSTRAINT city_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);
ALTER TABLE public.city_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.city_categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON public.city_categories FOR INSERT WITH CHECK ( (select auth.email()) = 'kartikroyal777@gmail.com' );
CREATE POLICY "Enable update for admins" ON public.city_categories FOR UPDATE USING ( (select auth.email()) = 'kartikroyal777@gmail.com' );
CREATE POLICY "Enable delete for admins" ON public.city_categories FOR DELETE USING ( (select auth.email()) = 'kartikroyal777@gmail.com' );

-- 4. Populate city_categories from old hardcoded map
-- This populates the relationships based on the previous logic in the app.
INSERT INTO public.city_categories (city_id, category_id)
SELECT c.id, cat.id
FROM public.cities c, public.categories cat
WHERE (c.name = 'Agra' AND cat.name IN ('Forts', 'Temples'))
   OR (c.name = 'Jaipur' AND cat.name IN ('Forts', 'Temples', 'Markets'))
   OR (c.name = 'Varanasi' AND cat.name IN ('Temples', 'Food'))
   OR (c.name = 'Goa' AND cat.name IN ('Beaches', 'Food'))
   OR (c.name = 'Kerala' AND cat.name IN ('Lakes', 'Beaches', 'Wildlife'))
   OR (c.name = 'Delhi' AND cat.name IN ('Forts', 'Temples', 'Markets', 'Food'))
ON CONFLICT (city_id, category_id) DO NOTHING;

-- 5. Add image_urls array to locations table to support multiple images
ALTER TABLE public.locations ADD COLUMN image_urls text[] DEFAULT ARRAY[]::text[] NOT NULL;

-- Update existing locations to have their main image in the new array
UPDATE public.locations
SET image_urls = array_append(image_urls, image_url)
WHERE image_url IS NOT NULL;
