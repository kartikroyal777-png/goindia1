-- Comprehensive migration to fix schema inconsistencies and add demo data.

-- 1. Ensure `details` column of type JSONB exists on `locations` table.
-- This fixes the "Could not find the 'details' column" error in the admin panel.
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS details jsonb;

-- 2. Create `location_images` table for the image gallery feature.
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admin users" ON public.location_images;
CREATE POLICY "Enable insert for admin users" ON public.location_images FOR INSERT WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable update for admin users" ON public.location_images;
CREATE POLICY "Enable update for admin users" ON public.location_images FOR UPDATE USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable delete for admin users" ON public.location_images;
CREATE POLICY "Enable delete for admin users" ON public.location_images FOR DELETE USING (is_admin(auth.uid()));

-- 3. Create `bargaining_price_guide` table (idempotent).
-- This ensures the Bargaining Coach's price guide works correctly.
CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    location_name text NOT NULL,
    item_name text NOT NULL,
    fair_price_range text,
    quoted_price_range text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bargaining_price_guide;
CREATE POLICY "Enable read access for all users" ON public.bargaining_price_guide FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for admin users" ON public.bargaining_price_guide;
CREATE POLICY "Enable insert for admin users" ON public.bargaining_price_guide FOR INSERT WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable update for admin users" ON public.bargaining_price_guide;
CREATE POLICY "Enable update for admin users" ON public.bargaining_price_guide FOR UPDATE USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable delete for admin users" ON public.bargaining_price_guide;
CREATE POLICY "Enable delete for admin users" ON public.bargaining_price_guide FOR DELETE USING (is_admin(auth.uid()));

-- 4. Add rich demo data for Taj Mahal.
DO $$
DECLARE
    taj_mahal_id uuid;
BEGIN
    -- Find the ID of the Taj Mahal location
    SELECT id INTO taj_mahal_id FROM public.locations WHERE name = 'Taj Mahal' LIMIT 1;

    -- If Taj Mahal exists, update its details and add images
    IF taj_mahal_id IS NOT NULL THEN
        -- Update details column with all 20 parameters
        UPDATE public.locations
        SET details = '{
            "about": { "historical_background": "Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.", "cultural_significance": "A jewel of Muslim art in India and a universally admired masterpiece of the world''s heritage.", "why_famous": "It is an ivory-white marble mausoleum on the south bank of the Yamuna river." },
            "opening_hours": { "daily_timings": {"Mon": "Sunrise-Sunset", "Tue": "Sunrise-Sunset", "Wed": "Sunrise-Sunset", "Thu": "Sunrise-Sunset", "Sat": "Sunrise-Sunset", "Sun": "Sunrise-Sunset"}, "weekly_closures": ["Friday"], "seasonal_changes": "Timings may vary slightly based on sunrise/sunset times." },
            "best_time_to_visit": { "best_season": "October to March", "best_time_of_day": "Sunrise or Sunset", "festival_timing": "No major festivals hosted inside." },
            "transport": { "nearest_airport": "Agra Airport (AGR), 13 km", "nearest_railway_station": "Agra Cantt (AGC), 6 km", "last_mile_options": "Electric bus or golf cart from ticket counter.", "taxi_cost_estimate": "₹200-300 from city center" },
            "safety_risks": { "safety_score": 9, "scams_warnings": ["Unofficial guides", "Overpriced souvenirs"], "womens_safety_rating": "High", "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}] },
            "cultural_etiquette": { "dress_code": "Modest clothing recommended.", "dos_donts": ["Do not eat or smoke inside.", "Do not touch the marble walls."], "temple_etiquette": "N/A", "photography_rules": "Photography of the main mausoleum interior is prohibited." },
            "costs_money": { "ticket_prices": { "local": "₹50", "foreigner": "₹1100 + ₹200" }, "avg_budget_per_day": "₹1500", "haggling_info": "For transport and souvenirs", "digital_payment_availability": "Yes, for tickets" },
            "amenities": { "toilets": "Available", "wifi": "Limited", "seating": "Available in gardens", "water_refills": "Available", "cloakrooms": "Available" },
            "food_stay": { "local_shops_street_food": "Available outside the complex", "dishes_to_try": "Agra Petha", "recommended_restaurants": ["Pinch of Spice", "Esphahan"], "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal"] },
            "events_festivals": { "event_name": "Taj Mahotsav (nearby)", "event_date": "February", "type": "Cultural Fair" },
            "weather_air_quality": { "current_temp": "N/A (Live)", "humidity": "N/A (Live)", "aqi": "N/A (Live)", "seasonal_trends": "Hot summers, pleasant winters, moderate monsoon." },
            "accessibility": { "wheelchair_access": "Yes, ramps available", "english_speaking_guides": "Yes, official guides available", "foreigner_friendly_services": "Separate ticket counter for foreigners." },
            "nearby_essentials": { "atms": "Near ticket counters", "pharmacies": "In Taj Ganj area", "hospitals": "SN Medical College", "police_stations": "Tourist Police Station near Shilpgram" },
            "crowd_experience": { "avg_crowd_density": "High", "best_crowd_free_hours": "Early morning (6-8 AM)", "type_of_visitors": "All (Families, Couples, Solo)" },
            "traveler_tips": { "hacks": "Buy tickets online to skip queues.", "hidden_gems": "Visit Mehtab Bagh for a view across the river.", "scam_avoidance": "Only hire licensed guides.", "photography_spots": "The classic shot from the main gate, reflections in the side pools." },
            "google_reviews": { "live_rating": "4.6/5", "top_traveler_quotes": ["An unforgettable experience.", "Breathtakingly beautiful at sunrise."] },
            "virtual_tour": { "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/" },
            "hygiene_index": { "rating": 4, "notes": "Generally clean, but can be crowded." },
            "visa_foreigner_rules": { "visa_info": "E-Visa accepted for most countries.", "permits": "No special permit required." }
        }'
        WHERE id = taj_mahal_id;

        -- Clear existing images for Taj Mahal to avoid duplicates
        DELETE FROM public.location_images WHERE location_id = taj_mahal_id;

        -- Insert new images for Taj Mahal
        INSERT INTO public.location_images (location_id, image_url, alt_text)
        VALUES
            (taj_mahal_id, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop', 'Classic view of the Taj Mahal'),
            (taj_mahal_id, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop', 'Taj Mahal with reflection'),
            (taj_mahal_id, 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1974&auto=format&fit=crop', 'Detailed marble inlay work at Taj Mahal');
    END IF;
END $$;
