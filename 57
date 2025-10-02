-- =================================================================
--  Comprehensive Schema Fix and Feature Addition
--  This migration fixes previous errors, adds new features,
--  and ensures the database schema is stable.
-- =================================================================

-- Step 1: Create the is_admin function for RLS policies
-- This function is central to securing admin-only actions.
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id AND email = 'kartikroyal777@gmail.com'
  );
END;
$$;

-- Step 2: Alter the locations table to add missing columns
-- This is the critical fix for the "details column not found" error.
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS details jsonb,
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric;

-- Step 3: Create the location_images table for the image gallery
-- This table was previously defined incorrectly, causing migration failures.
CREATE TABLE IF NOT EXISTS public.location_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Step 4: Create the bargaining_price_guide table for the Bargaining Coach
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamptz DEFAULT now()
);

-- Step 5: Set up and correct all Row Level Security (RLS) policies
-- This ensures data is secure and accessible to the right users.

-- Policy for locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to locations" ON public.locations;
CREATE POLICY "Allow public read access to locations" ON public.locations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin full access to locations" ON public.locations;
CREATE POLICY "Allow admin full access to locations" ON public.locations FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Policy for location_images
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to location images" ON public.location_images;
CREATE POLICY "Allow public read access to location images" ON public.location_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin full access to location images" ON public.location_images;
CREATE POLICY "Allow admin full access to location images" ON public.location_images FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Policy for bargaining_price_guide
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read access to price guide" ON public.bargaining_price_guide;
CREATE POLICY "Allow authenticated read access to price guide" ON public.bargaining_price_guide FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow admin full access to price guide" ON public.bargaining_price_guide;
CREATE POLICY "Allow admin full access to price guide" ON public.bargaining_price_guide FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Policy for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read access to notifications" ON public.notifications;
CREATE POLICY "Allow authenticated read access to notifications" ON public.notifications FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow admin full access to notifications" ON public.notifications;
CREATE POLICY "Allow admin full access to notifications" ON public.notifications FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Step 6: Populate the Taj Mahal with rich demo data for all parameters
-- This provides a complete example for the newly designed location page.
WITH taj_mahal_location AS (
  SELECT id FROM public.locations WHERE name = 'Taj Mahal' LIMIT 1
)
UPDATE public.locations
SET
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
        "historical_background": "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.",
        "cultural_significance": "It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
        "why_famous": "A symbol of eternal love and an architectural marvel."
    },
    "opening_hours": {
        "daily_timings": {"Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset", "Thursday": "Sunrise to Sunset", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"},
        "weekly_closures": ["Friday"],
        "seasonal_changes": "Timings may vary slightly based on sunrise/sunset times."
    },
    "best_time_to_visit": {
        "best_season": "October to March",
        "best_time_of_day": "Sunrise for ethereal beauty and fewer crowds, or sunset for a golden glow.",
        "festival_timing": "Taj Mahotsav in February is a vibrant 10-day cultural festival held nearby."
    },
    "transport": {
        "nearest_airport": "Agra Airport (AGR) - approx. 13 km away.",
        "nearest_railway_station": "Agra Cantt (AGC) is the main station, approx. 6 km away.",
        "last_mile_options": "From the parking area, take a battery-powered bus or golf cart as polluting vehicles are not allowed near the monument.",
        "taxi_cost_estimate": "₹200-300 from Agra Cantt station."
    },
    "safety_risks": {
        "safety_score": 9,
        "scams_warnings": ["Be wary of unofficial guides offering to skip lines.", "Ignore gem sellers claiming to be government approved."],
        "womens_safety_rating": "Generally very safe due to high security, but be cautious in surrounding crowded areas.",
        "emergency_contacts": [{"name": "Tourist Police Helpline", "number": "1363"}, {"name": "Local Police", "number": "112"}]
    },
    "cultural_etiquette": {
        "dress_code": "Modest clothing is recommended; cover shoulders and knees.",
        "dos_donts": ["Do respect the sanctity of the mausoleum.", "Don''t bring food, drinks (except water), or tripods inside."],
        "temple_etiquette": "As a mausoleum, maintain silence and decorum inside the main tomb.",
        "photography_rules": "Photography is prohibited inside the main mausoleum."
    },
    "costs_money": {
        "ticket_prices": {"local": "₹50", "foreigner": "₹1100 + ₹200 (optional main mausoleum)"},
        "avg_budget_per_day": "₹1500-2000 per person (including ticket and local transport).",
        "haggling_info": "Haggling is common for auto-rickshaws and souvenirs outside the complex.",
        "digital_payment_availability": "Yes, UPI and cards are accepted at the official ticket counter."
    },
    "amenities": {
        "toilets": "Available, but cleanliness can vary. Paid toilets outside are often better.",
        "wifi": "Free Wi-Fi is available for a limited duration.",
        "seating": "Benches are available in the gardens.",
        "water_refills": "Water fountains are available.",
        "cloakrooms": "Available near the entrance to store large bags and prohibited items."
    },
    "food_stay": {
        "local_shops_street_food": "Agra is famous for Petha (a sweet) and chaat. Try these from reputable shops.",
        "dishes_to_try": "Mughlai cuisine, Bedai & Jalebi for breakfast.",
        "recommended_restaurants": ["Pinch of Spice", "Esphahan at The Oberoi"],
        "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal", "Hotel Taj Resorts"]
    },
    "events_festivals": {
        "event_name": "Taj Mahotsav",
        "event_date": "February 18th to 27th annually",
        "type": "Cultural festival celebrating arts, crafts, and cuisine."
    },
    "weather_air_quality": {
        "seasonal_trends": "Winters (Nov-Feb) are cool and pleasant. Summers (Apr-Jun) are extremely hot. Monsoon (Jul-Sep) is humid."
    },
    "accessibility": {
        "wheelchair_access": "Yes, ramps and accessible toilets are available. Wheelchairs can be requested.",
        "english_speaking_guides": "Official English-speaking guides are available for hire inside.",
        "foreigner_friendly_services": "Separate ticket counter for foreigners often results in shorter queues."
    },
    "nearby_essentials": {
        "atms": "Available near both East and West gate ticket counters.",
        "pharmacies": "Several pharmacies are located in the Taj Ganj area.",
        "hospitals": "S.N. Medical College and Hospital is a major government hospital.",
        "police_stations": "Tourist Police Station is located near the complex."
    },
    "crowd_experience": {
        "avg_crowd_density": "High, especially on weekends and holidays.",
        "best_crowd_free_hours": "Early morning right at opening time (around 6 AM).",
        "type_of_visitors": "Tourists, families, couples, history enthusiasts."
    },
    "traveler_tips": {
        "hacks": "Buy your ticket online to save time. The East gate generally has shorter queues than the West gate.",
        "hidden_gems": "Visit Mehtab Bagh on the opposite bank of the river for a stunning sunset view of the Taj.",
        "scam_avoidance": "Only hire licensed guides from within the complex.",
        "photography_spots": "The classic shot is from the main entrance. Also try the mosque or guest house on either side for different angles."
    },
    "google_reviews": {
        "live_rating": "4.6",
        "top_traveler_quotes": ["A sight that will stay with you forever.", "More beautiful in person than any picture can capture."]
    },
    "virtual_tour": {
        "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/"
    },
    "hygiene_index": {
      "rating": 4,
      "notes": "Complex is well-maintained. Toilets can be crowded."
    },
    "visa_foreigner_rules": {
      "visa_info": "Most nationalities can get an e-Visa online before arrival.",
      "permits": "No special permits required for the Taj Mahal itself."
    },
    "things_to_do": {
      "main_activities": ["Admire the architecture", "Walk through the gardens", "Visit the mausoleum"],
      "nearby_attractions": ["Agra Fort", "Itimad-ud-Daulah (Baby Taj)"]
    },
    "map_navigation": {
      "google_maps_link": "https://goo.gl/maps/yV2m3h6k4s82"
    },
    "guides": {
      "availability": "Official government-licensed guides available at the entrance.",
      "booking_info": "Hire on the spot. Do not engage with touts outside."
    }
  }'::jsonb
WHERE id = (SELECT id FROM taj_mahal_location);

-- Step 7: Insert gallery images for the Taj Mahal
-- This populates the new location_images table.
WITH taj_mahal_location AS (
  SELECT id FROM public.locations WHERE name = 'Taj Mahal' LIMIT 1
)
INSERT INTO public.location_images (location_id, image_url, alt_text)
VALUES
  ((SELECT id FROM taj_mahal_location), 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', 'The Taj Mahal from the main entrance'),
  ((SELECT id FROM taj_mahal_location), 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop', 'A different angle of the Taj Mahal'),
  ((SELECT id FROM taj_mahal_location), 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop', 'Intricate marble details on the Taj Mahal walls')
ON CONFLICT DO NOTHING;
