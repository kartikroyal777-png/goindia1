import { faker } from '@faker-js/faker';
import { City, Category, Location, Tehsil, SafetyAlert } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Forts', icon: 'castle', emoji: '🏰' },
  { id: '2', name: 'Lakes', icon: 'waves', emoji: '🌊' },
  { id: '3', name: 'Beaches', icon: 'palmtree', emoji: '🏝️' },
  { id: '4', name: 'Temples', icon: 'building', emoji: '🛕' },
  { id: '5', name: 'Wildlife', icon: 'trees', emoji: '🐅' },
  { id: '6', name: 'Trekking', icon: 'mountain', emoji: '⛰️' },
  { id: '7', name: 'Food', icon: 'utensils', emoji: '🍛' },
  { id: '8', name: 'Markets', icon: 'shopping-bag', emoji: '🛍️' },
];

export const cities: City[] = [
  {
    city_id: 'agra_01',
    name: 'Agra',
    state: 'Uttar Pradesh',
    description: 'Home to the magnificent Taj Mahal and rich Mughal heritage',
    short_tagline: 'The City of Love',
    thumbnail_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
    popularity_score: 95,
    safety_score: 8,
    best_time_to_visit: 'October to March',
    weather_info: 'Cool and pleasant winters, hot summers'
  },
  {
    city_id: 'jaipur_01',
    name: 'Jaipur',
    state: 'Rajasthan',
    description: 'The vibrant pink city known for palaces, forts, and colorful bazaars',
    short_tagline: 'The Pink City',
    thumbnail_url: 'https://images.unsplash.com/photo-1599661046289-e31897846364?w=400&h=300&fit=crop',
    popularity_score: 92,
    safety_score: 8,
    best_time_to_visit: 'October to March',
    weather_info: 'Desert climate with cool winters'
  },
  {
    city_id: 'varanasi_01',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    description: 'Ancient spiritual capital on the banks of sacred Ganges river',
    short_tagline: 'Spiritual Heart of India',
    thumbnail_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop',
    popularity_score: 88,
    safety_score: 7,
    best_time_to_visit: 'October to March',
    weather_info: 'Hot summers, pleasant winters'
  },
  {
    city_id: 'goa_01',
    name: 'Goa',
    state: 'Goa',
    description: 'Tropical paradise with pristine beaches and Portuguese heritage',
    short_tagline: 'Beach Capital of India',
    thumbnail_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop',
    popularity_score: 90,
    safety_score: 9,
    best_time_to_visit: 'November to February',
    weather_info: 'Tropical climate with monsoons'
  },
  {
    city_id: 'kerala_01',
    name: 'Kerala',
    state: 'Kerala',
    description: 'God\'s own country with backwaters, hill stations, and spices',
    short_tagline: 'God\'s Own Country',
    thumbnail_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop',
    popularity_score: 87,
    safety_score: 9,
    best_time_to_visit: 'September to March',
    weather_info: 'Tropical climate with heavy monsoons'
  },
  {
    city_id: 'delhi_01',
    name: 'Delhi',
    state: 'Delhi',
    description: 'Capital city blending ancient history with modern urban life',
    short_tagline: 'Heart of India',
    thumbnail_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
    popularity_score: 93,
    safety_score: 7,
    best_time_to_visit: 'October to March',
    weather_info: 'Extreme seasons with pollution concerns'
  }
];

export const tehsils: Tehsil[] = [
  {
    tehsil_id: 'agra_central',
    city_id: 'agra_01',
    name: 'Central Agra',
    description: 'Historic core with Taj Mahal and Agra Fort',
    thumbnail_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop',
    category: 'Heritage',
    safety_rating: 8,
    location_count: 3,
  },
  {
    tehsil_id: 'agra_north',
    city_id: 'agra_01',
    name: 'North Agra',
    description: 'Mehtab Bagh and peaceful riverside areas',
    thumbnail_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&h=200&fit=crop',
    category: 'Nature',
    safety_rating: 7,
    location_count: 2,
  },
  {
    tehsil_id: 'jaipur_amer',
    city_id: 'jaipur_01',
    name: 'Amer',
    description: 'Majestic forts and royal history',
    thumbnail_url: 'https://images.unsplash.com/photo-1534423892324-269ca0b93183?w=300&h=200&fit=crop',
    category: 'Heritage',
    safety_rating: 9,
    location_count: 4,
  },
  {
    tehsil_id: 'jaipur_city',
    city_id: 'jaipur_01',
    name: 'City Palace Area',
    description: 'The vibrant heart of the Pink City',
    thumbnail_url: 'https://images.unsplash.com/photo-1603262339346-d8c29a8a015c?w=300&h=200&fit=crop',
    category: 'Culture & Markets',
    safety_rating: 8,
    location_count: 5,
  }
];

export const locations: Location[] = [
  {
    location_id: 'taj_mahal',
    tehsil_id: 'agra_central',
    name: 'Taj Mahal',
    category: 'Heritage Monument',
    short_intro: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.',
    image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    basic_info: {
      opening_hours: 'Sunrise to Sunset (Closed Fridays)',
      best_time_to_visit: 'Sunrise or sunset for best lighting and fewer crowds.',
      entry_fee: { local: '₹50', foreigner: '₹1100 + ₹200 (mausoleum)' },
    },
    access_transport: {
      nearest_airport: 'Agra Airport (AGR) - 13km',
      public_transport_guide: 'Take an auto-rickshaw or e-rickshaw from any part of the city. No cars allowed within 500m.',
      taxi_fare_estimate: '₹200-300 from city center (one way)',
      last_mile_access: 'Electric bus or golf cart from the ticket counter.',
      travel_time_from_center: '20-30 minutes',
    },
    safety_risks: {
      safety_score: 9,
      common_scams: ['Unofficial "guides" at the entrance', 'Overpriced souvenirs', 'Fake photographers'],
      pickpocket_risk: 'Medium',
      emergency_contacts: [{ name: 'Tourist Police', number: '1363' }, { name: 'Local Police', number: '112' }],
    },
    local_insights: {
      cultural_etiquette: ['Dress modestly', 'No food or smoking inside', 'Photography of the main mausoleum interior is prohibited.'],
      local_phrases: [
        { phrase: 'Ticket kahan milega?', translation: 'Where can I get a ticket?', pronunciation: 'ticket ka-HAAN mil-AY-ga' },
        { phrase: 'Photo le sakte hain?', translation: 'Can I take a photo?', pronunciation: 'photo lay SAK-tay hain' },
      ],
      food_safety_note: 'Stick to bottled water. Eat at reputable restaurants outside the complex.',
      women_specific_tips: ['Generally very safe due to high security.', 'Be cautious of overly friendly strangers.'],
    },
    costs_money: {
      average_budget: '₹1500 per person (including ticket)',
      nearby_atms: 'Available near the ticket counters.',
      digital_payments_accepted: true,
      haggling_needed: 'Yes, for rickshaws and souvenirs.',
    },
    amenities: {
      toilets: 'Available',
      wifi_signal: 'Weak',
      seating: true,
      water_refill_points: true,
    },
    food_stay: {
      nearby_restaurants: [{ name: 'Pinch of Spice', rating: 4.5 }, { name: 'Esphahan', rating: 4.8 }],
      local_specialty: 'Petha (a sweet)',
    },
  },
  {
    location_id: 'amer_fort',
    tehsil_id: 'jaipur_amer',
    name: 'Amer Fort',
    category: 'Heritage Fort',
    short_intro: 'A majestic fort with a blend of Rajput and Mughal architecture, offering stunning views and intricate designs.',
    image_url: 'https://images.unsplash.com/photo-1534423892324-269ca0b93183?w=800&h=600&fit=crop',
    coordinates: { lat: 26.9855, lng: 75.8513 },
    basic_info: {
      opening_hours: '8:00 AM - 5:30 PM',
      best_time_to_visit: 'Early morning to avoid heat and crowds.',
      entry_fee: { local: '₹100', foreigner: '₹500' },
    },
    access_transport: {
      nearest_airport: 'Jaipur International Airport (JAI) - 22km',
      public_transport_guide: 'Local bus no. 5 from Ajmeri Gate. Auto-rickshaws are common.',
      taxi_fare_estimate: '₹400-500 from city center (one way)',
      last_mile_access: 'Walk up the hill or take a jeep (recommended over elephant rides).',
      travel_time_from_center: '30-45 minutes',
    },
    safety_risks: {
      safety_score: 8,
      common_scams: ['Overpriced elephant rides', 'Hawkers selling gems of "questionable" quality.'],
      pickpocket_risk: 'Medium',
      emergency_contacts: [{ name: 'Tourist Police', number: '1363' }],
    },
    local_insights: {
      cultural_etiquette: ['Wear comfortable walking shoes.', 'Consider hiring an official guide inside.'],
      local_phrases: [{ phrase: 'Raasta kidhar hai?', translation: 'Which way is it?', pronunciation: 'RAAS-ta KID-har hai' }],
      food_safety_note: 'Eat at the restaurant inside the fort or back in the city.',
      women_specific_tips: ['Safe during the day. Avoid walking in isolated areas of the fort alone.'],
    },
    costs_money: {
      average_budget: '₹800 per person (including ticket)',
      nearby_atms: 'Not available at the fort, use ATMs in Amer town.',
      digital_payments_accepted: true,
      haggling_needed: 'Yes, for taxis and souvenirs.',
    },
    amenities: {
      toilets: 'Available',
      wifi_signal: 'Weak',
      seating: true,
      water_refill_points: false,
    },
    food_stay: {
      nearby_restaurants: [{ name: '1135 AD', rating: 4.6 }],
      local_specialty: 'Dal Baati Churma',
    },
  },
];

export const safetyAlerts: SafetyAlert[] = [
  {
    id: 'alert_001',
    location: 'Agra',
    type: 'scam',
    severity: 'medium',
    title: 'Fake Guide Scam Near Taj Mahal',
    description: 'Be aware of unofficial guides offering "special" tours at inflated prices. Always use official guides with valid ID badges.',
    reported_at: '2025-01-15T10:30:00Z',
    verified: true
  },
  {
    id: 'alert_002',
    location: 'Delhi',
    type: 'safety',
    severity: 'high',
    title: 'Air Quality Alert',
    description: 'AQI levels are unhealthy today. Consider indoor activities and wear N95 masks if going outside.',
    reported_at: '2025-01-15T08:00:00Z',
    verified: true
  }
];

// Generate additional mock data
export const generateMockCities = (count: number): City[] => {
  const additionalCities: City[] = [];
  const states = ['Rajasthan', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'West Bengal'];
  
  for (let i = 0; i < count; i++) {
    additionalCities.push({
      city_id: `city_${i + 7}`,
      name: faker.location.city(),
      state: faker.helpers.arrayElement(states),
      description: faker.lorem.sentence(12),
      short_tagline: faker.lorem.words(3),
      thumbnail_url: `https://picsum.photos/400/300?random=${i + 10}`,
      popularity_score: faker.number.int({ min: 60, max: 95 }),
      safety_score: faker.number.int({ min: 6, max: 10 }),
      best_time_to_visit: faker.helpers.arrayElement(['October to March', 'November to February', 'September to March']),
      weather_info: faker.lorem.sentence(8)
    });
  }
  
  return additionalCities;
};

// --- Data Fetching Functions ---

export const getCityById = (cityId: string): City | undefined => {
  return cities.find(c => c.city_id === cityId);
};

export const getTehsilsByCityId = (cityId: string): Tehsil[] => {
  return tehsils.filter(t => t.city_id === cityId);
};

export const getTehsilById = (tehsilId: string): Tehsil | undefined => {
  return tehsils.find(t => t.tehsil_id === tehsilId);
};

export const getLocationsByTehsilId = (tehsilId: string): Location[] => {
  // In a real app, you'd filter. Here we return all for demo.
  if (tehsilId === 'agra_central') return [locations[0]];
  if (tehsilId === 'jaipur_amer') return [locations[1]];
  return locations.filter(l => l.tehsil_id === tehsilId);
};

export const getLocationById = (locationId: string): Location | undefined => {
  return locations.find(l => l.location_id === locationId);
};
