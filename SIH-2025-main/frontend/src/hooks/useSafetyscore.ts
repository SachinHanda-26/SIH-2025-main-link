import { useState, useEffect } from 'react';

interface NearbyPlace {
  id: string;
  coordinates: { lat: number; lon: number };
  category: string;
  rating?: number;
  distance: number;
}

export const useSafetyScores = (places: NearbyPlace[]) => {
  const [safetyScores, setSafetyScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (places.length === 0) {
      setSafetyScores({});
      return;
    }

    const calculateSafetyScores = () => {
      setLoading(true);
      
      const calculatedScores: Record<string, number> = {};
      
      places.forEach(place => {
        let score = 75; // Base score
        
        // Category-based adjustments
        if (place.category === 'attraction') score += 10;
        if (place.category === 'hotel' && place.rating && place.rating > 4) score += 15;
        if (place.category === 'restaurant' && place.rating && place.rating > 4) score += 10;
        if (place.category === 'service') score += 5;
        
        // Distance-based adjustments (closer = potentially safer due to more activity)
        if (place.distance < 500) score += 10;
        else if (place.distance < 1000) score += 5;
        
        // Rating-based adjustments
        if (place.rating) {
          score += Math.round((place.rating - 3) * 10);
        }
        
        // Random factor for demo (in real app, this would be crime data, etc.)
        score += Math.round((Math.random() - 0.5) * 20);
        
        // Ensure score is within bounds
        score = Math.max(30, Math.min(95, score));
        
        calculatedScores[place.id] = score;
      });

      setSafetyScores(calculatedScores);
      setLoading(false);
    };

    // Simulate API call delay
    const timer = setTimeout(calculateSafetyScores, 500);
    
    return () => clearTimeout(timer);
  }, [places]);

  return { safetyScores, loading };
};
