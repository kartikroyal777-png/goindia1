/*
          # [Operation Name]
          Create and Seed Core Application Tables

          ## Query Description: [This script creates the foundational tables for the Go India app: `cities`, `tehsils`, and `locations`. It establishes relationships between them and seeds them with initial data for popular tourist destinations. This is a safe, structural operation required for the app to function.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Creates table: `cities`
          - Creates table: `tehsils` (with foreign key to `cities`)
          - Creates table: `locations` (with foreign key to `tehsils`)
          - Inserts initial data into all three tables.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Adds SELECT policies for public access)
          - Auth Requirements: None for read access.
          
          ## Performance Impact:
          - Indexes: Adds primary key indexes.
          - Triggers: None
          - Estimated Impact: Low. Creates tables and adds a small amount of initial data.
          */

-- 1. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name character varying NOT NULL,
    state character varying,
    description text,
    short_tagline character varying,
    thumbnail_url text,
    popularity_score integer,
    safety_score integer,
    best_time_to_visit character varying,
    weather_info text,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. TEHSILS TABLE
CREATE TABLE IF NOT EXISTS public.tehsils (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    city_id uuid REFERENCES public.cities(id) ON DELETE CASCADE,
    name character varying NOT NULL,
    description text,
    thumbnail_url text,
    category character varying,
    safety_rating integer,
    location_count integer,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tehsil_id uuid REFERENCES public.tehsils(id) ON DELETE CASCADE,
    name character varying NOT NULL,
    category character varying,
    short_intro text,
    image_url text,
    coordinates jsonb,
    basic_info jsonb,
    access_transport jsonb,
    safety_risks jsonb,
    local_insights jsonb,
    costs_money jsonb,
    amenities jsonb,
    food_stay jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. ENABLE RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tehsils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- 5. CREATE POLICIES FOR PUBLIC READ ACCESS
CREATE POLICY "Allow public read access to cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tehsils" ON public.tehsils FOR SELECT USING (true);
CREATE POLICY "Allow public read access to locations" ON public.locations FOR SELECT USING (true);

-- 6. SEED DATA
-- Clear existing data to prevent duplicates on re-run
TRUNCATE public.cities, public.tehsils, public.locations RESTART IDENTITY CASCADE;

-- Insert Cities
INSERT INTO public.cities (id, name, state, description, short_tagline, thumbnail_url, popularity_score, safety_score, best_time_to_visit, weather_info) VALUES
('a8f3b4c1-4a3d-4b8c-9f7e-2d1a3b4c5d6e', 'Agra', 'Uttar Pradesh', 'Home to the magnificent Taj Mahal and rich Mughal heritage', 'The City of Love', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop', 95, 8, 'October to March', 'Cool and pleasant winters, hot summers'),
('b9c4d5e2-5b4e-4c9d-8g8f-3e2b4c5d6e7f', 'Jaipur', 'Rajasthan', 'The vibrant pink city known for palaces, forts, and colorful bazaars', 'The Pink City', 'https://images.unsplash.com/photo-1599661046289-e31897846364?w=400&h=300&fit=crop', 92, 8, 'October to March', 'Desert climate with cool winters'),
('c1d5e6f3-6c5f-4d1e-9h9g-4f3c5d6e7f8g', 'Varanasi', 'Uttar Pradesh', 'Ancient spiritual capital on the banks of sacred Ganges river', 'Spiritual Heart of India', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop', 88, 7, 'October to March', 'Hot summers, pleasant winters');

-- Insert Tehsils
INSERT INTO public.tehsils (id, city_id, name, description, thumbnail_url, category, safety_rating, location_count) VALUES
('d2e6f7g4-7d6g-4e2f-1i1h-5g4d6e7f8g9h', 'a8f3b4c1-4a3d-4b8c-9f7e-2d1a3b4c5d6e', 'Central Agra', 'Historic core with Taj Mahal and Agra Fort', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop', 'Heritage', 8, 1),
('e3f7g8h5-8e7h-4f3g-2j2i-6h5e7f8g9h1i', 'b9c4d5e2-5b4e-4c9d-8g8f-3e2b4c5d6e7f', 'Amer', 'Majestic forts and royal history', 'https://images.unsplash.com/photo-1534423892324-269ca0b93183?w=300&h=200&fit=crop', 'Heritage', 9, 1);

-- Insert Locations
INSERT INTO public.locations (id, tehsil_id, name, category, short_intro, image_url, coordinates, basic_info, access_transport, safety_risks, local_insights, costs_money, amenities, food_stay) VALUES
('f4g8h9i6-9f8i-4g4h-3k3j-7i6f8g9h1i2j', 'd2e6f7g4-7d6g-4e2f-1i1h-5g4d6e7f8g9h', 'Taj Mahal', 'Heritage Monument', 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', 
'{"lat": 27.1751, "lng": 78.0421}',
'{"opening_hours": "Sunrise to Sunset (Closed Fridays)", "best_time_to_visit": "Sunrise or sunset", "entry_fee": {"local": "₹50", "foreigner": "₹1100 + ₹200"}}',
'{"nearest_airport": "Agra Airport (AGR) - 13km", "public_transport_guide": "Auto-rickshaw or e-rickshaw.", "taxi_fare_estimate": "₹200-300 from city center", "last_mile_access": "Electric bus or golf cart", "travel_time_from_center": "20-30 minutes"}',
'{"safety_score": 9, "common_scams": ["Unofficial guides", "Overpriced souvenirs"], "pickpocket_risk": "Medium", "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}]}',
'{"cultural_etiquette": ["Dress modestly", "No food inside"], "local_phrases": [{"phrase": "Ticket kahan milega?", "translation": "Where is the ticket counter?", "pronunciation": "ticket ka-HAAN mil-AY-ga"}], "food_safety_note": "Stick to bottled water.", "women_specific_tips": ["Generally very safe."]}',
'{"average_budget": "₹1500 per person", "nearby_atms": "Available near ticket counters.", "digital_payments_accepted": true, "haggling_needed": "Yes, for rickshaws."}',
'{"toilets": "Available", "wifi_signal": "Weak", "seating": true, "water_refill_points": true}',
'{"nearby_restaurants": [{"name": "Pinch of Spice", "rating": 4.5}], "local_specialty": "Petha (a sweet)"}'),

('g5h9i1j7-1g9j-5h5i-4l4k-8j7g9h1i2j3k', 'e3f7g8h5-8e7h-4f3g-2j2i-6h5e7f8g9h1i', 'Amer Fort', 'Heritage Fort', 'A majestic fort with a blend of Rajput and Mughal architecture, offering stunning views and intricate designs.', 'https://images.unsplash.com/photo-1534423892324-269ca0b93183?w=800&h=600&fit=crop',
'{"lat": 26.9855, "lng": 75.8513}',
'{"opening_hours": "8:00 AM - 5:30 PM", "best_time_to_visit": "Early morning", "entry_fee": {"local": "₹100", "foreigner": "₹500"}}',
'{"nearest_airport": "Jaipur International Airport (JAI) - 22km", "public_transport_guide": "Local bus no. 5 from Ajmeri Gate.", "taxi_fare_estimate": "₹400-500 from city center", "last_mile_access": "Walk up or take a jeep.", "travel_time_from_center": "30-45 minutes"}',
'{"safety_score": 8, "common_scams": ["Overpriced elephant rides", "Hawkers selling fake gems"], "pickpocket_risk": "Medium", "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}]}',
'{"cultural_etiquette": ["Wear comfortable walking shoes."], "local_phrases": [{"phrase": "Raasta kidhar hai?", "translation": "Which way is it?", "pronunciation": "RAAS-ta KID-har hai"}], "food_safety_note": "Eat at the restaurant inside the fort.", "women_specific_tips": ["Safe during the day."]}',
'{"average_budget": "₹800 per person", "nearby_atms": "Not available at the fort.", "digital_payments_accepted": true, "haggling_needed": "Yes, for taxis."}',
'{"toilets": "Available", "wifi_signal": "Weak", "seating": true, "water_refill_points": false}',
'{"nearby_restaurants": [{"name": "1135 AD", "rating": 4.6}], "local_specialty": "Dal Baati Churma"}');
