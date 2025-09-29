-- Comprehensive Schema and Feature Update
-- This migration fixes previous errors and adds new features.

-- Step 1: Create the is_admin function if it doesn't exist
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

-- Step 2: Ensure tables exist and have basic RLS
-- (Assuming tables exist from previous migrations, we'll just ensure RLS is on)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tehsils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;

-- Step 3: Fix city_categories RLS to allow joins
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.city_categories;
CREATE POLICY "Allow public read access" ON public.city_categories FOR SELECT USING (true);

-- Step 4: Fix locations table - add details column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='locations' AND column_name='details'
  ) THEN
    ALTER TABLE public.locations ADD COLUMN details jsonb;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='locations' AND column_name='latitude'
  ) THEN
    ALTER TABLE public.locations ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='locations' AND column_name='longitude'
  ) THEN
    ALTER TABLE public.locations ADD COLUMN longitude double precision;
  END IF;
END;
$$;

-- Step 5: Update RLS policies for full admin access
DROP POLICY IF EXISTS "Allow admin full access" ON public.locations;
CREATE POLICY "Allow admin full access" ON public.locations FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow public read access" ON public.locations;
CREATE POLICY "Allow public read access" ON public.locations FOR SELECT
USING (true);

-- Step 6: Populate Taj Mahal with comprehensive demo data
UPDATE public.locations
SET 
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
      "historical_background": "Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal, the Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river. It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
      "cultural_significance": "A UNESCO World Heritage site, it symbolizes eternal love and represents the pinnacle of Mughal architecture, combining elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles.",
      "why_famous": "Globally recognized as a symbol of love and one of the New7Wonders of the World."
    },
    "opening_hours": {
      "daily_timings": {
        "Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset", 
        "Thursday": "Sunrise to Sunset", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"
      },
      "weekly_closures": ["Friday"],
      "seasonal_changes": "Night viewing is available on 5 days a month around the full moon."
    },
    "best_time_to_visit": {
      "best_season": "October to March",
      "best_time_of_day": "Sunrise for ethereal light and fewer crowds, or sunset for a golden glow.",
      "festival_timing": "Taj Mahotsav in February is a vibrant 10-day cultural festival held nearby."
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR), 13 km away.",
      "nearest_railway_station": "Agra Cantt (AGC), 6 km away.",
      "last_mile_options": "Only electric vehicles are allowed near the monument. Free electric buses and paid golf carts are available from parking areas.",
      "taxi_cost_estimate": "₹300-400 from Agra Cantt station."
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": ["Be wary of unofficial guides.", "Avoid buying ''marble'' souvenirs from unauthorized sellers."],
      "womens_safety_rating": "Generally very safe due to high security, but be cautious in surrounding crowded areas.",
      "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "Local Police", "number": "112"}]
    },
    "cultural_etiquette": {
      "dress_code": "Modest clothing is recommended. Cover shoulders and knees.",
      "dos_donts": ["Do deposit large bags in the cloakroom.", "Don''t eat or smoke inside the complex."],
      "temple_etiquette": "N/A (It is a mausoleum). Show respect and maintain silence inside the main tomb.",
      "photography_rules": "Photography is prohibited inside the main mausoleum. Drones are strictly forbidden."
    },
    "costs_money": {
      "ticket_prices": { "local": "₹50", "foreigner": "₹1100" },
      "avg_budget_per_day": "₹2000 (including ticket, guide, and food)",
      "haggling_info": "Haggle for rickshaws and souvenirs outside the complex.",
      "digital_payment_availability": "Yes, UPI and cards are accepted for tickets."
    },
    "amenities": {
      "toilets": "Available, but can be crowded. Use before entering.",
      "wifi": "Paid Wi-Fi available for 30 minutes.",
      "seating": "Benches are available in the gardens.",
      "water_refills": "Water fountains and paid water bottles available.",
      "cloakrooms": "Available near the entrance to store luggage."
    },
    "hygiene_index": {
      "rating": 4,
      "notes": "Complex is well-maintained. Toilets are generally clean but can have long queues."
    },
    "guides": {
      "availability": "Official government-licensed guides are available at the ticket counter.",
      "booking_info": "Book an official guide at the counter to avoid scams. Approx. ₹900 for a group."
    },
    "map_navigation": {
      "google_maps_link": "https://www.google.com/maps/place/Taj+Mahal/@27.1751448,78.0421422,15z"
    },
    "photo_spots": [
      {"title": "The Classic Bench Shot", "description": "The famous bench where Princess Diana sat. Arrive early to get a clear shot.", "image_url": "https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1587135304383-a48b28212348?w=400", "map_link": ""},
      {"title": "Reflection in the Pool", "description": "Capture the iconic reflection of the Taj in the central water channel.", "image_url": "https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400", "map_link": ""},
      {"title": "From Mehtab Bagh", "description": "Across the river, this garden offers a stunning sunset view of the Taj.", "image_url": "https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1548013146-72479768bada?w=400", "map_link": ""}
    ],
    "local_foods": [
      {"name": "Agra Petha", "shop": "Panchi Petha Store", "image_url": "https://img-wrapper.vercel.app/image?url=https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Petha.jpg/640px-Petha.jpg", "map_link": ""},
      {"name": "Bedai & Jalebi", "shop": "Deviram Sweets", "image_url": "https://img-wrapper.vercel.app/image?url=https://www.nehascookbook.com/wp-content/uploads/2022/09/Bedai-puri-WS.jpg", "map_link": ""}
    ],
    "recommended_restaurants": [
      {"name": "Pinch of Spice", "image_url": "https://img-wrapper.vercel.app/image?url=https://media-cdn.tripadvisor.com/media/photo-s/12/32/d4/49/getlstd-property-photo.jpg", "map_link": ""},
      {"name": "Esphahan, The Oberoi", "image_url": "https://img-wrapper.vercel.app/image?url=https://media-cdn.tripadvisor.com/media/photo-s/0e/dc/57/45/esphahan.jpg", "map_link": ""}
    ],
    "recommended_hotels": [
      {"name": "The Oberoi Amarvilas", "image_url": "https://img-wrapper.vercel.app/image?url=https://media-cdn.tripadvisor.com/media/photo-s/2c/3e/b3/f7/exterior.jpg", "map_link": ""},
      {"name": "ITC Mughal", "image_url": "https://img-wrapper.vercel.app/image?url=https://media-cdn.tripadvisor.com/media/photo-s/2c/03/99/3a/khwab-mahal.jpg", "map_link": ""}
    ],
    "influencer_videos": [
      {"title": "A Cinematic Guide to the Taj Mahal", "video_id": "qpOVIp1G3oA", "influencer_name": "Tanya Khanijow"}
    ]
  }'
WHERE name = 'Taj Mahal';

-- Step 7: Insert demo images for Taj Mahal
DELETE FROM public.location_images WHERE location_id = (SELECT id FROM public.locations WHERE name = 'Taj Mahal');
INSERT INTO public.location_images (location_id, image_url, alt_text) VALUES
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 'Front view of Taj Mahal'),
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', 'Reflection of Taj Mahal in the water'),
((SELECT id FROM public.locations WHERE name = 'Taj Mahal'), 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', 'View of Taj Mahal from across the river');
