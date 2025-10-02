--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--
/*
          # [Function] is_admin
          [Checks if a user has the 'admin' role in their user metadata.]

          ## Query Description: [This function provides a reusable security check to determine if the currently authenticated user is an administrator. It is designed to be used in Row Level Security (RLS) policies to grant elevated permissions for admin-specific tasks like updating or deleting content.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [This creates a SQL function named `is_admin`.]
          
          ## Security Implications:
          - RLS Status: [Used by RLS policies]
          - Policy Changes: [No]
          - Auth Requirements: [Requires authenticated user context]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [Negligible performance impact.]
          */
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: -
--
/*
          # [Alter Table] locations
          [Adds the 'details' column of type jsonb to the locations table if it does not already exist.]

          ## Query Description: [This operation modifies the 'locations' table to include a flexible 'details' column for storing complex, nested information about a location. This is a non-destructive operation that is critical for the application's ability to save detailed location parameters.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [false]
          
          ## Structure Details:
          [Table: locations, Column: details (jsonb)]
          
          ## Security Implications:
          - RLS Status: [Unaffected]
          - Policy Changes: [No]
          - Auth Requirements: [Admin privileges for migration]
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Minimal impact, allows for more flexible queries.]
          */
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS details jsonb;

--
-- Name: location_images; Type: TABLE; Schema: public; Owner: -
--
/*
          # [Table] location_images
          [Creates the 'location_images' table to store multiple images for each location.]

          ## Query Description: [This operation creates a new table to support the image gallery feature. It establishes a one-to-many relationship between locations and their images. RLS policies are included to allow public read access and admin-only write access.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Table: location_images, Columns: id, location_id, image_url, alt_text, created_at]
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Admin for write, public for read]
          
          ## Performance Impact:
          - Indexes: [Primary key and foreign key indexes created automatically.]
          - Triggers: [None]
          - Estimated Impact: [Negligible.]
          */
CREATE TABLE IF NOT EXISTS public.location_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid NOT NULL,
    image_url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.location_images OWNER TO postgres;
ALTER TABLE ONLY public.location_images
    ADD CONSTRAINT location_images_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.location_images
    ADD CONSTRAINT location_images_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;

-- Enable RLS and define policies for location_images
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to location images" ON public.location_images FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to location images" ON public.location_images FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

--
-- Name: notifications RLS; Type: POLICY; Schema: public; Owner: -
--
/*
          # [RLS Policy] notifications
          [Creates RLS policies for the 'notifications' table to allow public read access and admin-only write access.]

          ## Query Description: [This secures the notifications table, ensuring that all users can read notifications but only administrators can create, update, or delete them. This is essential for the notification system to function correctly and securely.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Table: notifications]
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Admin for write, public for read]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [Negligible.]
          */
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.notifications;
DROP POLICY IF EXISTS "Allow admin full access" ON public.notifications;

CREATE POLICY "Allow public read access" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON public.notifications FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

--
-- Name: Update Taj Mahal with Demo Data; Type: DATA; Schema: public; Owner: -
--
/*
          # [Data Update] Taj Mahal
          [Populates the 'Taj Mahal' location with rich, detailed demo data for all 20 parameters, including an image gallery.]

          ## Query Description: [This query updates a single record in the 'locations' table to serve as a complete example of the new data structure. It also inserts related images into the 'location_images' table. This is for demonstration purposes and only affects the Taj Mahal entry.]
          
          ## Metadata:
          - Schema-Category: ["Data"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Tables: locations, location_images]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [Admin privileges for migration]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [Negligible.]
          */
DO $$
DECLARE
    taj_mahal_id uuid;
BEGIN
    -- Find the ID for 'Taj Mahal'
    SELECT id INTO taj_mahal_id FROM public.locations WHERE name = 'Taj Mahal' LIMIT 1;

    IF taj_mahal_id IS NOT NULL THEN
        -- Update the details column
        UPDATE public.locations
        SET details = '{
            "about": {
                "historical_background": "An immense mausoleum of ivory-white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal.",
                "cultural_significance": "It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world''s heritage.",
                "why_famous": "A UNESCO World Heritage site and one of the New7Wonders of the World, renowned for its stunning beauty and romantic story."
            },
            "opening_hours": {
                "daily_timings": {"Monday": "Sunrise to Sunset", "Tuesday": "Sunrise to Sunset", "Wednesday": "Sunrise to Sunset", "Thursday": "Sunrise to Sunset", "Saturday": "Sunrise to Sunset", "Sunday": "Sunrise to Sunset"},
                "weekly_closures": ["Friday"],
                "seasonal_changes": "Timings may vary slightly based on sunrise/sunset times."
            },
            "best_time_to_visit": {
                "best_season": "October to March",
                "best_time_of_day": "Sunrise for ethereal beauty and fewer crowds, or sunset for a golden glow.",
                "festival_timing": "Avoid visiting during major national holidays due to extreme crowds."
            },
            "transport": {
                "nearest_airport": "Agra Airport (AGR), approximately 13 km away.",
                "nearest_railway_station": "Agra Cantt (AGC) is the main station, about 6 km away.",
                "last_mile_options": "From the parking area, take an electric bus or golf cart to the entrance gate. No polluting vehicles are allowed nearby.",
                "taxi_cost_estimate": "₹250-400 from Agra Cantt station."
            },
            "safety_risks": {
                "safety_score": 9,
                "scams_warnings": ["Be cautious of unofficial guides offering to skip lines.", "Ignore hawkers selling overpriced souvenirs near the entrance."],
                "womens_safety_rating": "Very Good",
                "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "ASI Office (Taj Mahal)", "number": "+91-562-2227261"}]
            },
            "cultural_etiquette": {
                "dress_code": "Modest dress is recommended. Cover shoulders and knees.",
                "dos_donts": ["Do remove shoes or use provided shoe covers before entering the mausoleum.", "Don''t bring food, drinks, or tobacco inside."],
                "temple_etiquette": "Maintain silence and be respectful inside the main mausoleum.",
                "photography_rules": "Photography is prohibited inside the main mausoleum."
            },
            "costs_money": {
                "ticket_prices": {"local": "₹50", "foreigner": "₹1100 + ₹200 for main mausoleum"},
                "avg_budget_per_day": "₹2000 (including ticket, guide, and transport)",
                "haggling_info": "Haggling is common for taxis and souvenirs outside the complex.",
                "digital_payment_availability": "Yes, credit cards and UPI are accepted for tickets."
            },
            "amenities": {
                "toilets": "Available, but can be crowded. Use them before entering the main areas.",
                "wifi": "Limited free Wi-Fi near the entrance.",
                "seating": "Benches are available throughout the gardens.",
                "water_refills": "Water fountains are available.",
                "cloakrooms": "Available near the entrance to store large bags."
            },
            "food_stay": {
                "local_shops_street_food": "Not available inside. Many options outside the complex.",
                "dishes_to_try": "Agra Petha (a sweet), Mughlai cuisine.",
                "recommended_restaurants": ["Pinch of Spice", "Esphahan at The Oberoi"],
                "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal", "Hotel Taj Resorts"]
            },
            "events_festivals": {
                "event_name": "Taj Mahotsav",
                "event_date": "February",
                "type": "Cultural festival celebrating arts, crafts, and cuisine."
            },
            "weather_air_quality": {
                "current_temp": "Varies",
                "humidity": "Varies",
                "aqi": "Often high, check daily AQI levels.",
                "seasonal_trends": "Hot summers (Apr-Jun), monsoon (Jul-Sep), pleasant winters (Oct-Mar)."
            },
            "accessibility": {
                "wheelchair_access": "Yes, ramps are available for most of the complex.",
                "english_speaking_guides": "Yes, official guides are available for hire.",
                "foreigner_friendly_services": "Dedicated ticket counters and information for foreign tourists."
            },
            "nearby_essentials": {
                "atms": "Available near both East and West gates.",
                "pharmacies": "Available in the nearby Taj Ganj area.",
                "hospitals": "SN Medical College, about 4 km away.",
                "police_stations": "Tourist Police Station near the South Gate."
            },
            "crowd_experience": {
                "avg_crowd_density": "High, especially on weekends and holidays.",
                "best_crowd_free_hours": "First hour after sunrise on weekdays.",
                "type_of_visitors": "Families, Couples, Solo Travelers, History Buffs."
            },
            "traveler_tips": {
                "hacks": "Buy your ticket online to save time. The East gate often has shorter queues than the West gate.",
                "hidden_gems": "Visit Mehtab Bagh on the opposite bank for a stunning sunset view of the Taj.",
                "scam_avoidance": "Only hire licensed guides from inside the ticket area.",
                "photography_spots": "The classic shot from the main gate, reflections in the side water channels, and from the mosque on the west side."
            },
            "google_reviews": {
                "live_rating": "4.6",
                "top_traveler_quotes": ["Words can''t describe the beauty.", "A must-visit once in a lifetime.", "Go at sunrise to avoid the crowds."]
            },
            "virtual_tour": {
                "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/"
            },
            "hygiene_index": {
                "rating": 4,
                "notes": "Complex is well-maintained. Toilets can be busy."
            },
            "visa_foreigner_rules": {
                "visa_info": "Most nationalities can use an e-Visa for India.",
                "permits": "No special permits required for the Taj Mahal itself."
            }
        }'::jsonb
        WHERE id = taj_mahal_id;

        -- Clear old images and insert new ones
        DELETE FROM public.location_images WHERE location_id = taj_mahal_id;
        INSERT INTO public.location_images (location_id, image_url, alt_text) VALUES
        (taj_mahal_id, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop', 'Classic view of the Taj Mahal'),
        (taj_mahal_id, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop', 'Taj Mahal with the gateway'),
        (taj_mahal_id, 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1975&auto=format&fit=crop', 'Intricate marble carvings at the Taj Mahal'),
        (taj_mahal_id, 'https://images.unsplash.com/photo-1609629737402-3a7a7c4335bf?q=80&w=2070&auto=format&fit=crop', 'Reflection of the Taj Mahal in the water');
    END IF;
END $$;
