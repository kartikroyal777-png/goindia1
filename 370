-- =================================================================
-- Final Schema & Features Migration
-- 
-- This is a consolidated and idempotent script designed to fix all
-- previous migration errors and introduce the final set of features.
-- It can be run safely even if parts of it have been applied before.
-- =================================================================

-- 1. Create the is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = user_id AND profiles.role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Ensure the 'details' column exists on the 'locations' table
-- This fixes the primary admin panel error.
DO $$
BEGIN
  IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='locations' and column_name='details') THEN
    ALTER TABLE public.locations ADD COLUMN details jsonb;
  END IF;
END $$;

-- 3. Ensure the 'latitude' and 'longitude' columns exist for the weather feature
DO $$
BEGIN
  IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='locations' and column_name='latitude') THEN
    ALTER TABLE public.locations ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='locations' and column_name='longitude') THEN
    ALTER TABLE public.locations ADD COLUMN longitude double precision;
  END IF;
END $$;

-- 4. Recreate city_categories policies idempotently
-- This fixes the 'policy already exists' migration error.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.city_categories;
CREATE POLICY "Enable read access for all users" ON public.city_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admins" ON public.city_categories;
CREATE POLICY "Enable insert for admins" ON public.city_categories FOR INSERT WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable update for admins" ON public.city_categories;
CREATE POLICY "Enable update for admins" ON public.city_categories FOR UPDATE USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable delete for admins" ON public.city_categories;
CREATE POLICY "Enable delete for admins" ON public.city_categories FOR DELETE USING (is_admin(auth.uid()));

-- 5. Ensure location_images table exists and has correct policies
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid NOT NULL,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.location_images ADD CONSTRAINT location_images_pkey PRIMARY KEY (id);
ALTER TABLE public.location_images ADD CONSTRAINT location_images_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;

ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admins" ON public.location_images;
CREATE POLICY "Enable insert for admins" ON public.location_images FOR INSERT WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable update for admins" ON public.location_images;
CREATE POLICY "Enable update for admins" ON public.location_images FOR UPDATE USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable delete for admins" ON public.location_images;
CREATE POLICY "Enable delete for admins" ON public.location_images FOR DELETE USING (is_admin(auth.uid()));

-- 6. Ensure notifications table policies are correct
DROP POLICY IF EXISTS "Enable read access for all users" ON public.notifications;
CREATE POLICY "Enable read access for all users" ON public.notifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admins" ON public.notifications;
CREATE POLICY "Enable insert for admins" ON public.notifications FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- 7. Add demo data for new features to Taj Mahal
UPDATE public.locations
SET details = jsonb_set(
    jsonb_set(
        jsonb_set(
            jsonb_set(
                jsonb_set(
                    details,
                    '{photo_spots}',
                    '[
                        {"title": "The Classic Bench Shot", "description": "The iconic bench where Princess Diana sat. Arrive early to get a clean shot.", "image_url": "https://images.unsplash.com/photo-1587135941940-24869e38a755?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=Taj+Mahal+bench"},
                        {"title": "Reflections from the Mosque", "description": "Stand near the mosque on the west side for beautiful reflections in the marble.", "image_url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=Taj+Mahal+mosque"}
                    ]'::jsonb
                ),
                '{recommended_restaurants}',
                '[
                    {"name": "Pinch of Spice", "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=Pinch+of+Spice+Agra"},
                    {"name": "Esphahan, Oberoi", "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=Esphahan+Oberoi+Agra"}
                ]'::jsonb
            ),
            '{recommended_hotels}',
            '[
                {"name": "The Oberoi Amarvilas", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=The+Oberoi+Amarvilas+Agra"},
                {"name": "ITC Mughal", "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=ITC+Mughal+Agra"}
            ]'::jsonb
        ),
        '{local_foods}',
        '[
            {"name": "Petha", "shop": "Panchi Petha Store", "image_url": "https://images.unsplash.com/photo-1625398403339-147a783353e0?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=Panchi+Petha+Store+Agra"},
            {"name": "Bedai & Jalebi", "shop": "Deviram Sweets", "image_url": "https://images.unsplash.com/photo-1606491056862-8c75a46f7966?w=400", "map_link": "https://www.google.com/maps/search/?api=1&query=Deviram+Sweets+Agra"}
        ]'::jsonb
    ),
    '{influencer_videos}',
    '[
        {"title": "A Cinematic Tour of the Taj", "video_id": "qpOVIp1G3oA", "influencer_name": "Travel Influencer"},
        {"title": "Taj Mahal Drone View", "video_id": "7E-hXl25oz4", "influencer_name": "Drone Explorer"}
    ]'::jsonb
)
WHERE name = 'Taj Mahal';

-- Update Taj Mahal coordinates if they are null
UPDATE public.locations
SET 
  latitude = 27.1751,
  longitude = 78.0421
WHERE name = 'Taj Mahal' AND (latitude IS NULL OR longitude IS NULL);

-- Add sample image to Taj Mahal gallery
INSERT INTO public.location_images (location_id, image_url, alt_text)
SELECT id, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', 'Taj Mahal from the side'
FROM public.locations WHERE name = 'Taj Mahal'
ON CONFLICT DO NOTHING;
