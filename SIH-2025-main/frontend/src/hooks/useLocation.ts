import { useState, useEffect } from 'react';

export interface Location {
  lat: number;
  lon: number;
  accuracy?: number;
  timestamp?: number;
  name?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let watchId: number;

    const getLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
          setError(null);
          setIsLoading(false);
        },
        (err) => {
          setError(`Failed to get location: ${err.message}`);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const updateLocationName = (name: string) => {
    if (location) {
      setLocation({ ...location, name });
    }
  };

  const setManualLocation = (newLocation: Location) => {
    setLocation(newLocation);
    setError(null);
    setIsLoading(false);
  };

  return {
    location,
    error,
    isLoading,
    updateLocationName,
    setManualLocation,
  };
}