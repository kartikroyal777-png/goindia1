-- Create the is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM pg_roles
    WHERE rolname = 'service_role'
    AND pg_has_role(user_id, 'service_role', 'member')
  ) OR (
    SELECT email
    FROM auth.users
    WHERE id = user_id
  ) = 'kartikroyal777@gmail.com';
$$ LANGUAGE sql SECURITY DEFINER;

-- Add 'details' column to locations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'locations' AND column_name = 'details'
  ) THEN
    ALTER TABLE public.locations ADD COLUMN details jsonb;
  END IF;
END;
$$;

-- Add 'latitude' and 'longitude' columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'locations' AND column_name = 'latitude') THEN
    ALTER TABLE public.locations ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'locations' AND column_name = 'longitude') THEN
    ALTER TABLE public.locations ADD COLUMN longitude double precision;
  END IF;
END;
$$;


-- Create location_images table with a single primary key
CREATE TABLE IF NOT EXISTS public.location_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create bargaining_price_guide table
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admins" ON public.location_images;
CREATE POLICY "Enable insert for admins" ON public.location_images FOR INSERT WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable update for admins" ON public.location_images;
CREATE POLICY "Enable update for admins" ON public.location_images FOR UPDATE USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable delete for admins" ON public.location_images;
CREATE POLICY "Enable delete for admins" ON public.location_images FOR DELETE USING (is_admin(auth.uid()));

ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bargaining_price_guide;
CREATE POLICY "Enable read access for all users" ON public.bargaining_price_guide FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admins" ON public.bargaining_price_guide;
CREATE POLICY "Enable insert for admins" ON public.bargaining_price_guide FOR INSERT WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable update for admins" ON public.bargaining_price_guide;
CREATE POLICY "Enable update for admins" ON public.bargaining_price_guide FOR UPDATE USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable delete for admins" ON public.bargaining_price_guide;
CREATE POLICY "Enable delete for admins" ON public.bargaining_price_guide FOR DELETE USING (is_admin(auth.uid()));

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.notifications;
CREATE POLICY "Enable read access for authenticated users" ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for admins" ON public.notifications;
CREATE POLICY "Enable insert for admins" ON public.notifications FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Update Taj Mahal with demo data
UPDATE public.locations
SET 
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
      "historical_background": "The Taj Mahal is an immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal. It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
      "cultural_significance": "A symbol of eternal love and India''s rich history.",
      "why_famous": "One of the Seven Wonders of the World."
    },
    "opening_hours": {
      "daily_timings": {
        "Monday": "Sunrise to Sunset",
        "Tuesday": "Sunrise to Sunset",
        "Wednesday": "Sunrise to Sunset",
        "Thursday": "Sunrise to Sunset",
        "Friday": "Closed",
        "Saturday": "Sunrise to Sunset",
        "Sunday": "Sunrise to Sunset"
      },
      "weekly_closures": ["Friday"],
      "seasonal_changes": "Timings may vary slightly based on sunrise/sunset times."
    },
    "best_time_to_visit": {
      "best_season": "October to March",
      "best_time_of_day": "Sunrise or Sunset",
      "festival_timing": "Taj Mahotsav in February"
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR) - 13km",
      "nearest_railway_station": "Agra Cantt (AGC) - 6km",
      "last_mile_options": "Electric bus or golf cart from ticket counter.",
      "taxi_cost_estimate": "₹200-300 from city center"
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": ["Unofficial guides", "Overpriced souvenirs", "Fake photographers"],
      "womens_safety_rating": "Generally safe, but be cautious of overly friendly strangers.",
      "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "Local Police", "number": "112"}]
    },
    "cultural_etiquette": {
      "dress_code": "Modest clothing recommended; cover shoulders and knees.",
      "dos_donts": ["Do remove shoes before stepping onto the mausoleum.", "Don''t bring food, drinks, or tripods inside."],
      "temple_etiquette": "Maintain silence and be respectful.",
      "photography_rules": "Photography of the main mausoleum interior is prohibited."
    },
    "costs_money": {
      "ticket_prices": { "local": "₹50", "foreigner": "₹1100" },
      "avg_budget_per_day": "₹1500 per person",
      "haggling_info": "Haggling is common for taxis and souvenirs outside.",
      "digital_payment_availability": "Yes, for tickets."
    },
    "amenities": {
      "toilets": "Available (paid)",
      "wifi": "Not available",
      "seating": "Benches available in gardens",
      "water_refills": "Available",
      "cloakrooms": "Available near entrances"
    },
    "food_stay": {
      "local_shops_street_food": "Try Petha, a local sweet, outside the complex.",
      "dishes_to_try": "Mughlai cuisine",
      "recommended_restaurants": ["Pinch of Spice", "Esphahan"],
      "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal"]
    },
    "events_festivals": {
      "event_name": "Taj Mahotsav",
      "event_date": "February",
      "type": "Cultural Festival"
    },
    "weather_air_quality": {
      "current_temp": "N/A", "humidity": "N/A", "aqi": "N/A",
      "seasonal_trends": "Hot summers, pleasant winters, monsoon from July-Sept."
    },
    "accessibility": {
      "wheelchair_access": "Yes, ramps are available.",
      "english_speaking_guides": "Available (official guides recommended)",
      "foreigner_friendly_services": "Separate ticket counter for foreigners."
    },
    "nearby_essentials": {
      "atms": "Near ticket counters",
      "pharmacies": "In Taj Ganj area",
      "hospitals": "SN Medical College",
      "police_stations": "Tourist Police Station near Shilpgram"
    },
    "crowd_experience": {
      "avg_crowd_density": "High",
      "best_crowd_free_hours": "Early morning (6-8 AM)",
      "type_of_visitors": "Families, Couples, History Buffs"
    },
    "traveler_tips": {
      "hacks": "Buy tickets online to skip long queues.",
      "hidden_gems": "View the Taj from Mehtab Bagh across the river at sunset.",
      "scam_avoidance": "Only hire government-approved guides.",
      "photography_spots": "The classic shot from the main gate, reflections in the side water channels."
    },
    "google_reviews": {
      "live_rating": "4.6",
      "top_traveler_quotes": ["Breathtakingly beautiful.", "A must-visit in a lifetime."]
    },
    "virtual_tour": { "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/" },
    "hygiene_index": { "rating": 3, "notes": "Toilets can be crowded. Carry hand sanitizer." },
    "visa_foreigner_rules": {
      "visa_info": "E-Visa accepted for most nationalities.",
      "permits": "No special permit required."
    },
    "things_to_do": {
      "main_activities": ["Admire the architecture", "Walk through the gardens", "Visit the museum"],
      "nearby_attractions": ["Agra Fort", "Mehtab Bagh"]
    },
    "map_navigation": { "google_maps_link": "https://goo.gl/maps/A4Q1m9aB9iB2" },
    "guides": {
      "availability": "Readily available",
      "booking_info": "Book official guides at the ticket counter to avoid scams."
    }
  }'
WHERE name = 'Taj Mahal';

-- Insert images for Taj Mahal
DELETE FROM public.location_images WHERE location_id = (SELECT id FROM public.locations WHERE name = 'Taj Mahal');
INSERT INTO public.location_images (location_id, image_url, alt_text) VALUES
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', 'Front view of Taj Mahal'),
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop', 'Taj Mahal with reflection'),
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop', 'Detailed view of Taj Mahal architecture');
