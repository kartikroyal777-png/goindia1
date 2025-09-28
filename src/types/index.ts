export interface Category {
  id: string;
  name: string;
  icon: string;
  emoji: string;
}

export interface CityCategory {
  city_id: string;
  category_id: string;
  categories?: Category; // Make optional as we might only fetch the ID
}

export interface City {
  id:string;
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

interface PhotoSpot {
  title: string;
  description: string;
  image_url: string;
  map_link: string;
}

interface Recommendation {
  name: string;
  image_url: string;
  map_link: string;
}

interface LocalFood {
  name: string;
  shop: string;
  image_url: string;
  map_link: string;
}

interface InfluencerVideo {
  title: string;
  video_id: string;
  influencer_name: string;
}

export interface Location {
  id: string;
  tehsil_id: string;
  name: string;
  category: string;
  short_intro: string;
  image_url: string;
  latitude: number | null;
  longitude: number | null;
  images: LocationImage[];
  details: {
    about?: {
      historical_background: string;
      cultural_significance: string;
      why_famous: string;
    };
    opening_hours?: {
      daily_timings: Record<string, string>;
      weekly_closures: string[];
      seasonal_changes: string;
    };
    best_time_to_visit?: {
      best_season: string;
      best_time_of_day: string;
      festival_timing: string;
    };
    transport?: {
      nearest_airport: string;
      nearest_railway_station: string;
      last_mile_options: string;
      taxi_cost_estimate: string;
    };
    safety_risks?: {
      safety_score: number;
      scams_warnings: string[];
      womens_safety_rating: string;
      emergency_contacts: { name: string; number: string }[];
    };
    cultural_etiquette?: {
      dress_code: string;
      dos_donts: string[];
      temple_etiquette: string;
      photography_rules: string;
    };
    costs_money?: {
      ticket_prices: { local: string; foreigner: string };
      avg_budget_per_day: string;
      haggling_info: string;
      digital_payment_availability: string;
    };
    amenities?: {
      toilets: string;
      wifi: string;
      seating: string;
      water_refills: string;
      cloakrooms: string;
    };
    hygiene_index?: {
      rating: number;
      notes: string;
    };
    guides?: {
      availability: string;
      booking_info: string;
    };
    map_navigation?: {
      google_maps_link: string;
    };
    events_festivals?: {
      event_name: string;
      event_date: string;
      type: string;
    };
    things_to_do?: {
      main_activities: string[];
      nearby_attractions: string[];
    };
    photo_spots?: PhotoSpot[];
    recommended_restaurants?: Recommendation[];
    recommended_hotels?: Recommendation[];
    local_foods?: LocalFood[];
    influencer_videos?: InfluencerVideo[];
  };
}

export interface SavedPlace {
  user_id: string;
  location_id: string;
  locations: Location; // For joined data
}

export interface TripPreferences {
  days: number;
  destination: string;
  style: 'cultural' | 'romantic' | 'family' | 'adventure';
  companions: 'solo' | 'couple' | 'family' | 'friends';
}

export interface SavedTrip {
  id: string;
  user_id: string;
  created_at: string;
  trip_details: {
    preferences: TripPreferences;
    itinerary: DayPlan[];
  }
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
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

export interface Profile {
  id: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: 'free' | 'paid';
  food_scanner_used: number;
  trip_planner_used: number;
}
