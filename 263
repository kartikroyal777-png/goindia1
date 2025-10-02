-- Comprehensive Schema Fix and Feature Addition
-- This script is designed to be idempotent and fix previous migration errors.

-- 1. Create the is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = user_id AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure the 'details' column exists on 'locations'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'locations'
      AND column_name = 'details'
  ) THEN
    ALTER TABLE public.locations ADD COLUMN details jsonb;
  END IF;
END;
$$;

-- 3. Ensure lat/lon columns exist on 'locations'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='locations' AND column_name='latitude') THEN
    ALTER TABLE public.locations ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='locations' AND column_name='longitude') THEN
    ALTER TABLE public.locations ADD COLUMN longitude double precision;
  END IF;
END;
$$;

-- 4. Recreate city_categories table correctly
DROP TABLE IF EXISTS public.city_categories;
CREATE TABLE IF NOT EXISTS public.city_categories (
    city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (city_id, category_id)
);

-- 5. Recreate location_images table correctly
DROP TABLE IF EXISTS public.location_images;
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 6. Apply RLS policies safely
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cities;
CREATE POLICY "Enable read access for all users" ON public.cities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable admin write access" ON public.cities;
CREATE POLICY "Enable admin write access" ON public.cities FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.tehsils ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tehsils;
CREATE POLICY "Enable read access for all users" ON public.tehsils FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable admin write access" ON public.tehsils;
CREATE POLICY "Enable admin write access" ON public.tehsils FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.locations;
CREATE POLICY "Enable read access for all users" ON public.locations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable admin write access" ON public.locations;
CREATE POLICY "Enable admin write access" ON public.locations FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);

ALTER TABLE public.city_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.city_categories;
CREATE POLICY "Enable read access for all users" ON public.city_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable admin write access" ON public.city_categories;
CREATE POLICY "Enable admin write access" ON public.city_categories FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable admin write access" ON public.location_images;
CREATE POLICY "Enable admin write access" ON public.location_images FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.notifications;
CREATE POLICY "Enable read access for authenticated users" ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable admin write access" ON public.notifications;
CREATE POLICY "Enable admin write access" ON public.notifications FOR ALL USING (is_admin(auth.uid()));

-- 7. Update Taj Mahal with comprehensive demo data
UPDATE public.locations
SET 
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
      "historical_background": "An immense mausoleum of white marble, built between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal.",
      "cultural_significance": "A UNESCO World Heritage site and a jewel of Muslim art in India, globally recognized as a masterpiece of human creative genius.",
      "why_famous": "It is one of the New7Wonders of the World and a symbol of India''s rich history and romantic love."
    },
    "opening_hours": {
      "daily_timings": {"Saturday-Thursday": "30 minutes before sunrise to 30 minutes before sunset"},
      "weekly_closures": ["Friday"],
      "seasonal_changes": "Timings may vary slightly based on sunrise/sunset times."
    },
    "best_time_to_visit": {
      "best_season": "October to March",
      "best_time_of_day": "Sunrise for ethereal beauty and fewer crowds, or sunset for dramatic lighting.",
      "festival_timing": "Taj Mahotsav in February is a vibrant 10-day cultural festival held nearby."
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR) - 13km away.",
      "nearest_railway_station": "Agra Cantt (AGC) is the main station.",
      "last_mile_options": "Only electric vehicles are allowed near the monument. Take an e-rickshaw or golf cart from the parking area.",
      "taxi_cost_estimate": "₹300-400 from Agra Cantt station."
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": ["Beware of unofficial guides offering to skip lines.", "Decline offers for ''special'' photos from unauthorized photographers."],
      "womens_safety_rating": "Generally safe due to high security, but be cautious in surrounding crowded areas.",
      "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "Ambulance", "number": "102"}]
    },
    "cultural_etiquette": {
      "dress_code": "Modest clothing is recommended. Cover shoulders and knees.",
      "dos_donts": ["Do wear the provided shoe covers inside the main mausoleum.", "Don''t bring food, drinks, or tripods inside."],
      "temple_etiquette": "Maintain silence and be respectful inside the mausoleum.",
      "photography_rules": "Photography is prohibited inside the main mausoleum."
    },
    "costs_money": {
      "ticket_prices": {"local": "₹50", "foreigner": "₹1100 + ₹200 for main mausoleum"},
      "avg_budget_per_day": "₹2000 (including ticket, food, and local transport)",
      "haggling_info": "Haggling is common for auto-rickshaws and souvenirs outside the complex.",
      "digital_payment_availability": "Yes, tickets can be booked online. UPI is common in nearby shops."
    },
    "amenities": {
      "toilets": "Available, but can be crowded. Paid options outside are often cleaner.",
      "wifi": "No public WiFi available inside the complex.",
      "seating": "Benches are available in the gardens.",
      "water_refills": "Water fountains are available.",
      "cloakrooms": "Lockers are available to store large bags and prohibited items."
    },
    "hygiene_index": {
      "rating": 4,
      "notes": "The monument complex is very clean. Toilets can be busy."
    },
    "guides": {
      "availability": "Official licensed guides are available at the ticket counter.",
      "booking_info": "Book through the official ASI website or at the counter to avoid scams."
    },
    "map_navigation": {
      "google_maps_link": "https://www.google.com/maps/search/?api=1&query=Taj+Mahal"
    },
    "events_festivals": {
      "event_name": "Taj Mahotsav",
      "event_date": "February 18th to 27th annually",
      "type": "Cultural festival celebrating arts, crafts, and cuisine."
    },
    "things_to_do": {
      "main_activities": ["Admire the architecture", "Explore the surrounding gardens", "Visit the museum", "Take photos at the Diana bench"],
      "nearby_attractions": ["Agra Fort", "Mehtab Bagh"]
    },
    "photo_spots": [
      {"title": "The Classic Shot", "description": "From the main entrance gate with the reflecting pool.", "image_url": "https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1564507592333-c60657eea523", "map_link": ""},
      {"title": "Yamuna River View", "description": "From a boat on the Yamuna river at sunrise or sunset.", "image_url": "https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1524492412937-b28074a5d7da", "map_link": ""}
    ],
    "recommended_restaurants": [
      {"name": "Pinch of Spice", "image_url": "https://img-wrapper.vercel.app/image?url=https://media-cdn.tripadvisor.com/media/photo-s/1a/09/89/3c/getlstd-property-photo.jpg", "map_link": "https://www.google.com/maps/search/?api=1&query=Pinch+of+Spice,Agra"}
    ],
    "recommended_hotels": [
      {"name": "The Oberoi Amarvilas", "image_url": "https://img-wrapper.vercel.app/image?url=https://media-cdn.tripadvisor.com/media/photo-s/2c/3e/8c/d7/exterior.jpg", "map_link": "https://www.google.com/maps/search/?api=1&query=The+Oberoi+Amarvilas,Agra"}
    ],
    "local_foods": [
      {"name": "Agra Petha", "shop": "Panchi Petha Store", "image_url": "https://img-wrapper.vercel.app/image?url=https://www.seasonedpioneers.com/wp-content/uploads/2021/06/Agra-Petha.jpeg", "map_link": "https://www.google.com/maps/search/?api=1&query=Panchi+Petha+Store,Agra"}
    ],
    "influencer_videos": [
      {"title": "A Cinematic Tour of the Taj Mahal", "video_id": "qpOVIp1G3oA", "influencer_name": "Trotter-Nama"}
    ]
  }'
WHERE name = 'Taj Mahal';

-- Insert demo images for Taj Mahal
DELETE FROM public.location_images WHERE location_id = (SELECT id FROM public.locations WHERE name = 'Taj Mahal');
INSERT INTO public.location_images (location_id, image_url, alt_text) VALUES
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1564507592333-c60657eea523', 'Front view of Taj Mahal'),
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da', 'Taj Mahal from the side'),
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1548013146-72479768bada', 'Detailed view of Taj Mahal architecture');

-- 8. Create bargaining_price_guide table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bargaining_price_guide;
CREATE POLICY "Enable read access for all users" ON public.bargaining_price_guide FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable admin write access" ON public.bargaining_price_guide;
CREATE POLICY "Enable admin write access" ON public.bargaining_price_guide FOR ALL USING (is_admin(auth.uid()));
