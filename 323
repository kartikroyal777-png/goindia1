/*
  # [Function] is_admin
  [Creates a function to check if the current user is the application admin.]
  ## Query Description: [This function checks if the authenticated user's email matches the hardcoded admin email. It's used in RLS policies to grant admin privileges.]
  ## Metadata:
  - Schema-Category: ["Structural"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]
*/
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search_path
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'kartikroyal777@gmail.com'
  );
END;
$$;

/*
  # [Table] bargaining_price_guide
  [Creates the table to store price guides for the bargaining coach.]
  ## Query Description: [This creates a new table for managing bargaining price data. No existing data is affected.]
  ## Metadata:
  - Schema-Category: ["Structural"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]
*/
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for bargaining_price_guide
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.bargaining_price_guide;
CREATE POLICY "Allow public read access" ON public.bargaining_price_guide FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access" ON public.bargaining_price_guide;
CREATE POLICY "Allow admin full access" ON public.bargaining_price_guide FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


/*
  # [Table] location_images
  [Creates the table to store multiple images for each location.]
  ## Query Description: [This creates a new table for location images. No existing data is affected.]
  ## Metadata:
  - Schema-Category: ["Structural"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]
*/
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for location_images
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.location_images;
CREATE POLICY "Allow public read access" ON public.location_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access" ON public.location_images;
CREATE POLICY "Allow admin full access" ON public.location_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


/*
  # [Alter Table] locations
  [Adds new columns to the locations table for detailed information and coordinates.]
  ## Query Description: [This adds 'details' (jsonb), 'latitude' (float), and 'longitude' (float) columns to the 'locations' table. This is a non-destructive operation.]
  ## Metadata:
  - Schema-Category: ["Structural"]
  - Impact-Level: ["Medium"]
  - Requires-Backup: [false]
  - Reversible: [false] -- Dropping columns could lose data
*/
-- Add columns only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='locations' AND column_name='details') THEN
    ALTER TABLE public.locations ADD COLUMN details jsonb;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='locations' AND column_name='latitude') THEN
    ALTER TABLE public.locations ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='locations' AND column_name='longitude') THEN
    ALTER TABLE public.locations ADD COLUMN longitude double precision;
  END IF;
END $$;


/*
  # [RLS Policies] locations, notifications
  [Updates RLS policies for locations and notifications to use the new is_admin function.]
  ## Query Description: [Replaces existing policies to ensure only admins can write data.]
  ## Metadata:
  - Schema-Category: ["Security"]
  - Impact-Level: ["Medium"]
  - Requires-Backup: [false]
  - Reversible: [true]
*/
-- RLS for locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin full access" ON public.locations;
CREATE POLICY "Allow admin full access" ON public.locations FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Allow public read access" ON public.locations;
CREATE POLICY "Allow public read access" ON public.locations FOR SELECT USING (true);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin write access" ON public.notifications;
CREATE POLICY "Allow admin write access" ON public.notifications FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.notifications;
CREATE POLICY "Allow authenticated read access" ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');


/*
  # [Seed Data] Taj Mahal
  [Updates the Taj Mahal location with rich, detailed demo data.]
  ## Query Description: [This updates a single row in the 'locations' table. It will overwrite existing data for the Taj Mahal.]
  ## Metadata:
  - Schema-Category: ["Data"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true] -- Can be reverted by clearing the details column
*/
UPDATE public.locations
SET 
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
      "historical_background": "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
      "cultural_significance": "It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
      "why_famous": "Recognized as a UNESCO World Heritage site and one of the New7Wonders of the World, it symbolizes eternal love."
    },
    "opening_hours": {
      "daily_timings": {
        "Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset", "Thursday": "Sunrise to Sunset", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"
      },
      "weekly_closures": ["Friday"],
      "seasonal_changes": "Night viewing is available on 5 days a month around the full moon."
    },
    "best_time_to_visit": {
      "best_season": "October to March",
      "best_time_of_day": "Sunrise for ethereal beauty and fewer crowds, or sunset for dramatic colors.",
      "festival_timing": "Taj Mahotsav in February is a vibrant 10-day cultural festival held nearby."
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR) - 13km",
      "nearest_railway_station": "Agra Cantt (AGC) - 6km",
      "last_mile_options": "Electric bus or golf cart from the ticket counter. No polluting vehicles allowed within 500m.",
      "taxi_cost_estimate": "₹200-300 from city center (one way)"
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": ["Unofficial guides at entrances", "Overpriced souvenirs", "Touts selling fake gems"],
      "womens_safety_rating": "Generally very safe due to high security, but be cautious of overly friendly strangers.",
      "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "Local Police", "number": "112"}]
    },
    "cultural_etiquette": {
      "dress_code": "Modest dress is recommended. Cover shoulders and knees.",
      "dos_donts": ["Do remove shoes before entering the mausoleum.", "Don''t bring food, drinks, or tobacco.", "Don''t touch the marble carvings."],
      "temple_etiquette": "Maintain silence and be respectful inside the main mausoleum.",
      "photography_rules": "Photography is prohibited inside the main mausoleum."
    },
    "costs_money": {
      "ticket_prices": {"local": "₹50", "foreigner": "₹1100 + ₹200 (mausoleum)"},
      "avg_budget_per_day": "₹2000",
      "haggling_info": "Haggling is common for taxis and souvenirs outside the complex.",
      "digital_payment_availability": "Yes, UPI and cards are accepted for tickets."
    },
    "amenities": {
      "toilets": "Available, but can be crowded. Paid options outside are cleaner.",
      "wifi": "Limited free Wi-Fi near the entrance.",
      "seating": "Benches are available in the gardens.",
      "water_refills": "Available near the entrance.",
      "cloakrooms": "Available to store large bags and prohibited items."
    },
    "food_stay": {
      "local_shops_street_food": "Agra is famous for ''Petha'', a sweet. Try it from reputable shops.",
      "dishes_to_try": "Mughlai cuisine, Bedai & Jalebi for breakfast.",
      "recommended_restaurants": ["Pinch of Spice", "Esphahan - The Oberoi"],
      "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal", "Hotel Taj Resorts"]
    },
    "events_festivals": {
      "event_name": "Taj Mahotsav",
      "event_date": "February 18th - 27th",
      "type": "Cultural Festival"
    },
    "accessibility": {
      "wheelchair_access": "Yes, ramps are available but some areas might be challenging.",
      "english_speaking_guides": "Official English-speaking guides are available for hire inside.",
      "foreigner_friendly_services": "Separate ticket counter for foreigners."
    },
    "nearby_essentials": {
      "atms": "Available near both East and West gate ticket counters.",
      "pharmacies": "Available in the main market area outside the complex.",
      "hospitals": "S.N. Medical College and Hospital is the nearest major hospital.",
      "police_stations": "Tourist Police Station is located near the complex."
    },
    "crowd_experience": {
      "avg_crowd_density": "High, especially on weekends and holidays.",
      "best_crowd_free_hours": "Just after sunrise on a weekday.",
      "type_of_visitors": "Families, Couples, Solo Travelers, History Buffs"
    },
    "traveler_tips": {
      "hacks": "Buy tickets online to skip long queues. The East gate is often less crowded than the West gate.",
      "hidden_gems": "Visit Mehtab Bagh on the opposite bank for a stunning sunset view of the Taj.",
      "scam_avoidance": "Ignore anyone who approaches you on the street claiming to be a guide.",
      "photography_spots": "The classic shot from the main gate, reflections in the side water channels, and from the mosque on the west side."
    },
    "google_reviews": {
      "live_rating": "4.6/5",
      "top_traveler_quotes": ["Absolutely breathtaking, a must-see in a lifetime.", "Go at sunrise, it''s magical and less crowded.", "Be prepared for security checks and long lines."]
    },
    "virtual_tour": {
      "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/"
    },
    "hygiene_index": {
      "rating": 4,
      "notes": "Complex is well-maintained. Toilets can be crowded during peak hours."
    },
    "visa_foreigner_rules": {
      "visa_info": "Most nationalities can get an e-Visa online before arriving in India.",
      "permits": "No special permits required for the Taj Mahal itself."
    },
    "things_to_do": {
      "main_activities": ["Admire the architecture", "Explore the surrounding gardens", "Visit the museum", "Take photos"],
      "nearby_attractions": ["Agra Fort", "Itimad-ud-Daulah (Baby Taj)", "Mehtab Bagh"]
    },
    "map_navigation": {
      "google_maps_link": "https://goo.gl/maps/A4z391E8y9T2"
    },
    "guides": {
      "availability": "Official government-licensed guides are available for hire at the ticket counter.",
      "booking_info": "Book directly at the counter to avoid scams. Do not book from street vendors."
    }
  }'
WHERE name = 'Taj Mahal';

-- Seed images for Taj Mahal
WITH taj AS (SELECT id FROM public.locations WHERE name = 'Taj Mahal' LIMIT 1)
INSERT INTO public.location_images (location_id, image_url, alt_text)
VALUES
  ((SELECT id FROM taj), 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', 'Front view of Taj Mahal'),
  ((SELECT id FROM taj), 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop', 'Taj Mahal with reflection'),
  ((SELECT id FROM taj), 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h-600&fit=crop', 'Detailed view of Taj Mahal marble work')
ON CONFLICT DO NOTHING;
