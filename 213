-- Add new location parameters and update demo data for Taj Mahal

-- 1. Create a function to check for admin privileges.
-- This ensures that only authenticated admins can modify sensitive data.
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- 2. Update the locations table RLS policies to use the new is_admin function.
-- This ensures that the new data structure is protected.
ALTER POLICY "Enable read access for all users" ON "public"."locations"
  USING (true);

ALTER POLICY "Enable insert for authenticated users" ON "public"."locations"
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable update for users based on user_id" ON "public"."locations"
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

ALTER POLICY "Enable delete for users based on user_id" ON "public"."locations"
  USING (is_admin(auth.uid()));


-- 3. Update the 'Taj Mahal' location with comprehensive demo data for all new parameters.
-- This populates the UI with rich content for immediate visual feedback.
UPDATE public.locations
SET 
  latitude = 27.1751,
  longitude = 78.0421,
  details = '{
    "about": {
      "why_famous": "A UNESCO World Heritage site and one of the New7Wonders of the World.",
      "cultural_significance": "An immense mausoleum of white marble, built by Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal.",
      "historical_background": "Construction started in 1631 and was completed in 1653, employing thousands of artisans and craftsmen. It is the jewel of Muslim art in India."
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
      "best_time_of_day": "Sunrise for ethereal beauty and fewer crowds, or Sunset for dramatic lighting.",
      "festival_timing": "Taj Mahotsav, an annual 10-day festival, is held in February near the monument."
    },
    "transport": {
      "nearest_airport": "Agra Airport (AGR), approximately 13 km away.",
      "nearest_railway_station": "Agra Cantt (AGC) is the main station, about 6 km away.",
      "last_mile_options": "No polluting vehicles are allowed within 500m. Free electric buses and golf carts are available from the ticket booths.",
      "taxi_cost_estimate": "₹200-300 from Agra Cantt station."
    },
    "safety_risks": {
      "safety_score": 9,
      "scams_warnings": [
        "Beware of unofficial guides offering to skip lines.",
        "Decline offers for ''special'' photos from unauthorized photographers.",
        "Be cautious of gem scams in nearby shops."
      ],
      "womens_safety_rating": "High, due to prominent security. However, usual precautions in crowds are advised.",
      "emergency_contacts": [
        { "name": "Tourist Police", "number": "1363" },
        { "name": "Local Police", "number": "112" }
      ]
    },
    "cultural_etiquette": {
      "dress_code": "Modest dress is recommended. Cover shoulders and knees out of respect.",
      "dos_donts": [
        "Do deposit large bags and food items at the cloakroom.",
        "Don''t touch or lean on the marble walls.",
        "Don''t make loud noises inside the mausoleum."
      ],
      "temple_etiquette": "While not a temple, silence and respectful behavior are expected inside the main mausoleum.",
      "photography_rules": "Photography is prohibited inside the main mausoleum. Drones are strictly forbidden."
    },
    "costs_money": {
      "ticket_prices": {
        "local": "₹50",
        "foreigner": "₹1100"
      },
      "avg_budget_per_day": "₹1500 (including ticket & guide)",
      "haggling_info": "Haggling is common for taxis and souvenirs outside the complex.",
      "digital_payment_availability": "Yes, UPI and cards are accepted at the official ticket counter."
    },
    "amenities": {
      "toilets": "Available, but can have long queues. Use them before entering the main complex.",
      "wifi": "Limited free Wi-Fi near the entrance.",
      "seating": "Benches are available in the gardens.",
      "water_refills": "Water fountains are available.",
      "cloakrooms": "Yes, available near the ticket counters to store luggage."
    },
    "food_stay": {
      "local_shops_street_food": "Agra is famous for ''Petha'', a translucent soft candy. Buy from reputable stores.",
      "dishes_to_try": "Mughlai cuisine like Biryani and Kebabs are popular in the city.",
      "recommended_restaurants": ["Pinch of Spice", "Esphahan at The Oberoi"],
      "nearby_hotels": ["The Oberoi Amarvilas", "ITC Mughal", "Hotel Taj Resorts"]
    },
    "events_festivals": {
      "event_name": "Taj Mahotsav",
      "event_date": "February 18th to 27th annually",
      "type": "Cultural festival celebrating arts, crafts, and cuisine."
    },
    "weather_air_quality": {
      "current_temp": "Varies",
      "humidity": "Varies",
      "aqi": "Varies",
      "seasonal_trends": "Winters are cool and pleasant. Summers are very hot. Monsoon season is from July to September."
    },
    "accessibility": {
      "wheelchair_access": "Yes, ramps and wheelchairs are available on request.",
      "english_speaking_guides": "Official English-speaking guides are available for hire.",
      "foreigner_friendly_services": "Separate ticket counter for foreigners to reduce wait times."
    },
    "nearby_essentials": {
      "atms": "Available near the ticket counters.",
      "pharmacies": "Several pharmacies are located in the Taj Ganj area.",
      "hospitals": "Multiple hospitals are within a 5km radius in Agra city.",
      "police_stations": "A dedicated Tourist Police station is located near the complex."
    },
    "crowd_experience": {
      "avg_crowd_density": "High, especially on weekends and holidays.",
      "best_crowd_free_hours": "Early morning right at sunrise, or late afternoon.",
      "type_of_visitors": "Tourists, families, couples, history enthusiasts."
    },
    "traveler_tips": {
      "hacks": "Buy tickets online from the official ASI website to save time.",
      "hidden_gems": "Visit Mehtab Bagh on the opposite bank for a stunning sunset view of the Taj.",
      "scam_avoidance": "Ignore anyone claiming the ticket office is closed or moved.",
      "photography_spots": "The classic shot from the main gate, reflections in the side water channels, and from the mosque on the west side."
    },
    "google_reviews": {
      "live_rating": "4.6",
      "top_traveler_quotes": [
        "Absolutely breathtaking, a must-see in a lifetime.",
        "Go at sunrise to avoid the crowds and the heat.",
        "More beautiful in person than any photo can capture."
      ]
    },
    "virtual_tour": {
      "url": "https://www.google.com/maps/about/behind-the-scenes/streetview/treks/taj-mahal/"
    },
    "hygiene_index": {
      "rating": 8,
      "notes": "Complex is well-maintained. Toilets are clean but can be crowded."
    },
    "visa_foreigner_rules": {
      "visa_info": "Standard Indian e-Visa or regular tourist visa required for entry into India.",
      "permits": "No special permit required for Taj Mahal itself, only the entry ticket."
    },
    "things_to_do": {
      "main_activities": [
        "Admire the architecture and marble inlay work.",
        "Visit the main mausoleum to see the cenotaphs.",
        "Stroll through the Charbagh-style gardens.",
        "Take photos from the iconic central platform."
      ],
      "nearby_attractions": ["Agra Fort", "Itimad-ud-Daulah (Baby Taj)"]
    },
    "map_navigation": {
      "google_maps_link": "https://www.google.com/maps/place/Taj+Mahal/@27.1751448,78.0421422,15z"
    }
  }'
WHERE name = 'Taj Mahal';

</sql>
