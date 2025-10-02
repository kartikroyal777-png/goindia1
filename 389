-- =================================================================
-- Comprehensive Schema Fix and Feature Addition
-- =================================================================
-- This migration script fixes several outstanding schema issues,
-- including the is_admin() function, the 'details' column on
-- locations, and the 'city_categories' relationship. It also
-- adds tables for new features and populates demo data.
-- =================================================================

-- Step 1: Create the is_admin function for RLS policies
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = user_id AND profiles.role = 'admin'
  );
END;
$$;

-- Step 2: Ensure the 'locations' table has the 'details' column
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS details jsonb;

-- Step 3: Ensure the 'locations' table has coordinate columns
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Step 4: Ensure the 'cities' table does NOT have a 'city_categories' column
-- This column was causing errors because it's a many-to-many relationship handled by a join table.
ALTER TABLE public.cities
DROP COLUMN IF EXISTS city_categories;

-- Step 5: Ensure the 'city_categories' join table exists
CREATE TABLE IF NOT EXISTS public.city_categories (
    city_id uuid NOT NULL REFERENCES public.cities ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories ON DELETE CASCADE,
    PRIMARY KEY (city_id, category_id)
);
-- Grant permissions for the join table
ALTER TABLE public.city_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.city_categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON public.city_categories FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Enable update for admins" ON public.city_categories FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Enable delete for admins" ON public.city_categories FOR DELETE USING (is_admin(auth.uid()));


-- Step 6: Ensure 'bargaining_price_guide' table exists
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
-- Grant permissions for the price guide
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.bargaining_price_guide FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON public.bargaining_price_guide FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Enable update for admins" ON public.bargaining_price_guide FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Enable delete for admins" ON public.bargaining_price_guide FOR DELETE USING (is_admin(auth.uid()));


-- Step 7: Ensure 'location_images' table exists with correct policies
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id uuid NOT NULL REFERENCES public.locations ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
-- Grant permissions for location images
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON public.location_images FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Enable update for admins" ON public.location_images FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Enable delete for admins" ON public.location_images FOR DELETE USING (is_admin(auth.uid()));


-- Step 8: Update Taj Mahal with comprehensive demo data
UPDATE public.locations
SET
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
      "historical_background": "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal. It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
      "cultural_significance": "A symbol of eternal love and a masterpiece of Mughal architecture, combining elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles.",
      "why_famous": "Recognized as a UNESCO World Heritage site and one of the New7Wonders of the World, attracting millions of visitors annually."
    },
    "opening_hours": {
      "daily_timings": {
        "Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset",
        "Thursday": "Sunrise to Sunset", "Friday": "Closed", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"
      },
      "weekly_closures": ["Friday"],
      "seasonal_changes": "Night viewing is available on 5 days a month around the full moon."
    },
    "best_time_to_visit": {
      "best_season": "October to March",
      "best_time_of_day": "Sunrise for ethereal beauty and fewer crowds, or sunset for dramatic lighting.",
      "festival_timing": "Taj Mahotsav, a 10-day arts and crafts fair, is held in February."
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR) - 13km away.",
      "nearest_railway_station": "Agra Cantt (AGC) - 6km away.",
      "last_mile_options": "Electric buses and golf carts are mandatory from the parking area to the entrance gate (about 1km).",
      "taxi_cost_estimate": "₹300-400 from Agra Cantt station."
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": ["Unofficial guides offering skip-the-line access.", "Overpriced photographers claiming to be official.", "Touts selling fake marble souvenirs."],
      "womens_safety_rating": "High, due to heavy security presence. Standard caution advised.",
      "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "Local Police", "number": "112"}]
    },
    "cultural_etiquette": {
      "dress_code": "Modest clothing is recommended. Cover shoulders and knees.",
      "dos_donts": ["Do remove shoes before entering the main mausoleum.", "Don''t bring food, drinks, or tobacco.", "Don''t touch the marble carvings."],
      "temple_etiquette": "Maintain silence and be respectful inside the mausoleum.",
      "photography_rules": "Photography is prohibited inside the main mausoleum. Drones are strictly forbidden."
    },
    "costs_money": {
      "ticket_prices": {"local": "₹50", "foreigner": "₹1100 + ₹200 for main mausoleum"},
      "avg_budget_per_day": "₹2000 (including ticket, guide, and local transport).",
      "haggling_info": "Haggling is common for souvenirs and transport outside the complex.",
      "digital_payment_availability": "Yes, UPI and cards are accepted at the official ticket counter."
    },
    "amenities": {
      "toilets": "Available, but can have long queues. Paid options are cleaner.",
      "wifi": "Limited free Wi-Fi near the entrance.",
      "seating": "Benches are available in the gardens.",
      "water_refills": "Water fountains are available.",
      "cloakrooms": "Lockers are available to store large bags and prohibited items."
    },
    "hygiene_index": {
      "rating": 4,
      "notes": "Complex is well-maintained. Toilets near the entrance are cleaner than those inside."
    },
    "guides": {
      "availability": "Official government-licensed guides are available at the ticket counter.",
      "booking_info": "Book through the official counter to avoid scams. Audio guides are also a good option."
    },
    "map_navigation": {
      "google_maps_link": "https://www.google.com/maps/place/Taj+Mahal/@27.1751448,78.0421422,15z"
    },
    "events_festivals": {
      "event_name": "Taj Mahotsav",
      "event_date": "February 18th to 27th annually",
      "type": "Cultural Fair"
    },
    "things_to_do": {
      "main_activities": ["Admire the architecture", "Stroll through the Mughal gardens", "Visit the interior mausoleum", "Take photos at the classic Diana bench"],
      "nearby_attractions": ["Agra Fort", "Mehtab Bagh (for sunset views of Taj)"]
    },
    "photo_spots": [
      {"title": "The Classic Bench", "description": "The iconic spot where Princess Diana sat, perfectly centered.", "image_url": "https://i.insider.com/5b9137332425291e008b4568?width=700", "map_link": ""},
      {"title": "From the Mosque", "description": "Frame the Taj through the archways of the adjacent mosque for a unique perspective.", "image_url": "https://www.tripsavvy.com/thmb/R4nU9xO_Qy2TGWaN-aHkM9JpB8I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-930433082-5b02f527a474be00365778a4.jpg", "map_link": ""},
      {"title": "Reflections in the Pool", "description": "Capture the perfect reflection on a calm day from the central water channel.", "image_url": "https://cdn.getyourguide.com/img/tour/5c52c9a91a20b.jpeg/97.jpg", "map_link": ""}
    ],
    "recommended_restaurants": [
      {"name": "Pinch of Spice", "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/12/32/73/a5/getlstd-property-photo.jpg", "map_link": "https://goo.gl/maps/example1"},
      {"name": "Esphahan, Oberoi", "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/0e/dc/57/a3/esphahan.jpg", "map_link": "https://goo.gl/maps/example2"}
    ],
    "recommended_hotels": [
      {"name": "The Oberoi Amarvilas", "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/2a/54/0c/3c/exterior.jpg", "map_link": "https://goo.gl/maps/example3"},
      {"name": "ITC Mughal", "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/2c/3e/2c/15/itc-mughal-a-luxury-collection.jpg", "map_link": "https://goo.gl/maps/example4"}
    ],
    "local_foods": [
      {"name": "Agra Petha", "shop": "Panchi Petha Store", "image_url": "https://www.hindustantimes.com/ht-img/img/2023/08/21/1600x900/petha_1692620616558_1692620623690.jpg", "map_link": "https://goo.gl/maps/example5"},
      {"name": "Bedai & Jalebi", "shop": "Deviram Sweets", "image_url": "https://www.chefspencil.com/wp-content/uploads/2022/01/Bedai-Jalebi.jpg.webp", "map_link": "https://goo.gl/maps/example6"}
    ],
    "influencer_videos": [
      {"title": "A Cinematic Guide to the Taj Mahal", "video_id": "qpOVIp1G3oA", "influencer_name": "Beautiful Destinations"},
      {"title": "Taj Mahal Drone View", "video_id": "A-rJ-8GCa_A", "influencer_name": "Nomadic Indian"}
    ]
  }'
WHERE name = 'Taj Mahal';
