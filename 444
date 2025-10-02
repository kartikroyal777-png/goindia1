-- 1. Create bargaining_price_guide table
    CREATE TABLE IF NOT EXISTS public.bargaining_price_guide (
        id uuid DEFAULT gen_random_uuid() NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        location_name text NOT NULL,
        item_name text NOT NULL,
        fair_price_range text,
        quoted_price_range text
    );
    ALTER TABLE public.bargaining_price_guide ADD PRIMARY KEY (id);

    -- 2. Ensure 'details' column exists and is correct type in 'locations'
    ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS details jsonb;

    -- 3. Create location_images table
    CREATE TABLE IF NOT EXISTS public.location_images (
        id uuid DEFAULT gen_random_uuid() NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        location_id uuid NOT NULL,
        image_url text NOT NULL,
        alt_text text
    );
    ALTER TABLE public.location_images ADD PRIMARY KEY (id);
    ALTER TABLE public.location_images ADD CONSTRAINT location_images_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;

    -- 4. Add RLS policies for new tables
    ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.bargaining_price_guide;
    CREATE POLICY "Enable read access for all users" ON public.bargaining_price_guide FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Enable insert for admins" ON public.bargaining_price_guide;
    CREATE POLICY "Enable insert for admins" ON public.bargaining_price_guide FOR INSERT TO authenticated WITH CHECK (get_my_claim('user_role') = '"admin"');
    DROP POLICY IF EXISTS "Enable update for admins" ON public.bargaining_price_guide;
    CREATE POLICY "Enable update for admins" ON public.bargaining_price_guide FOR UPDATE TO authenticated USING (get_my_claim('user_role') = '"admin"');
    DROP POLICY IF EXISTS "Enable delete for admins" ON public.bargaining_price_guide;
    CREATE POLICY "Enable delete for admins" ON public.bargaining_price_guide FOR DELETE TO authenticated USING (get_my_claim('user_role') = '"admin"');

    ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_images;
    CREATE POLICY "Enable read access for all users" ON public.location_images FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Enable insert for admins" ON public.location_images;
    CREATE POLICY "Enable insert for admins" ON public.location_images FOR INSERT TO authenticated WITH CHECK (get_my_claim('user_role') = '"admin"');
    DROP POLICY IF EXISTS "Enable update for admins" ON public.location_images;
    CREATE POLICY "Enable update for admins" ON public.location_images FOR UPDATE TO authenticated USING (get_my_claim('user_role') = '"admin"');
    DROP POLICY IF EXISTS "Enable delete for admins" ON public.location_images;
    CREATE POLICY "Enable delete for admins" ON public.location_images FOR DELETE TO authenticated USING (get_my_claim('user_role') = '"admin"');


    -- 5. Seed Taj Mahal with rich demo data
    DO $$
    DECLARE
      taj_mahal_id UUID;
    BEGIN
      SELECT id INTO taj_mahal_id FROM public.locations WHERE name = 'Taj Mahal';

      IF FOUND THEN
        UPDATE public.locations
        SET details = '{
          "about": { "historical_background": "Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.", "cultural_significance": "A jewel of Muslim art in India and a universally admired masterpiece of the world''s heritage.", "why_famous": "Its stunning architectural beauty, intricate decorations, and the romantic story behind its creation." },
          "opening_hours": { "daily_timings": {"Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset", "Thursday": "Sunrise to Sunset", "Friday": "Closed", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"}, "weekly_closures": ["Friday"], "seasonal_changes": "Timings may vary slightly with sunrise/sunset times." },
          "best_time_to_visit": { "best_season": "October to March", "best_time_of_day": "Sunrise for ethereal light and fewer crowds.", "festival_timing": "Taj Mahotsav in February." },
          "transport": { "nearest_airport": "Agra Airport (AGR), 13km away.", "nearest_railway_station": "Agra Cantt (AGC), 6km away.", "last_mile_options": "Electric buses and golf carts are mandatory for the last 500m.", "taxi_cost_estimate": "₹250-350 from Agra Cantt." },
          "safety_risks": { "safety_score": 9, "scams_warnings": ["Aggressive touts selling souvenirs.", "Unofficial guides offering cheap tours."], "womens_safety_rating": "Very Good", "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}] },
          "cultural_etiquette": { "dress_code": "Modest clothing recommended; cover shoulders and knees.", "dos_donts": ["Do respect the solemnity of the mausoleum.", "Don''t eat or smoke inside the complex."], "temple_etiquette": "N/A (It''s a mausoleum)", "photography_rules": "Photography is prohibited inside the main mausoleum." },
          "costs_money": { "ticket_prices": { "local": "₹50", "foreigner": "₹1100 + ₹200 (main mausoleum)" }, "avg_budget_per_day": "₹2000", "haggling_info": "Haggle for taxis and souvenirs outside.", "digital_payment_availability": "Yes, for tickets." },
          "amenities": { "toilets": "Available, but can be crowded.", "wifi": "Paid WiFi available.", "seating": "Benches available in the gardens.", "water_refills": "Available near entrances.", "cloakrooms": "Available to store large bags." },
          "food_stay": { "local_shops_street_food": "Not available inside. Many options outside the gates.", "dishes_to_try": "Agra Petha (sweet), Bedai & Jalebi (breakfast).", "recommended_restaurants": ["Pinch of Spice", "Esphahan at The Oberoi"], "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal"] },
          "events_festivals": { "event_name": "Taj Mahotsav", "event_date": "February", "type": "Cultural Festival" },
          "weather_air_quality": { "current_temp": "32°C", "humidity": "60%", "aqi": "150 (Moderate)", "seasonal_trends": "Hot summers, pleasant winters, monsoon from July-Sep." },
          "accessibility": { "wheelchair_access": "Yes, ramps are available but can be steep.", "english_speaking_guides": "Yes, official guides available for hire.", "foreigner_friendly_services": "Separate ticket counter for foreigners." },
          "nearby_essentials": { "atms": "Available near ticket counters.", "pharmacies": "In Taj Ganj area outside.", "hospitals": "SN Medical College.", "police_stations": "Tourist Police Station near the complex." },
          "crowd_experience": { "avg_crowd_density": "High", "best_crowd_free_hours": "6 AM - 8 AM", "type_of_visitors": "Families, Couples, Solo Travelers" },
          "traveler_tips": { "hacks": "Buy tickets online to skip long queues.", "hidden_gems": "Visit Mehtab Bagh across the river for a stunning sunset view of the Taj.", "scam_avoidance": "Ignore anyone claiming to be a guide outside the official area.", "photography_spots": "The classic shot from the main gate, side views from the mosques." },
          "google_reviews": { "live_rating": "4.6/5", "top_traveler_quotes": ["''An unforgettable experience.'', ''More beautiful in person than any photo.''"] },
          "virtual_tour": { "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/" },
          "hygiene_index": { "rating": 4, "notes": "Complex is clean, but washrooms can be crowded." },
          "visa_foreigner_rules": { "visa_info": "Most nationalities can use the Indian e-Visa.", "permits": "No special permit required beyond the entry ticket." }
        }'::jsonb
        WHERE id = taj_mahal_id;

        -- Delete old images if any
        DELETE FROM public.location_images WHERE location_id = taj_mahal_id;

        -- Insert new gallery images for Taj Mahal
        INSERT INTO public.location_images (location_id, image_url, alt_text) VALUES
        (taj_mahal_id, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', 'Classic front view of the Taj Mahal'),
        (taj_mahal_id, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop', 'Taj Mahal with the reflection pool'),
        (taj_mahal_id, 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop', 'Intricate marble carvings on the Taj Mahal walls'),
        (taj_mahal_id, 'https://images.unsplash.com/photo-1587135304383-a4968aa5d093?w=800&h=600&fit=crop', 'View of the Taj Mahal from the Yamuna river');
      END IF;
    END $$;
