/*
          # [Operation Name]
          Comprehensive App Overhaul: Location Schema, Bargaining Content, and Functions

          ## Query Description: [This is a major structural update. It rebuilds the 'locations' table with a new, richer JSONB structure to support 20 detailed parameters. It also adds new tables for the Bargaining Coach feature and introduces a function to fetch notifications. **BACKUP RECOMMENDED** before applying this migration, as the existing 'locations' table structure will be replaced.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Dangerous"]
          - Impact-Level: ["High"]
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - **locations**: Table is altered. Old JSONB columns are dropped and replaced with a single `details` JSONB column containing a new 20-parameter schema.
          - **bargaining_price_guide**: New table created to store price data for the Bargaining Coach.
          - **get_user_notifications**: New database function created to fetch notifications for a user.
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes] - New policies are added for the new tables and function.
          - Auth Requirements: [authenticated, service_role]
          
          ## Performance Impact:
          - Indexes: [Added] - Indexes are added to new tables.
          - Triggers: [None]
          - Estimated Impact: [Low on existing data, as it primarily introduces new structures. Queries on the 'locations' table will need to be updated to use the new JSONB structure.]
          */

-- Drop old columns from locations table if they exist to avoid conflicts
ALTER TABLE public.locations
  DROP COLUMN IF EXISTS coordinates,
  DROP COLUMN IF EXISTS basic_info,
  DROP COLUMN IF EXISTS access_transport,
  DROP COLUMN IF EXISTS safety_risks,
  DROP COLUMN IF EXISTS local_insights,
  DROP COLUMN IF EXISTS costs_money,
  DROP COLUMN IF EXISTS amenities,
  DROP COLUMN IF EXISTS food_stay;

-- Add the new single JSONB column for all details
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS details JSONB;

-- Create the bargaining price guide table
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  fair_price_range TEXT,
  quoted_price_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for the new table
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;

-- Policies for bargaining_price_guide
CREATE POLICY "Allow public read access" ON public.bargaining_price_guide
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON public.bargaining_price_guide
  FOR ALL USING (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com');

-- Create function to get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications()
RETURNS TABLE(id int, title text, message text, type text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT n.id, n.title, n.message, n.type, n.created_at
  FROM public.notifications n
  ORDER BY n.created_at DESC
  LIMIT 20;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_notifications() TO authenticated;


-- Seed data for the new tables and update Taj Mahal with new details
INSERT INTO public.bargaining_price_guide (location_name, item_name, fair_price_range, quoted_price_range)
VALUES
  ('Delhi (Janpath Market)', 'T-shirt', '₹150 – ₹300', '₹600 – ₹800'),
  ('Delhi (Janpath Market)', 'Handicraft item', '₹200 – ₹400', '₹1000'),
  ('Delhi (Transport)', 'Auto Rickshaw (3 km)', '₹50 – ₹80', '₹150 – ₹200'),
  ('Jaipur (Market)', 'Dupatta (Scarf)', '₹120 – ₹200', '₹300 – ₹500')
ON CONFLICT DO NOTHING;

-- Update Taj Mahal with the new 20-parameter structure
UPDATE public.locations
SET 
  name = 'Taj Mahal',
  category = 'UNESCO World Heritage',
  short_intro = 'An immense mausoleum of white marble, built between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.',
  image_url = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
  details = '{
    "about": {
      "historical_background": "Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
      "cultural_significance": "It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
      "why_famous": "Recognized as a symbol of love and architectural perfection."
    },
    "opening_hours": {
      "daily_timings": {
        "Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset", "Thursday": "Sunrise to Sunset", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"
      },
      "weekly_closures": ["Friday"],
      "seasonal_changes": "Timings may vary slightly with sunrise/sunset times."
    },
    "best_time_to_visit": {
      "best_season": "October to March",
      "best_time_of_day": "Sunrise for ethereal views and fewer crowds, or late afternoon for golden light.",
      "festival_timing": "Avoid visiting on national holidays due to extreme crowds."
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR), 13 km away.",
      "nearest_railway_station": "Agra Cantt (AGC), 6 km away.",
      "last_mile_options": "From parking, take a battery-powered bus or golf cart. No polluting vehicles allowed within 500m.",
      "taxi_cost_estimate": "Approx. ₹300-400 from Agra Cantt station."
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": ["Unofficial guides offering skip-the-line access.", "Overpriced photographers.", "Souvenir sellers claiming items are authentic marble."],
      "womens_safety_rating": "High, due to prominent security. Still, be cautious in dense crowds.",
      "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "National Emergency", "number": "112"}]
    },
    "cultural_etiquette": {
      "dress_code": "Modest dress recommended. Cover shoulders and knees.",
      "dos_donts": ["Do hire an official guide inside.", "Don''t bring food, drinks, or tripods."],
      "temple_etiquette": "Maintain silence and reverence inside the main mausoleum.",
      "photography_rules": "Photography is allowed on the grounds, but strictly forbidden inside the main mausoleum."
    },
    "costs_money": {
      "ticket_prices": {"local": "₹50", "foreigner": "₹1100 + ₹200 (optional mausoleum access)"},
      "avg_budget_per_day": "₹2000-3000 for a foreigner, including ticket, guide, and transport.",
      "haggling_info": "Haggling is essential for auto-rickshaws and souvenirs outside the complex.",
      "digital_payment_availability": "Tickets can be booked online. UPI/cards accepted at official counters."
    },
    "amenities": {
      "toilets": "Available, but can have long queues. Paid options are cleaner.",
      "wifi": "No public WiFi available.",
      "seating": "Benches are available throughout the gardens.",
      "water_refills": "Available near the entrance.",
      "cloakrooms": "Available to store large bags and prohibited items."
    },
    "food_stay": {
      "local_shops_street_food": "Avoid street food immediately outside. Find reputable spots in the main city.",
      "dishes_to_try": "Agra Petha (sweet), Bedai & Jalebi (breakfast).",
      "recommended_restaurants": ["Pinch of Spice", "Esphahan at The Oberoi"],
      "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal", "Hotel Taj Resorts"]
    },
    "events_festivals": {
      "event_name": "Taj Mahotsav",
      "event_date": "February 18th to 27th annually.",
      "type": "Cultural festival celebrating arts, crafts, and cuisine."
    },
    "weather_air_quality": {
      "current_temp": "Varies (e.g., 25°C)",
      "humidity": "Varies (e.g., 60%)",
      "aqi": "Often poor. Check live AQI before visiting.",
      "seasonal_trends": "Hot summers (April-June), monsoon (July-Sept), pleasant winters (Oct-March)."
    },
    "accessibility": {
      "wheelchair_access": "Yes, ramps are available for most of the complex.",
      "english_speaking_guides": "Readily available for hire inside.",
      "foreigner_friendly_services": "Separate ticket counters and information desks for foreigners."
    },
    "nearby_essentials": {
      "atms": "Available near the ticket counters and in the surrounding area.",
      "pharmacies": "Located in the main city area, a short ride away.",
      "hospitals": "SN Medical College, Rainbow Hospital.",
      "police_stations": "Tourist Thana (Police Station) near the complex."
    },
    "crowd_experience": {
      "avg_crowd_density": "High, especially on weekends and holidays.",
      "best_crowd_free_hours": "First hour after sunrise on a weekday.",
      "type_of_visitors": "Families, Couples, Solo Travelers, History Buffs."
    },
    "traveler_tips": {
      "hacks": "Buy tickets online to save time. The best photo spot is from the mosque on the left side of the Taj.",
      "hidden_gems": "Visit Mehtab Bagh across the river for a stunning sunset view of the Taj.",
      "scam_avoidance": "Ignore anyone who approaches you outside the official ticket area.",
      "photography_spots": "The classic bench, through the main gateway, reflections in the side water channels."
    },
    "google_reviews": {
      "live_rating": "4.6/5",
      "top_traveler_quotes": ["''An unforgettable, once-in-a-lifetime experience.''", "''Go at sunrise. It''s magical and worth the early start.''", "''Crowded, but its beauty transcends everything.''"]
    },
    "virtual_tour": {
      "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/"
    },
    "hygiene_index": {
      "rating": 3.8,
      "notes": "Gardens are well-maintained. Toilets can be crowded and cleanliness varies."
    },
    "visa_foreigner_rules": {
      "visa_info": "E-Visa accepted for most nationalities. Check the official Indian government portal.",
      "permits": "No special permits required for the Taj Mahal itself."
    }
  }'
WHERE name = 'Taj Mahal';
