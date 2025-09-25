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
  image_url: string;
  images: LocationImage[];
  details: {
    about: {
      historical_background: string;
      cultural_significance: string;
      why_famous: string;
    };
    opening_hours: {
      daily_timings: Record<string, string>;
      weekly_closures: string[];
      seasonal_changes: string;
    };
    best_time_to_visit: {
      best_season: string;
      best_time_of_day: string;
      festival_timing: string;
    };
    transport: {
      nearest_airport: string;
      nearest_railway_station: string;
      last_mile_options: string;
      taxi_cost_estimate: string;
    };
    safety_risks: {
      safety_score: number;
      scams_warnings: string[];
      womens_safety_rating: string;
      emergency_contacts: { name: string; number: string }[];
    };
    cultural_etiquette: {
      dress_code: string;
      dos_donts: string[];
      temple_etiquette: string;
      photography_rules: string;
    };
    costs_money: {
      ticket_prices: { local: string; foreigner: string };
      avg_budget_per_day: string;
      haggling_info: string;
      digital_payment_availability: string;
    };
    amenities: {
      toilets: string;
      wifi: string;
      seating: string;
      water_refills: string;
      cloakrooms: string;
    };
    food_stay: {
      local_shops_street_food: string;
      dishes_to_try: string;
      recommended_restaurants: string[];
      nearby_hotels: string[];
    };
    events_festivals: {
      event_name: string;
      event_date: string;
      type: string;
    };
    weather_air_quality: {
      current_temp: string;
      humidity: string;
      aqi: string;
      seasonal_trends: string;
    };
    accessibility: {
      wheelchair_access: string;
      english_speaking_guides: string;
      foreigner_friendly_services: string;
    };
    nearby_essentials: {
      atms: string;
      pharmacies: string;
      hospitals: string;
      police_stations: string;
    };
    crowd_experience: {
      avg_crowd_density: string;
      best_crowd_free_hours: string;
      type_of_visitors: string;
    };
    traveler_tips: {
      hacks: string;
      hidden_gems: string;
      scam_avoidance: string;
      photography_spots: string;
    };
    google_reviews: {
      live_rating: string;
      top_traveler_quotes: string[];
    };
    virtual_tour: {
      url: string;
    };
    hygiene_index: {
      rating: number;
      notes: string;
    };
    visa_foreigner_rules: {
      visa_info: string;
      permits: string;
    };
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

export interface BargainingPrice {
  id: string;
  location_name: string;
  item_name: string;
  fair_price_range: string;
  quoted_price_range: string;
}
