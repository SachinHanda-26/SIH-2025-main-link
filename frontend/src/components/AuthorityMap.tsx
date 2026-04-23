import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  MapPin,
  Search,
  Zap,
  Shield,
  AlertTriangle,
  Users,
  Plus,
  Minus,
  Locate,
  Eye,
  Radio,
  Navigation,
  Clock,
  Phone,
  Settings,
  Filter,
  Layers,
} from "lucide-react";

// Mock tourist data for demonstration
const mockTourists = [
  {
    id: 1,
    name: "John Smith",
    status: "safe",
    location: "India Gate, New Delhi",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    lastUpdate: "2 min ago",
    riskLevel: "Low",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    status: "caution",
    location: "Red Fort, Delhi",
    coordinates: { lat: 28.6562, lng: 77.241 },
    lastUpdate: "5 min ago",
    riskLevel: "Medium",
  },
  {
    id: 3,
    name: "Mike Wilson",
    status: "safe",
    location: "Lotus Temple, Delhi",
    coordinates: { lat: 28.5535, lng: 77.2588 },
    lastUpdate: "1 min ago",
    riskLevel: "Low",
  },
  {
    id: 4,
    name: "Emma Davis",
    status: "emergency",
    location: "Chandni Chowk, Delhi",
    coordinates: { lat: 28.6506, lng: 77.2334 },
    lastUpdate: "Just now",
    riskLevel: "High",
  },
  // ✅ New demo tourist inside the high-risk zone
  {
    id: 5,
    name: "Sameer",
    status: "emergency",
    location: "Sector 17, Chandigarh",
    coordinates: { lat: 30.6862, lng: 76.6619 },
    lastUpdate: "Just now",
    riskLevel: "High",
  },
];

interface Tourist {
  id: number;
  name: string;
  status: string;
  location: string;
  coordinates: { lat: number; lng: number };
  lastUpdate: string;
  riskLevel: string;
}

const AuthorityMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [tourists] = useState(mockTourists);
  const [markers, setMarkers] = useState([]);
  const [mapLayers, setMapLayers] = useState({
    tourists: true,
    safeZones: true,
    restrictedZones: true,
    emergencyServices: true,
    crowdDensity: true,
    weatherAlerts: false,
  });

  // Emergency services locations
  const emergencyServices = [
    {
      id: 1,
      name: "Police Station - CP",
      type: "police",
      coordinates: { lat: 28.6304, lng: 77.2177 },
    },
    {
      id: 2,
      name: "AIIMS Hospital",
      type: "hospital",
      coordinates: { lat: 28.5672, lng: 77.21 },
    },
    {
      id: 3,
      name: "Fire Station",
      type: "fire",
      coordinates: { lat: 28.6448, lng: 77.2167 },
    },
    {
      id: 4,
      name: "Police Station - South",
      type: "police",
      coordinates: { lat: 28.5355, lng: 77.25 },
    },
  ];

  // Restricted zones
  const restrictedZones = [
    {
      center: { lat: 28.6139, lng: 77.209 },
      radius: 500,
      reason: "VIP Movement",
      severity: "high",
    },
    {
      center: { lat: 30.6862, lng: 76.6619 },
      radius: 300,
      reason: "Construction Work",
      severity: "medium",
    },
  ];

  // Crowd density areas
  const crowdDensityAreas = [
    {
      center: { lat: 28.6129, lng: 77.2295 },
      radius: 800,
      density: "high",
      count: 150,
    },
    {
      center: { lat: 28.6506, lng: 77.2334 },
      radius: 600,
      density: "medium",
      count: 75,
    },
  ];

  useEffect(() => {
    const initializeMap = () => {
      if (window.google && mapRef.current) {
        const googleMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 30.6862, lng: 76.6619 }, // Delhi center
          zoom: 12,
          mapTypeId: "roadmap",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setMap(googleMap);

        // get live location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              googleMap.setCenter(pos);
              googleMap.setZoom(15);

              // Add a marker for the user’s live location
              new window.google.maps.Marker({
                position: pos,
                map: googleMap,
                title: "Your Location",
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#2563eb", // blue
                  fillOpacity: 0.9,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                },
              });
            },
            () => {
              console.warn(
                "Geolocation permission denied. Using default center."
              );
            }
          );
        }

        // Add click listener to close tourist details
        googleMap.addListener("click", () => {
          setSelectedTourist(null);
        });
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry,drawing`;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=geometry,drawing`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));
      const newMarkers = [];

      // Add tourist markers
      if (mapLayers.tourists) {
        tourists.forEach((tourist) => {
          const marker = new window.google.maps.Marker({
            position: tourist.coordinates,
            map: map,
            title: tourist.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: getStatusColor(tourist.status),
              fillOpacity: 0.9,
              strokeWeight: 3,
              strokeColor: "#ffffff",
            },
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${tourist.name}</h3>
                <p class="text-sm">Status: ${tourist.status}</p>
                <p class="text-sm">Location: ${tourist.location}</p>
                <p class="text-sm">Last Update: ${tourist.lastUpdate}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            setSelectedTourist(tourist);
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
        });
      }

      // Add emergency services markers
      if (mapLayers.emergencyServices) {
        emergencyServices.forEach((service) => {
          const marker = new window.google.maps.Marker({
            position: service.coordinates,
            map: map,
            title: service.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#1e40af",
              fillOpacity: 0.9,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${service.name}</h3>
                <p class="text-sm">Type: ${service.type}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
        });
      }

      // Add restricted zones
      if (mapLayers.restrictedZones) {
        restrictedZones.forEach((zone) => {
          const circle = new window.google.maps.Circle({
            strokeColor: zone.severity === "high" ? "#ef4444" : "#f97316",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: zone.severity === "high" ? "#ef4444" : "#f97316",
            fillOpacity: 0.2,
            map: map,
            center: zone.center,
            radius: zone.radius,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            position: zone.center,
            content: `
              <div class="p-2">
                <h3 class="font-bold text-red-600">Restricted Zone</h3>
                <p class="text-sm">Reason: ${zone.reason}</p>
                <p class="text-sm">Severity: ${zone.severity}</p>
              </div>
            `,
          });

          circle.addListener("click", () => {
            infoWindow.open(map);
          });
        });
      }

      // Add crowd density areas
      if (mapLayers.crowdDensity) {
        crowdDensityAreas.forEach((area) => {
          const circle = new window.google.maps.Circle({
            strokeColor: area.density === "high" ? "#ef4444" : "#f97316",
            strokeOpacity: 0.6,
            strokeWeight: 1,
            fillColor: area.density === "high" ? "#ef4444" : "#f97316",
            fillOpacity: 0.15,
            map: map,
            center: area.center,
            radius: area.radius,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            position: area.center,
            content: `
              <div class="p-2">
                <h3 class="font-bold">Crowd Density</h3>
                <p class="text-sm">Density: ${area.density}</p>
                <p class="text-sm">Count: ~${area.count} people</p>
              </div>
            `,
          });

          circle.addListener("click", () => {
            infoWindow.open(map);
          });
        });
      }

      setMarkers(newMarkers);
    }
  }, [map, mapLayers, tourists]);

  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "#10b981";
      case "caution":
        return "#f59e0b";
      case "emergency":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const toggleLayer = (layer) => {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const centerOnLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        map.setZoom(15);
      });
    }
  };

  const searchLocation = () => {
    if (searchQuery && map && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === "OK" && results[0]) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        }
      });
    }
  };

  const renderTouristDetails = (tourist) => (
    <Card className="absolute bottom-4 left-4 right-4 z-20 max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{tourist.name}</CardTitle>
          <Badge
            className={`text-white`}
            style={{ backgroundColor: getStatusColor(tourist.status) }}
          >
            {tourist.status.charAt(0).toUpperCase() + tourist.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{tourist.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Last update: {tourist.lastUpdate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span>Risk Level: {tourist.riskLevel}</span>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button size="sm" className="flex-1">
            <Phone className="h-3 w-3 mr-1" />
            Contact
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              map.setCenter(tourist.coordinates);
              map.setZoom(16);
            }}
          >
            <Navigation className="h-3 w-3 mr-1" />
            Track
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedTourist(null)}
          >
            ✕
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search locations, tourists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchLocation()}
              className="pl-10 w-64 bg-background shadow-lg"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background shadow-lg"
            onClick={searchLocation}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background shadow-lg"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute right-4 top-20 z-10 space-y-2">
        <Button
          size="icon"
          variant="outline"
          className="bg-background shadow-lg"
          onClick={zoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-background shadow-lg"
          onClick={zoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-background shadow-lg"
          onClick={centerOnLocation}
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="absolute left-4 top-20 z-10">
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="space-y-2">
              <p className="font-semibold text-sm mb-2">Map Layers</p>
              {Object.entries(mapLayers).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center space-x-2 text-xs cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleLayer(key)}
                    className="rounded"
                  />
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Maps Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Real-time Stats */}
      <div className="absolute top-4 right-4 z-10 max-w-xs">
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Active Tourists:</span>
                <Badge className="bg-green-100 text-green-800">
                  {tourists.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Safe Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  {tourists.filter((t) => t.status === "safe").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Needs Attention:</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {tourists.filter((t) => t.status === "caution").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Emergency:</span>
                <Badge className="bg-red-100 text-red-800">
                  {tourists.filter((t) => t.status === "emergency").length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <p className="font-semibold mb-2">Legend</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Safe Tourist</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Caution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Emergency</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Emergency Services</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span>Restricted Zone</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tourist Details Panel */}
      {selectedTourist && renderTouristDetails(selectedTourist)}
    </div>
  );
};

export default AuthorityMap;
