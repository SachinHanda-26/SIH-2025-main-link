import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface LocationPickerProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

const popularLocations: Location[] = [
  { lat: 28.6139, lon: 77.2090, name: "India Gate" },
  { lat: 28.6562, lon: 77.2410, name: "Red Fort" },
  { lat: 28.5355, lon: 77.3910, name: "Qutub Minar" },
  { lat: 28.5921, lon: 77.2505, name: "Lotus Temple" },
  { lat: 28.6129, lon: 77.2295, name: "Rashtrapati Bhavan" },
  { lat: 19.0760, lon: 72.8777, name: "Gateway of India, Mumbai" },
  { lat: 12.9716, lon: 77.5946, name: "Cubbon Park, Bangalore" },
  { lat: 22.5726, lon: 88.3639, name: "Victoria Memorial, Kolkata" },
  { lat: 26.9124, lon: 75.7873, name: "Hawa Mahal, Jaipur" },
  { lat: 27.1751, lon: 78.0421, name: "Taj Mahal, Agra" },
];

export function LocationPicker({ currentLocation, onLocationChange }: LocationPickerProps) {
  const [customLat, setCustomLat] = useState(currentLocation.lat.toString());
  const [customLon, setCustomLon] = useState(currentLocation.lon.toString());
  const [customName, setCustomName] = useState(currentLocation.name);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGettingLocationName, setIsGettingLocationName] = useState(false);

  // Reverse geocoding function using Nominatim (free)
  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      setIsGettingLocationName(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'SafarSathi App'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        const parts = [];
        
        // Build location name with available address components
        if (address.city || address.town || address.village) {
          parts.push(address.city || address.town || address.village);
        }
        if (address.state) {
          parts.push(address.state);
        }
        if (address.country) {
          parts.push(address.country);
        }
        
        return parts.length > 0 ? parts.join(', ') : data.display_name;
      }
      
      return `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    } catch (error) {
      console.error('Error getting location name:', error);
      return `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    } finally {
      setIsGettingLocationName(false);
    }
  };

  const handleLocationSelect = async (location: Location) => {
    if (location.name === "Current Location" || location.name.includes("Location (")) {
      // If it's a coordinate-based location, try to get the real name
      const realName = await getLocationName(location.lat, location.lon);
      onLocationChange({
        ...location,
        name: realName
      });
    } else {
      onLocationChange(location);
    }
  };

  const handleCustomLocationSubmit = async () => {
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    
    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid latitude and longitude values");
      return;
    }
    
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert("Please enter valid coordinate ranges (Lat: -90 to 90, Lon: -180 to 180)");
      return;
    }
    
    let locationName = customName;
    
    // If no custom name provided, get it via reverse geocoding
    if (!locationName.trim()) {
      locationName = await getLocationName(lat, lon);
    }
    
    onLocationChange({
      lat,
      lon,
      name: locationName || `Custom Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`
    });
    setShowCustomInput(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Get the actual location name
          const locationName = await getLocationName(lat, lon);
          
          onLocationChange({
            lat,
            lon,
            name: locationName
          });
          setIsGettingLocation(false);
        },
        (error) => {
          alert("Unable to get current location: " + error.message);
          setIsGettingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  // Effect to update location name when coordinates change
  useEffect(() => {
    if (currentLocation.name === "Current Location" && currentLocation.lat && currentLocation.lon) {
      getLocationName(currentLocation.lat, currentLocation.lon).then(name => {
        if (name !== currentLocation.name) {
          onLocationChange({
            ...currentLocation,
            name: name
          });
        }
      });
    }
  }, [currentLocation.lat, currentLocation.lon]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Location Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Display */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-blue-900">{currentLocation.name}</p>
                {isGettingLocationName && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
              </div>
              <p className="text-sm text-blue-700">
                {currentLocation.lat.toFixed(4)}° N, {currentLocation.lon.toFixed(4)}° E
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 mr-1" />
              )}
              Use GPS
            </Button>
          </div>
        </div>

        {/* Popular Locations */}
        <div>
          <Label className="text-sm font-medium">Popular Locations</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {popularLocations.map((location, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto p-3"
                onClick={() => handleLocationSelect(location)}
              >
                <div>
                  <p className="font-medium text-sm">{location.name}</p>
                  <p className="text-xs text-gray-500">
                    {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Location Input */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            {showCustomInput ? "Hide Custom Input" : "Enter Custom Coordinates"}
          </Button>

          {showCustomInput && (
            <div className="mt-3 space-y-3 p-3 border rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="location-name">Location Name (optional)</Label>
                <Input
                  id="location-name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Leave blank to auto-detect location name"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="28.6139"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    placeholder="77.2090"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleCustomLocationSubmit} className="w-full">
                Set Custom Location
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLocationSelect(popularLocations[0])}
            className="flex-1"
          >
            Delhi
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLocationSelect(popularLocations[5])}
            className="flex-1"
          >
            Mumbai
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLocationSelect(popularLocations[6])}
            className="flex-1"
          >
            Bangalore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
