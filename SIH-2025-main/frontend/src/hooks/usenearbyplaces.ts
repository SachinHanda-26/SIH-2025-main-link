import { useState, useEffect, useCallback } from 'react';

interface NearbyPlace {
  id: string;
  name: string;
  category: 'attraction' | 'restaurant' | 'hotel' | 'shopping' | 'service' | 'transport';
  type: string;
  address: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  distance: number;
  rating?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  openingHours?: string;
  phone?: string;
  website?: string;
  image?: string;
  description?: string;
  safetyScore?: number;
  isOpen?: boolean;
  tags: string[];
}

export const useNearbyPlaces = (location: {lat: number, lng: number} | null) => {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyPlaces = useCallback(async () => {
    if (!location) {
      setNearbyPlaces([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🗺️ SafarSuraksha: Fetching nearby places...');

      // Create demo places based on real location
      const demoPlaces: NearbyPlace[] = [
        {
          id: 'place_1',
          name: 'Local Tourist Attraction',
          category: 'attraction',
          type: 'Landmark',
          address: `Near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          coordinates: { 
            lat: location.lat + (Math.random() - 0.5) * 0.01, 
            lon: location.lng + (Math.random() - 0.5) * 0.01 
          },
          distance: Math.round(Math.random() * 1000) + 100,
          rating: 4.2 + Math.random() * 0.6,
          isOpen: true,
          tags: ['attraction', 'landmark']
        },
        {
          id: 'place_2',
          name: 'Popular Local Restaurant',
          category: 'restaurant',
          type: 'Restaurant',
          address: `Near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          coordinates: { 
            lat: location.lat + (Math.random() - 0.5) * 0.01, 
            lon: location.lng + (Math.random() - 0.5) * 0.01 
          },
          distance: Math.round(Math.random() * 800) + 200,
          rating: 4.1 + Math.random() * 0.7,
          priceLevel: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
          isOpen: Math.random() > 0.3,
          phone: '+91-9876543210',
          tags: ['restaurant', 'food']
        },
        {
          id: 'place_3', 
          name: 'Nearby Hotel',
          category: 'hotel',
          type: 'Hotel',
          address: `Near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          coordinates: { 
            lat: location.lat + (Math.random() - 0.5) * 0.01, 
            lon: location.lng + (Math.random() - 0.5) * 0.01 
          },
          distance: Math.round(Math.random() * 1200) + 300,
          rating: 3.8 + Math.random() * 1.0,
          priceLevel: (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4,
          phone: '+91-9876543211',
          website: 'https://example-hotel.com',
          isOpen: true,
          tags: ['hotel', 'accommodation']
        },
        {
          id: 'place_4',
          name: 'Shopping Center',
          category: 'shopping',
          type: 'Mall',
          address: `Shopping area near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          coordinates: { 
            lat: location.lat + (Math.random() - 0.5) * 0.01, 
            lon: location.lng + (Math.random() - 0.5) * 0.01 
          },
          distance: Math.round(Math.random() * 1500) + 400,
          rating: 4.0 + Math.random() * 0.8,
          isOpen: Math.random() > 0.2,
          openingHours: '10:00 AM - 10:00 PM',
          tags: ['shopping', 'mall']
        },
        {
          id: 'place_5',
          name: 'Medical Services',
          category: 'service',
          type: 'Hospital',
          address: `Healthcare facility near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          coordinates: { 
            lat: location.lat + (Math.random() - 0.5) * 0.01, 
            lon: location.lng + (Math.random() - 0.5) * 0.01 
          },
          distance: Math.round(Math.random() * 2000) + 500,
          rating: 4.3 + Math.random() * 0.5,
          isOpen: true,
          phone: '+91-9876543212',
          openingHours: '24 Hours',
          tags: ['hospital', 'medical', 'emergency']
        }
      ].sort((a, b) => a.distance - b.distance);

      setNearbyPlaces(demoPlaces);
      console.log(`✅ SafarSuraksha: Loaded ${demoPlaces.length} nearby places`);

    } catch (error) {
      console.error('❌ SafarSuraksha: Places fetch failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to load nearby places');
      setNearbyPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchNearbyPlaces();
  }, [fetchNearbyPlaces]);

  return {
    nearbyPlaces,
    loading,
    error,
    refetch: fetchNearbyPlaces
  };
};

export type { NearbyPlace };
