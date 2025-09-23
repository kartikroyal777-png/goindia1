export interface Category {
  id: string;
  name: string;
  icon: string;
  emoji: string;
}

export interface CityCategory {
  city_id: string;
  category_id: string;
  categories: Category;
}

export interface City {
  id: string;
  name: string;
  state: string;
  description: string;
  short_tagline: string;
  thumbnail_url: string;
  popularity_score: number;
  safety_score: number;
  best_time_to_visit: string;
  weather_info: string;
  city_categories?: CityCategory[];
}

export interface Tehsil {
  id: string;
  city_id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  category: string;
  safety_rating: number;
  location_count: number;
}

export interface LocationImage {
  id: string;
  location_id: string;
  image_url: string;
  alt_text?: string;
}

export interface Location {
  id: string;
  tehsil_id: string;
  name: string;
  category: string;
  short_intro: string;
  image_url: string; // Keep for thumbnail/main image
  images: LocationImage[]; // For gallery
  coordinates: { lat: number; lng: number };
  
  basic_info: {
    opening_hours: string;
    best_time_to_visit: string;
    entry_fee: { local: string; foreigner: string };
  };

  access_transport: {
    nearest_airport: string;
    public_transport_guide: string;
    taxi_fare_estimate: string;
    last_mile_access: string;
    travel_time_from_center: string;
  };

  safety_risks: {
    safety_score: number;
    common_scams: string[];
    pickpocket_risk: 'Low' | 'Medium' | 'High';
    emergency_contacts: { name: string; number: string }[];
  };

  local_insights: {
    cultural_etiquette: string[];
    local_phrases: { phrase: string; translation: string; pronunciation: string }[];
    food_safety_note: string;
    women_specific_tips: string[];
  };

  costs_money: {
    average_budget: string;
    nearby_atms: string;
    digital_payments_accepted: boolean;
    haggling_needed: string;
  };

  amenities: {
    toilets: 'Clean' | 'Available' | 'Not Available';
    wifi_signal: 'Strong' | 'Average' | 'Weak' | 'None';
    seating: boolean;
    water_refill_points: boolean;
  };

  food_stay: {
    nearby_restaurants: { name: string; rating: number }[];
    local_specialty: string;
  };
}


export interface TripPlan {
  id: string;
  user_id: string;
  title: string;
  days: number;
  budget: 'low' | 'mid' | 'luxury';
  travel_style: 'solo' | 'women' | 'family' | 'backpack' | 'luxury';
  interests: string[];
  cities: string[];
  itinerary: DayPlan[];
  created_at: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Activity {
  id: string; // Added for unique key
  time: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  type: 'spot' | 'hotel' | 'food';
  google_maps_link?: string;
}

export interface SafetyAlert {
  id: string;
  location: string;
  type: 'scam' | 'safety' | 'general';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  reported_at: string;
  verified: boolean;
}

export interface Phrase {
  id: string;
  category: string;
  en: string;
  hi: string;
  pronunciation: string | null;
  is_adult: boolean;
  created_at: string;
}
