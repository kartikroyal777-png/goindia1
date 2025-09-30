/*
          # [Initial Schema and Data Seed]
          This migration script sets up the foundational database structure for the Go India application and populates it with initial data for cities, tehsils, and locations.

          ## Query Description: [This script creates the 'cities', 'tehsils', and 'locations' tables, establishes foreign key relationships, enables Row Level Security (RLS) for data protection, and defines policies to allow public read access. It then inserts a curated set of initial data to make the app functional immediately. This operation is safe for a new database but should be reviewed carefully if applied to an existing one.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Data"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: [false]
          - Reversible: [false]
          
          ## Structure Details:
          - Tables Created: cities, tehsils, locations
          - Columns Added: Multiple columns across the three tables for storing travel data.
          - Constraints Added: Primary Keys, Foreign Keys.
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [None for read, policies are public]
          
          ## Performance Impact:
          - Indexes: [Primary key indexes are automatically created.]
          - Triggers: [None]
          - Estimated Impact: [Low. Establishes the initial schema.]
          */

-- 1. Create cities table
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    state TEXT,
    description TEXT,
    short_tagline TEXT,
    thumbnail_url TEXT,
    popularity_score INT,
    safety_score INT,
    best_time_to_visit TEXT,
    weather_info TEXT
);

-- 2. Create tehsils table
CREATE TABLE public.tehsils (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES public.cities(id),
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category TEXT,
    safety_rating INT,
    location_count INT
);

-- 3. Create locations table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tehsil_id UUID REFERENCES public.tehsils(id),
    name TEXT NOT NULL,
    category TEXT,
    short_intro TEXT,
    image_url TEXT,
    coordinates JSONB,
    basic_info JSONB,
    access_transport JSONB,
    safety_risks JSONB,
    local_insights JSONB,
    costs_money JSONB,
    amenities JSONB,
    food_stay JSONB
);

-- 4. Enable RLS for all tables
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tehsils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public read access
CREATE POLICY "Allow public read access to cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tehsils" ON public.tehsils FOR SELECT USING (true);
CREATE POLICY "Allow public read access to locations" ON public.locations FOR SELECT USING (true);

-- 6. Seed initial data
-- Cities
INSERT INTO public.cities (id, name, state, description, short_tagline, thumbnail_url, popularity_score, safety_score, best_time_to_visit, weather_info) VALUES
('a8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c1', 'Agra', 'Uttar Pradesh', 'Home to the magnificent Taj Mahal and rich Mughal heritage', 'The City of Love', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop', 95, 8, 'October to March', 'Cool and pleasant winters, hot summers'),
('b8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c2', 'Jaipur', 'Rajasthan', 'The vibrant pink city known for palaces, forts, and colorful bazaars', 'The Pink City', 'https://images.unsplash.com/photo-1599661046289-e31897846364?w=400&h=300&fit=crop', 92, 8, 'October to March', 'Desert climate with cool winters'),
('c8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c3', 'Varanasi', 'Uttar Pradesh', 'Ancient spiritual capital on the banks of sacred Ganges river', 'Spiritual Heart of India', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop', 88, 7, 'October to March', 'Hot summers, pleasant winters'),
('d8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c4', 'Goa', 'Goa', 'Tropical paradise with pristine beaches and Portuguese heritage', 'Beach Capital of India', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop', 90, 9, 'November to February', 'Tropical climate with monsoons'),
('e8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c5', 'Kerala', 'Kerala', 'God''s own country with backwaters, hill stations, and spices', 'God''s Own Country', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop', 87, 9, 'September to March', 'Tropical climate with heavy monsoons'),
('f8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c6', 'Delhi', 'Delhi', 'Capital city blending ancient history with modern urban life', 'Heart of India', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop', 93, 7, 'October to March', 'Extreme seasons with pollution concerns');

-- Tehsils
INSERT INTO public.tehsils (id, city_id, name, description, thumbnail_url, category, safety_rating, location_count) VALUES
('a1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d4', 'a8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c1', 'Central Agra', 'Historic core with Taj Mahal and Agra Fort', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop', 'Heritage', 8, 1),
('b1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d5', 'a8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c1', 'North Agra', 'Mehtab Bagh and peaceful riverside areas', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&h=200&fit=crop', 'Nature', 7, 0),
('c1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d6', 'b8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c2', 'Amer', 'Majestic forts and royal history', 'https://images.unsplash.com/photo-1534423892324-269ca0b93183?w=300&h=200&fit=crop', 'Heritage', 9, 1),
('d1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d7', 'b8f9b2c1-8e1d-4a8f-b2c1-8e1d4a8fb2c2', 'City Palace Area', 'The vibrant heart of the Pink City', 'https://images.unsplash.com/photo-1603262339346-d8c29a8a015c?w=300&h=200&fit=crop', 'Culture & Markets', 8, 0);

-- Locations
INSERT INTO public.locations (id, tehsil_id, name, category, short_intro, image_url, coordinates, basic_info, access_transport, safety_risks, local_insights, costs_money, amenities, food_stay) VALUES
('abc-123', 'a1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d4', 'Taj Mahal', 'Heritage Monument', 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', '{"lat": 27.1751, "lng": 78.0421}', '{"opening_hours": "Sunrise to Sunset (Closed Fridays)", "best_time_to_visit": "Sunrise or sunset for best lighting and fewer crowds.", "entry_fee": {"local": "₹50", "foreigner": "₹1100 + ₹200 (mausoleum)"}}', '{"nearest_airport": "Agra Airport (AGR) - 13km", "public_transport_guide": "Take an auto-rickshaw or e-rickshaw from any part of the city. No cars allowed within 500m.", "taxi_fare_estimate": "₹200-300 from city center (one way)", "last_mile_access": "Electric bus or golf cart from the ticket counter.", "travel_time_from_center": "20-30 minutes"}', '{"safety_score": 9, "common_scams": ["Unofficial \"guides\" at the entrance", "Overpriced souvenirs", "Fake photographers"], "pickpocket_risk": "Medium", "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}, {"name": "Local Police", "number": "112"}]}', '{"cultural_etiquette": ["Dress modestly", "No food or smoking inside", "Photography of the main mausoleum interior is prohibited."], "local_phrases": [{"phrase": "Ticket kahan milega?", "translation": "Where can I get a ticket?", "pronunciation": "ticket ka-HAAN mil-AY-ga"}, {"phrase": "Photo le sakte hain?", "translation": "Can I take a photo?", "pronunciation": "photo lay SAK-tay hain"}], "food_safety_note": "Stick to bottled water. Eat at reputable restaurants outside the complex.", "women_specific_tips": ["Generally very safe due to high security.", "Be cautious of overly friendly strangers."]}', '{"average_budget": "₹1500 per person (including ticket)", "nearby_atms": "Available near the ticket counters.", "digital_payments_accepted": true, "haggling_needed": "Yes, for rickshaws and souvenirs."}', '{"toilets": "Available", "wifi_signal": "Weak", "seating": true, "water_refill_points": true}', '{"nearby_restaurants": [{"name": "Pinch of Spice", "rating": 4.5}, {"name": "Esphahan", "rating": 4.8}], "local_specialty": "Petha (a sweet)"}'),
('def-456', 'c1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d6', 'Amer Fort', 'Heritage Fort', 'A majestic fort with a blend of Rajput and Mughal architecture, offering stunning views and intricate designs.', 'https://images.unsplash.com/photo-1534423892324-269ca0b93183?w=800&h=600&fit=crop', '{"lat": 26.9855, "lng": 75.8513}', '{"opening_hours": "8:00 AM - 5:30 PM", "best_time_to_visit": "Early morning to avoid heat and crowds.", "entry_fee": {"local": "₹100", "foreigner": "₹500"}}', '{"nearest_airport": "Jaipur International Airport (JAI) - 22km", "public_transport_guide": "Local bus no. 5 from Ajmeri Gate. Auto-rickshaws are common.", "taxi_fare_estimate": "₹400-500 from city center (one way)", "last_mile_access": "Walk up the hill or take a jeep (recommended over elephant rides).", "travel_time_from_center": "30-45 minutes"}', '{"safety_score": 8, "common_scams": ["Overpriced elephant rides", "Hawkers selling gems of \"questionable\" quality."], "pickpocket_risk": "Medium", "emergency_contacts": [{"name": "Tourist Police", "number": "1363"}]}', '{"cultural_etiquette": ["Wear comfortable walking shoes.", "Consider hiring an official guide inside."], "local_phrases": [{"phrase": "Raasta kidhar hai?", "translation": "Which way is it?", "pronunciation": "RAAS-ta KID-har hai"}], "food_safety_note": "Eat at the restaurant inside the fort or back in the city.", "women_specific_tips": ["Safe during the day. Avoid walking in isolated areas of the fort alone."]}', '{"average_budget": "₹800 per person (including ticket)", "nearby_atms": "Not available at the fort, use ATMs in Amer town.", "digital_payments_accepted": true, "haggling_needed": "Yes, for taxis and souvenirs."}', '{"toilets": "Available", "wifi_signal": "Weak", "seating": true, "water_refill_points": false}', '{"nearby_restaurants": [{"name": "1135 AD", "rating": 4.6}], "local_specialty": "Dal Baati Churma"}');
