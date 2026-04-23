import { useState, useEffect, useCallback } from 'react';

interface UserStats {
  safetyScore: number;
  visitedPlaces: number;
  friendsCount: number;
  emergencyContacts: number;
  unreadNotifications: number;
  recentTrips: Array<{
    id: string;
    name: string;
    date: string;
    image: string;
    status: 'Completed' | 'Ongoing' | 'Planned';
  }>;
  recommendedDestinations: Array<{
    id: string;
    name: string;
    location: string;
    image: string;
    price: string;
    duration: string;
    rating: number;
    safetyRating: 'Excellent' | 'Good' | 'Fair';
    coordinates: {
      lat: number;
      lng: number;
    };
    placeType: string;
    description?: string;
    distance: number;
  }>;
}

const API_BASE_URL = 'http://localhost:5001/api';

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Get user's exact location first
  const getCurrentLocation = useCallback(() => {
    return new Promise<{lat: number, lng: number}>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log('📍 SafarSuraksha: Got exact location:', location);
            resolve(location);
          },
          (error) => {
            console.error('❌ SafarSuraksha: Location failed:', error);
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }, []);

  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📊 SafarSuraksha: Starting stats fetch...');
      
      // First, get exact current location
      let location: {lat: number, lng: number};
      try {
        location = await getCurrentLocation();
        setCurrentLocation(location);
      } catch (locationError) {
        console.warn('Could not get location, no recommendations will be shown');
        setUserStats({
          safetyScore: calculateBasicSafetyScore(),
          visitedPlaces: countVisitedPlaces(),
          friendsCount: 0,
          emergencyContacts: 0,
          unreadNotifications: 0,
          recentTrips: [],
          recommendedDestinations: []
        });
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('safar_auth_token');
      
      // Try backend API first
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/user/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setUserStats(data.data);
              console.log('✅ SafarSuraksha: Stats from backend API');
              return;
            }
          }
        } catch (apiError) {
          console.warn('Backend API failed, using location-based calculation');
        }
      }

      // Get location-specific recommendations
      const recommendations = await getLocationSpecificRecommendations(location);
      
      const calculatedStats: UserStats = {
        safetyScore: calculateBasicSafetyScore(),
        visitedPlaces: countVisitedPlaces(),
        friendsCount: 0,
        emergencyContacts: getEmergencyContactsCount(),
        unreadNotifications: 0,
        recentTrips: await getRealRecentTrips(),
        recommendedDestinations: recommendations
      };

      setUserStats(calculatedStats);
      console.log('✅ SafarSuraksha: Stats calculated with location-based recommendations');

    } catch (error) {
      console.error('❌ SafarSuraksha: Stats fetch failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to load stats');
      
      setUserStats({
        safetyScore: 60,
        visitedPlaces: 0,
        friendsCount: 0,
        emergencyContacts: 0,
        unreadNotifications: 0,
        recentTrips: [],
        recommendedDestinations: []
      });
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation]);

  // Get recommendations strictly based on current location
  const getLocationSpecificRecommendations = async (location: {lat: number, lng: number}) => {
    try {
      console.log(`🗺️ SafarSuraksha: Fetching recommendations for ${location.lat}, ${location.lng}`);

      // Try SafarSuraksha backend first
      try {
        const response = await fetch(`${API_BASE_URL}/recommendations/nearby`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            latitude: location.lat, 
            longitude: location.lng, 
            radius: 25000,
            limit: 3 
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.recommendations && data.recommendations.length > 0) {
            console.log('✅ Recommendations from SafarSuraksha backend');
            return data.recommendations;
          }
        }
      } catch (backendError) {
        console.warn('SafarSuraksha backend failed, trying OpenStreetMap...');
      }

      return await fetchNearbyPlacesFromOSM(location);
      
    } catch (error) {
      console.error('Failed to get location-specific recommendations:', error);
      return [];
    }
  };

  // Fetch real places from OpenStreetMap with real images
  const fetchNearbyPlacesFromOSM = async (location: {lat: number, lng: number}) => {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          // Tourist attractions
          way["tourism"~"attraction|museum|monument|viewpoint|zoo|theme_park|gallery"](around:30000,${location.lat},${location.lng});
          node["tourism"~"attraction|museum|monument|viewpoint|zoo|theme_park|gallery"](around:30000,${location.lat},${location.lng});
          
          // Historical places
          way["historic"~"monument|castle|fort|palace|temple|ruins|archaeological_site|memorial"](around:30000,${location.lat},${location.lng});
          node["historic"~"monument|castle|fort|palace|temple|ruins|archaeological_site|memorial"](around:30000,${location.lat},${location.lng});
          
          // Religious places (common in Punjab)
          way["amenity"~"place_of_worship"]["name"](around:30000,${location.lat},${location.lng});
          node["amenity"~"place_of_worship"]["name"](around:30000,${location.lat},${location.lng});
          
          // Educational and cultural institutions
          way["amenity"~"university|college|library"]["name"](around:30000,${location.lat},${location.lng});
          node["amenity"~"university|college|library"]["name"](around:30000,${location.lat},${location.lng});
          
          // Natural features and parks
          way["natural"~"peak|lake|park|reserve|water"]["name"](around:30000,${location.lat},${location.lng});
          node["natural"~"peak|lake|park|reserve|water"]["name"](around:30000,${location.lat},${location.lng});
          way["leisure"~"park|garden|recreation_ground|stadium"]["name"](around:30000,${location.lat},${location.lng});
          node["leisure"~"park|garden|recreation_ground|stadium"]["name"](around:30000,${location.lat},${location.lng});
        );
        out center meta;
      `;

      console.log('🌍 Querying OpenStreetMap for places near your location...');
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: { 'Content-Type': 'text/plain' }
      });

      if (!response.ok) {
        throw new Error(`OpenStreetMap query failed: ${response.status}`);
      }

      const osmData = await response.json();
      console.log(`📍 Found ${osmData.elements.length} places from OpenStreetMap`);

      if (!osmData.elements || osmData.elements.length === 0) {
        console.warn('No places found near your location');
        return [];
      }

      // Process places with real images
      const processedPlaces = await Promise.all(
        osmData.elements
          .filter((element: any) => {
            if (!element.tags || !element.tags.name) return false;
            const name = element.tags.name.toLowerCase();
            if (name.length < 3 || name === 'unnamed' || name === 'untitled') return false;
            return true;
          })
          .map(async (element: any) => {
            const placeLat = element.lat || element.center?.lat || location.lat;
            const placeLon = element.lon || element.center?.lon || location.lng;
            const distance = calculateDistance(location.lat, location.lng, placeLat, placeLon);
            
            // Get real image for this place
            const realImage = await getRealPlaceImage(element.tags.name, element.tags);
            
            return {
              element,
              distance,
              placeLat,
              placeLon,
              name: element.tags.name,
              realImage
            };
          })
      );

      const places = processedPlaces
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 8)
        .filter((item: any) => item.distance <= 50)
        .slice(0, 3)
        .map((item: any) => {
          const { element, distance, placeLat, placeLon, realImage } = item;
          
          return {
            id: `osm_${element.type}_${element.id}`,
            name: element.tags.name,
            location: buildLocationString(element.tags, placeLat, placeLon, distance),
            image: realImage,
            price: estimatePriceByType(element.tags, distance),
            duration: estimateDurationByDistance(distance),
            rating: calculateRatingFromTags(element.tags),
            safetyRating: calculateSafetyFromTags(element.tags, distance) as 'Excellent' | 'Good' | 'Fair',
            coordinates: {
              lat: placeLat,
              lng: placeLon
            },
            placeType: getPlaceType(element.tags),
            description: buildPlaceDescription(element.tags),
            distance: Math.round(distance)
          };
        });

      console.log(`✅ Processed ${places.length} location-based recommendations with real images`);
      return places;

    } catch (error) {
      console.error('OpenStreetMap query failed:', error);
      return [];
    }
  };

  // Get real images from multiple sources
  const getRealPlaceImage = async (placeName: string, tags: any): Promise<string> => {
    try {
      // Try to get image from Wikipedia if available
      if (tags.wikipedia) {
        const wikipediaImage = await getWikipediaImage(tags.wikipedia);
        if (wikipediaImage) return wikipediaImage;
      }

      // Try Wikimedia Commons search
      const wikimediaImage = await searchWikimediaImage(placeName);
      if (wikimediaImage) return wikimediaImage;

      // Try Unsplash with specific search terms
      const unsplashImage = await searchUnsplashImage(placeName, tags);
      if (unsplashImage) return unsplashImage;

      // Fallback to category-based stock images
      return getCategoryBasedImage(tags);

    } catch (error) {
      console.warn(`Failed to get real image for ${placeName}:`, error);
      return getCategoryBasedImage(tags);
    }
  };

  // Get image from Wikipedia
  const getWikipediaImage = async (wikipediaUrl: string): Promise<string | null> => {
    try {
      const title = wikipediaUrl.split('/').pop();
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail && data.thumbnail.source) {
          return data.thumbnail.source.replace(/\/\d+px-/, '/400px-');
        }
      }
    } catch (error) {
      console.warn('Wikipedia image fetch failed:', error);
    }
    return null;
  };

  // Search Wikimedia Commons
  const searchWikimediaImage = async (placeName: string): Promise<string | null> => {
    try {
      const searchQuery = encodeURIComponent(placeName);
      const response = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchQuery}&srnamespace=6&srlimit=1&origin=*`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.query && data.query.search && data.query.search.length > 0) {
          const fileName = data.query.search[0].title.replace('File:', '');
          return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=400`;
        }
      }
    } catch (error) {
      console.warn('Wikimedia search failed:', error);
    }
    return null;
  };

  // Search Unsplash with place name
  const searchUnsplashImage = async (placeName: string, tags: any): Promise<string | null> => {
    try {
      // Build search terms based on place type and name
      const searchTerms = [];
      searchTerms.push(placeName);
      
      if (tags.tourism) searchTerms.push(tags.tourism);
      if (tags.historic) searchTerms.push(tags.historic);
      if (tags.amenity === 'place_of_worship') {
        if (tags.religion === 'sikh') searchTerms.push('gurudwara', 'sikh temple');
        else if (tags.religion === 'hindu') searchTerms.push('hindu temple');
        else if (tags.religion === 'christian') searchTerms.push('church');
        else searchTerms.push('temple', 'worship place');
      }
      
      // Add location context
      searchTerms.push('punjab', 'india');
      
      const searchQuery = searchTerms.join(' ');
      const unsplashUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(searchQuery)}`;
      
      // Test if the image loads
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(unsplashUrl);
        img.onerror = () => resolve(null);
        img.src = unsplashUrl;
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(null), 3000);
      });
      
    } catch (error) {
      console.warn('Unsplash search failed:', error);
    }
    return null;
  };

  // Category-based fallback images
  const getCategoryBasedImage = (tags: any): string => {
    // Religious places
    if (tags.amenity === 'place_of_worship') {
      if (tags.religion === 'sikh') return 'https://images.unsplash.com/photo-1587474805438-c4b8db37b87b?w=400&h=300&fit=crop&q=80';
      if (tags.religion === 'hindu') return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&q=80';
      if (tags.religion === 'christian') return 'https://images.unsplash.com/photo-1520637836862-4d197d17c9a8?w=400&h=300&fit=crop&q=80';
      return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&q=80';
    }
    
    // Historical places
    if (tags.historic === 'fort' || tags.historic === 'castle') return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&q=80';
    if (tags.historic === 'monument') return 'https://images.unsplash.com/photo-1571757767896-7b93a1f40f5f?w=400&h=300&fit=crop&q=80';
    if (tags.historic === 'palace') return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80';
    
    // Museums
    if (tags.tourism === 'museum') return 'https://images.unsplash.com/photo-1513475382419-0da0b5c4b4e5?w=400&h=300&fit=crop&q=80';
    
    // Natural/Parks
    if (tags.leisure === 'park' || tags.natural) return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80';
    
    // Universities/Educational
    if (tags.amenity === 'university' || tags.amenity === 'college') return 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&q=80';
    
    // General attraction
    return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80';
  };

  // Helper functions
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const buildLocationString = (tags: any, lat: number, lon: number, distance: number): string => {
    const parts = [];
    
    if (tags['addr:city']) parts.push(tags['addr:city']);
    else if (tags['addr:town']) parts.push(tags['addr:town']);
    else if (tags['addr:village']) parts.push(tags['addr:village']);
    
    if (tags['addr:state']) parts.push(tags['addr:state']);
    else parts.push('Punjab');
    
    parts.push('India');
    
    if (parts.length <= 2) {
      return `${distance.toFixed(1)}km from your location`;
    }
    
    return parts.join(', ');
  };

  const getPlaceType = (tags: any): string => {
    if (tags.tourism) return tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1);
    if (tags.historic) return `Historic ${tags.historic}`;
    if (tags.amenity === 'place_of_worship') {
      if (tags.religion === 'sikh') return 'Gurudwara';
      if (tags.religion === 'hindu') return 'Hindu Temple';
      if (tags.religion === 'christian') return 'Church';
      return 'Place of Worship';
    }
    if (tags.amenity === 'university') return 'University';
    if (tags.amenity === 'college') return 'College';
    if (tags.leisure === 'park') return 'Park';
    if (tags.natural) return 'Natural Feature';
    return 'Place of Interest';
  };

  const buildPlaceDescription = (tags: any): string => {
    const descriptions = [];
    
    if (tags.description) descriptions.push(tags.description);
    if (tags.historic && tags.tourism) descriptions.push(`A historic ${tags.historic} and popular tourist ${tags.tourism}`);
    else if (tags.historic) descriptions.push(`A historic ${tags.historic}`);
    else if (tags.tourism) descriptions.push(`A popular tourist ${tags.tourism}`);
    
    if (tags.amenity === 'place_of_worship') {
      if (tags.religion === 'sikh') descriptions.push('A sacred Sikh place of worship');
      else descriptions.push(`A ${tags.religion || 'religious'} place of worship`);
    }
    
    if (descriptions.length === 0) {
      descriptions.push('An interesting place to visit');
    }
    
    return descriptions[0];
  };

  const estimatePriceByType = (tags: any, distance: number): string => {
    if (tags.fee === 'no' || tags.fee === 'free') return 'Free';
    
    if (tags.amenity === 'place_of_worship') return 'Free';
    if (tags.leisure === 'park') return 'Free-₹20';
    if (tags.natural) return 'Free';
    
    if (tags.tourism === 'museum') return '₹30-100';
    if (tags.historic === 'monument') return '₹25-75';
    if (tags.historic === 'fort' || tags.historic === 'castle') return '₹50-150';
    if (tags.tourism === 'attraction') return '₹50-200';
    
    if (distance > 30) return '₹500-2000';
    if (distance > 10) return '₹200-800';
    return '₹50-300';
  };

  const estimateDurationByDistance = (distance: number): string => {
    if (distance > 40) return 'Full Day';
    if (distance > 20) return 'Half Day';
    if (distance > 5) return '3-4 Hours';
    return '1-2 Hours';
  };

  const calculateRatingFromTags = (tags: any): number => {
    let rating = 3.8;
    
    if (tags.wikipedia || tags.wikidata) rating += 0.6;
    if (tags.website) rating += 0.3;
    if (tags.heritage === 'world') rating += 0.8;
    if (tags.tourism === 'attraction') rating += 0.2;
    if (tags.opening_hours) rating += 0.2;
    if (tags.wheelchair === 'yes') rating += 0.3;
    
    if (tags.amenity === 'place_of_worship') rating += 0.4;
    
    rating += (Math.random() - 0.5) * 0.4;
    
    return Math.min(5.0, Math.max(3.0, Math.round(rating * 10) / 10));
  };

  const calculateSafetyFromTags = (tags: any, distance: number): string => {
    let score = 70;
    
    if (tags.tourism === 'museum') score += 15;
    if (tags.amenity === 'place_of_worship') score += 20;
    if (tags.leisure === 'park') score += 10;
    if (tags.historic) score += 10;
    
    if (tags.wikipedia || tags.wikidata) score += 15;
    if (tags.website) score += 10;
    if (tags.opening_hours) score += 5;
    
    if (distance < 15) score += 10;
    else if (distance > 40) score -= 10;
    
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Good';
    return 'Fair';
  };

  const calculateBasicSafetyScore = (): number => {
    const stored = localStorage.getItem('safar_safety_score');
    if (stored) return parseInt(stored) || 75;
    
    let score = 65;
    if ('geolocation' in navigator) score += 10;
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 20) score += 10;
    
    localStorage.setItem('safar_safety_score', score.toString());
    return score;
  };

  const countVisitedPlaces = (): number => {
    try {
      const visited = localStorage.getItem('safar_visited_places');
      return visited ? JSON.parse(visited).length : 0;
    } catch {
      return 0;
    }
  };

  const getEmergencyContactsCount = (): number => {
    try {
      const contacts = localStorage.getItem('safar_emergency_contacts');
      return contacts ? JSON.parse(contacts).length : 0;
    } catch {
      return 0;
    }
  };

  const getRealRecentTrips = async () => {
    try {
      const trips = localStorage.getItem('safar_recent_trips');
      return trips ? JSON.parse(trips) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    console.log('🚀 SafarSuraksha: Initializing user stats...');
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    userStats,
    loading,
    error,
    refetchStats: fetchUserStats,
    currentLocation
  };
};
