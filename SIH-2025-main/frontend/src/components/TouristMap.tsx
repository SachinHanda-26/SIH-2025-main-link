// // ------------- claude2.0 half
// import { useState, useEffect, useRef } from "react";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Input } from "./ui/input";
// import {
//   MapPin,
//   Navigation,
//   Shield,
//   Camera,
//   Phone,
//   Plus,
//   Minus,
//   Locate,
//   Star,
//   Clock,
//   Route,
//   Search,
//   Layers,
//   Building,
//   Loader2,
//   RefreshCw,
//   Globe,
//   NavigationIcon,
//   Crosshair,
// } from "lucide-react";

// // TypeScript declarations for Google Maps
// declare global {
//   interface Window {
//     google: typeof google;
//   }
// }

// declare namespace google.maps {
//   class Map {
//     constructor(mapDiv: Element, opts?: MapOptions);
//   }

//   interface MapOptions {
//     center: LatLng | LatLngLiteral;
//     zoom: number;
//     styles?: MapTypeStyle[];
//   }

//   interface LatLng {
//     lat(): number;
//     lng(): number;
//   }

//   interface LatLngLiteral {
//     lat: number;
//     lng: number;
//   }

//   class Marker {
//     constructor(opts?: MarkerOptions);
//     setMap(map: Map | null): void;
//     addListener(eventName: string, handler: () => void): void;
//   }

//   interface MarkerOptions {
//     position: LatLng | LatLngLiteral;
//     map?: Map;
//     title?: string;
//     icon?: string | Icon | Symbol;
//   }

//   interface Icon {
//     url: string;
//     scaledSize?: Size;
//   }

//   class Size {
//     constructor(width: number, height: number);
//   }

//   class InfoWindow {
//     constructor(opts?: InfoWindowOptions);
//     open(map: Map, anchor?: Marker): void;
//   }

//   interface InfoWindowOptions {
//     content?: string;
//   }

//   interface MapTypeStyle {
//     featureType?: string;
//     elementType?: string;
//     stylers?: Array<{ [key: string]: any }>;
//   }
// }

// interface TouristMapProps {
//   language?: string;
//   googleMapsApiKey?: string;
// }

// interface LocationPoint {
//   id: string;
//   name: string;
//   type:
//     | "user"
//     | "attraction"
//     | "emergency"
//     | "commercial"
//     | "police"
//     | "hospital";
//   position: { lat: number; lng: number };
//   safetyLevel: "safe" | "caution" | "danger";
//   crowdLevel?: "low" | "moderate" | "high";
//   category: string;
//   rating?: number;
//   distance?: string;
//   isCurrentLocation: boolean;
//   lastUpdated?: string;
// }

// const API_BASE_URL = "http://localhost:3000/api";

// // Google Maps loader utility
// const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve();
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.defer = true;

//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Google Maps script failed to load"));

//     document.head.appendChild(script);
//   });
// };

// export function TouristMap({
//   language = "en",
//   googleMapsApiKey,
// }: TouristMapProps) {
//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     lng: number;
//     name: string;
//   } | null>(null);
//   const [locationLoading, setLocationLoading] = useState(true);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [selectedFilter, setSelectedFilter] = useState("all");
//   const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });
//   const [nearbyLocations, setNearbyLocations] = useState<LocationPoint[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [useGoogleMaps, setUseGoogleMaps] = useState(true);

//   // Refs for map container
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const googleMapRef = useRef<google.maps.Map | null>(null);
//   const markersRef = useRef<google.maps.Marker[]>([]);

//   const translations = {
//     en: {
//       interactiveMap: "SafarSuraksha Live Map",
//       safeZone: "Safe Zone",
//       restricted: "Restricted",
//       yourLocation: "Your Location",
//       attractions: "Attractions",
//       moderateCrowd: "Moderate Crowd",
//       aiMonitoring: "AI Monitoring",
//       getDirections: "Get Directions",
//       safe: "Safe",
//       caution: "Caution",
//       danger: "Danger",
//       high: "High",
//       moderate: "Moderate",
//       low: "Low",
//       searchPlaces: "Search places near you...",
//       mapLayers: "Map Layers",
//       traffic: "Traffic",
//       transit: "Transit",
//       satellite: "Satellite",
//       terrain: "Terrain",
//       myLocation: "My Location",
//       nearbyPlaces: "Nearby SafarSuraksha Places",
//       safetyLevel: "Safety Level",
//       crowdLevel: "Crowd Level",
//       lastUpdated: "Last updated",
//       minutesAgo: "minutes ago",
//       liveUpdate: "Live Update",
//       emergencyServices: "Emergency Services",
//       policeStation: "Police Station",
//       hospital: "Hospital",
//       touristInfo: "Tourist Information",
//       gettingLocation: "Getting your location...",
//       locationFound: "Location found",
//       enableLocation: "Enable Location",
//       refreshLocation: "Refresh Location",
//       coordinates: "Coordinates",
//       switchToGoogleMaps: "Switch to Google Maps",
//       switchToBasicMap: "Switch to Basic Map",
//     },
//     hi: {
//       interactiveMap: "सफरसुरक्षा लाइव मैप",
//       safeZone: "सुरक्षित क्षेत्र",
//       restricted: "प्रतिबंधित",
//       yourLocation: "आपका स्थान",
//       attractions: "आकर्षण",
//       moderateCrowd: "मध्यम भीड़",
//       aiMonitoring: "AI निगरानी",
//       getDirections: "दिशा-निर्देश",
//       safe: "सुरक्षित",
//       caution: "सावधानी",
//       danger: "खतरा",
//       high: "उच्च",
//       moderate: "मध्यम",
//       low: "कम",
//       searchPlaces: "अपने आस-पास स्थान खोजें...",
//       mapLayers: "मैप लेयर्स",
//       traffic: "ट्रैफिक",
//       transit: "ट्रांजिट",
//       satellite: "सैटेलाइट",
//       terrain: "भूभाग",
//       myLocation: "मेरा स्थान",
//       nearbyPlaces: "आस-पास के सफरसुरक्षा स्थान",
//       safetyLevel: "सुरक्षा स्तर",
//       crowdLevel: "भीड़ का स्तर",
//       lastUpdated: "अंतिम अपडेट",
//       minutesAgo: "मिनट पहले",
//       liveUpdate: "लाइव अपडेट",
//       emergencyServices: "आपातकालीन सेवाएं",
//       policeStation: "पुलिस स्टेशन",
//       hospital: "अस्पताल",
//       touristInfo: "पर्यटक जानकारी",
//       gettingLocation: "आपका स्थान ढूंढा जा रहा है...",
//       locationFound: "स्थान मिल गया",
//       enableLocation: "स्थान सक्षम करें",
//       refreshLocation: "स्थान रीफ्रेश करें",
//       coordinates: "निर्देशांक",
//       switchToGoogleMaps: "गूगल मैप्स पर स्विच करें",
//       switchToBasicMap: "बेसिक मैप पर स्विच करें",
//     },
//   };

//   const t = (key: string) =>
//     translations[language as keyof typeof translations]?.[
//       key as keyof (typeof translations)["en"]
//     ] ||
//     translations.en[key as keyof (typeof translations)["en"]] ||
//     key;

//   // Initialize Google Maps
//   const initializeGoogleMap = async () => {
//     if (!googleMapsApiKey || !mapContainerRef.current || !currentLocation)
//       return;

//     try {
//       await loadGoogleMapsScript(googleMapsApiKey);

//       const map = new google.maps.Map(mapContainerRef.current, {
//         center: { lat: currentLocation.lat, lng: currentLocation.lng },
//         zoom: 15,
//         styles: [
//           // Custom styling for better visibility
//           {
//             featureType: "poi.business",
//             stylers: [{ visibility: "off" }],
//           },
//           {
//             featureType: "transit",
//             elementType: "labels.icon",
//             stylers: [{ visibility: "off" }],
//           },
//         ],
//       });

//       googleMapRef.current = map;

//       // Clear existing markers
//       markersRef.current.forEach((marker) => marker.setMap(null));
//       markersRef.current = [];

//       // Add markers for all locations
//       nearbyLocations.forEach((location) => {
//         const marker = new google.maps.Marker({
//           position: { lat: location.position.lat, lng: location.position.lng },
//           map: map,
//           title: location.name,
//           icon: {
//             url: getMarkerIcon(location.type, location.safetyLevel),
//             scaledSize: new google.maps.Size(32, 32),
//           },
//         });

//         const infoWindow = new google.maps.InfoWindow({
//           content: createInfoWindowContent(location),
//         });

//         marker.addListener("click", () => {
//           infoWindow.open(map, marker);
//         });

//         markersRef.current.push(marker);
//       });

//       setMapLoaded(true);
//       console.log("✅ Google Maps initialized successfully");
//     } catch (error) {
//       console.error("❌ Google Maps initialization failed:", error);
//       setMapLoaded(false);
//     }
//   };

//   // Create custom marker icons
//   const getMarkerIcon = (type: string, safetyLevel: string) => {
//     const color =
//       safetyLevel === "safe"
//         ? "#10b981"
//         : safetyLevel === "caution"
//         ? "#f59e0b"
//         : "#ef4444";
//     const emoji =
//       type === "user"
//         ? "📍"
//         : type === "police"
//         ? "👮"
//         : type === "hospital"
//         ? "🏥"
//         : type === "attraction"
//         ? "📷"
//         : "🏢";

//     return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//       <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
//         <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
//           ${emoji}
//         </text>
//       </svg>
//     `)}`;
//   };

//   // Create info window content
//   const createInfoWindowContent = (location: LocationPoint) => {
//     const safetyColor =
//       location.safetyLevel === "safe"
//         ? "#10b981"
//         : location.safetyLevel === "caution"
//         ? "#f59e0b"
//         : "#ef4444";

//     return `
//       <div style="padding: 8px; min-width: 200px;">
//         <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${
//           location.name
//         }</h3>
//         <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${
//           location.category
//         }</p>
//         ${
//           location.distance
//             ? `<p style="margin: 0 0 4px 0; font-size: 12px;">📍 ${location.distance}</p>`
//             : ""
//         }
//         ${
//           location.rating
//             ? `<p style="margin: 0 0 4px 0; font-size: 12px;">⭐ ${location.rating}</p>`
//             : ""
//         }
//         <div style="margin: 8px 0;">
//           <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${safetyColor}; margin-right: 4px;"></span>
//           <span style="font-size: 12px; text-transform: capitalize;">${
//             location.safetyLevel
//           }</span>
//           ${
//             location.crowdLevel
//               ? `<span style="margin-left: 12px; font-size: 12px;">${location.crowdLevel} crowd</span>`
//               : ""
//           }
//         </div>
//         <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
//           location.position.lat
//         },${location.position.lng}', '_blank')"
//                 style="padding: 4px 8px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
//           Get Directions
//         </button>
//       </div>
//     `;
//   };

//   // Toggle between Google Maps and basic map
//   const toggleMapType = () => {
//     setUseGoogleMaps(!useGoogleMaps);
//     if (!useGoogleMaps && googleMapsApiKey) {
//       setTimeout(() => initializeGoogleMap(), 100);
//     }
//   };

//   // Get real GPS location
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     setLocationError(null);

//     console.log("🗺️ SafarSuraksha Map: Requesting GPS location...");

//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by this browser.");
//       setLocationLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         console.log("📍 SafarSuraksha Map: GPS coordinates:", { lat, lng });

//         try {
//           // Get location name from coordinates
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=${language}`,
//             {
//               headers: { "User-Agent": "SafarSuraksha Tourist Safety App" },
//             }
//           );
//           const data = await response.json();

//           let locationName = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
//           if (data && data.address) {
//             const address = data.address;
//             const parts = [];
//             if (address.city || address.town || address.village) {
//               parts.push(address.city || address.town || address.village);
//             }
//             if (address.state) parts.push(address.state);
//             if (address.country) parts.push(address.country);
//             locationName = parts.length > 0 ? parts.join(", ") : locationName;
//           }

//           setCurrentLocation({ lat, lng, name: locationName });
//           setMapCenter({ lat, lng });
//           console.log("✅ SafarSuraksha Map: Location updated:", {
//             lat,
//             lng,
//             name: locationName,
//           });

//           // Fetch nearby places
//           fetchNearbyPlaces(lat, lng);
//         } catch (error) {
//           console.error("❌ SafarSuraksha Map: Geocoding failed:", error);
//           setCurrentLocation({
//             lat,
//             lng,
//             name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
//           });
//           setMapCenter({ lat, lng });
//           fetchNearbyPlaces(lat, lng);
//         }
//         setLocationLoading(false);
//       },
//       (error) => {
//         console.error("❌ SafarSuraksha Map: GPS failed:", error);
//         setLocationError(error.message);
//         // Fallback to Delhi coordinates
//         setCurrentLocation({
//           lat: 28.6139,
//           lng: 77.209,
//           name: "India Gate, New Delhi (Demo Location)",
//         });
//         setMapCenter({ lat: 28.6139, lng: 77.209 });
//         fetchNearbyPlaces(28.6139, 77.209);
//         setLocationLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 300000,
//       }
//     );
//   };

//   // Fetch nearby places from SafarSuraksha backend
//   const fetchNearbyPlaces = async (lat: number, lng: number) => {
//     setLoading(true);
//     try {
//       console.log("🔍 SafarSuraksha Map: Fetching nearby places...");

//       // You can uncomment these when your backend is ready
//       // const responses = await Promise.allSettled([
//       //   fetch(`${API_BASE_URL}/safety/profile?lat=${lat}&lon=${lng}&radius=5`),
//       //   fetch(`${API_BASE_URL}/places/nearby?lat=${lat}&lon=${lng}&radius=5&type=tourist`),
//       //   fetch(`${API_BASE_URL}/emergency/nearby?lat=${lat}&lon=${lng}&radius=10`),
//       // ]);

//       const locations: LocationPoint[] = [];

//       // Add current location
//       locations.push({
//         id: "current",
//         name: currentLocation?.name || "Your Location",
//         type: "user",
//         position: { lat, lng },
//         safetyLevel: "safe",
//         category: "Current Location",
//         isCurrentLocation: true,
//         lastUpdated: new Date().toLocaleTimeString("en-IN"),
//       });

//       // Add mock nearby places (replace with real API data when available)
//       const mockNearbyPlaces = [
//         {
//           id: "place-1",
//           name: "Red Fort",
//           type: "attraction" as const,
//           position: { lat: lat + 0.01, lng: lng - 0.01 },
//           safetyLevel: "safe" as const,
//           crowdLevel: "moderate" as const,
//           category: "Historical Monument",
//           rating: 4.8,
//           distance: calculateDistance(lat, lng, lat + 0.01, lng - 0.01),
//           isCurrentLocation: false,
//         },
//         {
//           id: "place-2",
//           name: "Police Station",
//           type: "police" as const,
//           position: { lat: lat - 0.005, lng: lng + 0.008 },
//           safetyLevel: "safe" as const,
//           category: "Emergency Services",
//           distance: calculateDistance(lat, lng, lat - 0.005, lng + 0.008),
//           isCurrentLocation: false,
//         },
//         {
//           id: "place-3",
//           name: "General Hospital",
//           type: "hospital" as const,
//           position: { lat: lat + 0.008, lng: lng + 0.012 },
//           safetyLevel: "safe" as const,
//           crowdLevel: "low" as const,
//           category: "Medical Facility",
//           distance: calculateDistance(lat, lng, lat + 0.008, lng + 0.012),
//           isCurrentLocation: false,
//         },
//         {
//           id: "place-4",
//           name: "Tourist Information Center",
//           type: "commercial" as const,
//           position: { lat: lat - 0.012, lng: lng - 0.008 },
//           safetyLevel: "safe" as const,
//           crowdLevel: "low" as const,
//           category: "Information",
//           distance: calculateDistance(lat, lng, lat - 0.012, lng - 0.008),
//           isCurrentLocation: false,
//         },
//       ];

//       locations.push(...mockNearbyPlaces);
//       setNearbyLocations(locations);
//       console.log(
//         "✅ SafarSuraksha Map: Nearby places loaded:",
//         locations.length
//       );
//     } catch (error) {
//       console.error(
//         "❌ SafarSuraksha Map: Failed to fetch nearby places:",
//         error
//       );
//     }
//     setLoading(false);
//   };

//   // Calculate distance between two points
//   const calculateDistance = (
//     lat1: number,
//     lng1: number,
//     lat2: number,
//     lng2: number
//   ): string => {
//     const R = 6371; // Earth's radius in km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLng = ((lng2 - lng1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLng / 2) *
//         Math.sin(dLng / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const d = R * c;
//     return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
//   };

//   // Initialize location on component mount
//   useEffect(() => {
//     getCurrentLocation();

//     // Auto-refresh location every 5 minutes
//     const interval = setInterval(() => {
//       console.log("🔄 SafarSuraksha Map: Auto-refreshing location...");
//       getCurrentLocation();
//     }, 5 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // Initialize Google Maps when switching to it
//   useEffect(() => {
//     if (
//       useGoogleMaps &&
//       googleMapsApiKey &&
//       currentLocation &&
//       nearbyLocations.length > 0
//     ) {
//       initializeGoogleMap();
//     }
//   }, [useGoogleMaps, currentLocation, nearbyLocations, googleMapsApiKey]);

//   const getSafetyColor = (level: string) => {
//     switch (level) {
//       case "safe":
//         return "bg-green-500";
//       case "caution":
//         return "bg-yellow-500";
//       case "danger":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getCrowdColor = (level: string) => {
//     switch (level) {
//       case "low":
//         return "text-green-600";
//       case "moderate":
//         return "text-yellow-600";
//       case "high":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getLocationIcon = (type: string) => {
//     switch (type) {
//       case "user":
//         return <Crosshair className="h-4 w-4" />;
//       case "attraction":
//         return <Camera className="h-4 w-4" />;
//       case "emergency":
//         return <Phone className="h-4 w-4" />;
//       case "police":
//         return <Shield className="h-4 w-4" />;
//       case "hospital":
//         return <Plus className="h-4 w-4" />;
//       case "commercial":
//         return <Building className="h-4 w-4" />;
//       default:
//         return <MapPin className="h-4 w-4" />;
//     }
//   };

//   const convertToMapPosition = (lat: number, lng: number) => {
//     if (!currentLocation) return { x: 50, y: 50 };

//     // Convert lat/lng to map pixels (simplified conversion)
//     const latRange = 0.05; // ~5km range
//     const lngRange = 0.05;

//     const x = ((lng - (currentLocation.lng - lngRange / 2)) / lngRange) * 100;
//     const y = ((currentLocation.lat + latRange / 2 - lat) / latRange) * 100;

//     // Clamp to map boundaries
//     return {
//       x: Math.max(5, Math.min(95, x)),
//       y: Math.max(5, Math.min(95, y)),
//     };
//   };

//   const filteredLocations = nearbyLocations.filter((location) => {
//     if (selectedFilter === "all") return true;
//     return location.type === selectedFilter;
//   });

//   const mapFilters = [
//     { key: "all", label: "All", icon: <Layers className="h-4 w-4" /> },
//     {
//       key: "attraction",
//       label: "Attractions",
//       icon: <Camera className="h-4 w-4" />,
//     },
//     {
//       key: "emergency",
//       label: "Emergency",
//       icon: <Phone className="h-4 w-4" />,
//     },
//     { key: "police", label: "Police", icon: <Shield className="h-4 w-4" /> },
//     { key: "hospital", label: "Medical", icon: <Plus className="h-4 w-4" /> },
//     {
//       key: "commercial",
//       label: "Services",
//       icon: <Building className="h-4 w-4" />,
//     },
//   ];

//   const openDirections = (location: LocationPoint) => {
//     const url = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
//     window.open(url, "_blank");
//   };

//   return (
//     <div className="space-y-4">
//       {/* Map Header with Real Location */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <div className="flex items-center">
//               <MapPin className="h-5 w-5 mr-2 text-orange-500" />
//               {t("interactiveMap")}
//             </div>
//             <div className="flex items-center space-x-2">
//               {locationLoading && (
//                 <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//               )}
//               <Badge
//                 variant={
//                   locationLoading
//                     ? "secondary"
//                     : currentLocation
//                     ? "default"
//                     : "destructive"
//                 }
//               >
//                 <Globe className="h-3 w-3 mr-1" />
//                 {locationLoading
//                   ? t("gettingLocation")
//                   : currentLocation
//                   ? t("locationFound")
//                   : "Location Error"}
//               </Badge>
//             </div>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {/* Current Location Display */}
//           {currentLocation && (
//             <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h4 className="font-semibold text-blue-800 dark:text-blue-300">
//                     📍 {t("yourLocation")}
//                   </h4>
//                   <p className="text-sm text-blue-700 dark:text-blue-400">
//                     {currentLocation.name}
//                   </p>
//                   <p className="text-xs text-blue-600 dark:text-blue-500">
//                     {t("coordinates")}: {currentLocation.lat.toFixed(6)}°,{" "}
//                     {currentLocation.lng.toFixed(6)}°
//                   </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   {googleMapsApiKey && (
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={toggleMapType}
//                       className="text-xs"
//                     >
//                       <Globe className="h-3 w-3 mr-1" />
//                       {useGoogleMaps
//                         ? t("switchToBasicMap")
//                         : t("switchToGoogleMaps")}
//                     </Button>
//                   )}
//                   <Button
//                     size="sm"
//                     onClick={getCurrentLocation}
//                     disabled={locationLoading}
//                     className="bg-blue-600 hover:bg-blue-700"
//                   >
//                     <RefreshCw
//                       className={`h-4 w-4 mr-1 ${
//                         locationLoading ? "animate-spin" : ""
//                       }`}
//                     />
//                     {t("refreshLocation")}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Search and Filters */}
//           <div className="flex flex-col space-y-4 mb-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder={t("searchPlaces")}
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <div className="flex space-x-2 overflow-x-auto">
//               {mapFilters.map((filter) => (
//                 <Button
//                   key={filter.key}
//                   variant={
//                     selectedFilter === filter.key ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() => setSelectedFilter(filter.key)}
//                   className="flex items-center space-x-1 whitespace-nowrap"
//                 >
//                   {filter.icon}
//                   <span>{filter.label}</span>
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Interactive Map Container */}
//           <div className="relative">
//             <div
//               ref={mapContainerRef}
//               className="w-full h-96 rounded-lg border-2 border-border relative overflow-hidden"
//             >
//               {useGoogleMaps && googleMapsApiKey ? (
//                 // Google Maps will be rendered here
//                 <div className="w-full h-full">
//                   {!mapLoaded && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
//                       <div className="text-center">
//                         <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
//                         <p className="text-sm text-muted-foreground">
//                           Loading Google Maps...
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 // Basic custom map fallback
//                 <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-yellow-900/20">
//                   {/* Grid Lines for Map Effect */}
//                   <svg className="absolute inset-0 w-full h-full opacity-20">
//                     <defs>
//                       <pattern
//                         id="grid"
//                         width="20"
//                         height="20"
//                         patternUnits="userSpaceOnUse"
//                       >
//                         <path
//                           d="M 20 0 L 0 0 0 20"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="0.5"
//                         />
//                       </pattern>
//                     </defs>
//                     <rect width="100%" height="100%" fill="url(#grid)" />
//                   </svg>

//                   {/* Roads */}
//                   <div className="absolute inset-0">
//                     <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2"></div>
//                     <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2"></div>
//                     <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gray-300 transform rotate-45"></div>
//                     <div className="absolute bottom-1/4 left-1/4 right-1/4 h-0.5 bg-gray-300 transform -rotate-45"></div>
//                   </div>

//                   {/* Real Location Points */}
//                   {filteredLocations.map((location) => {
//                     const mapPos = convertToMapPosition(
//                       location.position.lat,
//                       location.position.lng
//                     );
//                     return (
//                       <div
//                         key={location.id}
//                         className="absolute group cursor-pointer z-10"
//                         style={{
//                           left: `${mapPos.x}%`,
//                           top: `${mapPos.y}%`,
//                           transform: "translate(-50%, -50%)",
//                         }}
//                       >
//                         <div
//                           className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${
//                             location.isCurrentLocation
//                               ? "bg-blue-600 animate-pulse ring-4 ring-blue-300"
//                               : location.type === "emergency" ||
//                                 location.type === "police"
//                               ? "bg-red-600"
//                               : location.type === "hospital"
//                               ? "bg-green-600"
//                               : location.type === "attraction"
//                               ? "bg-purple-600"
//                               : "bg-orange-600"
//                           }`}
//                         >
//                           {getLocationIcon(location.type)}
//                         </div>

//                         {/* Enhanced Hover Card with Real Data */}
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-card border rounded-lg shadow-lg p-3 whitespace-nowrap z-20 min-w-48">
//                           <div className="space-y-2">
//                             <p className="font-semibold text-sm">
//                               {location.name}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               {location.category}
//                             </p>

//                             {location.distance && (
//                               <div className="flex items-center space-x-2 text-xs">
//                                 <Route className="h-3 w-3 text-blue-500" />
//                                 <span>{location.distance}</span>
//                               </div>
//                             )}

//                             {location.rating && (
//                               <div className="flex items-center space-x-1 text-xs">
//                                 <Star className="h-3 w-3 text-yellow-500 fill-current" />
//                                 <span>{location.rating}</span>
//                               </div>
//                             )}

//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center space-x-2">
//                                 <div
//                                   className={`w-2 h-2 rounded-full ${getSafetyColor(
//                                     location.safetyLevel
//                                   )}`}
//                                 ></div>
//                                 <span className="text-xs capitalize">
//                                   {t(location.safetyLevel)}
//                                 </span>
//                               </div>

//                               {location.crowdLevel && (
//                                 <span
//                                   className={`text-xs ${getCrowdColor(
//                                     location.crowdLevel
//                                   )}`}
//                                 >
//                                   {t(location.crowdLevel)}
//                                 </span>
//                               )}
//                             </div>

//                             {location.lastUpdated && (
//                               <p className="text-xs text-muted-foreground">
//                                 Updated: {location.lastUpdated}
//                               </p>
//                             )}

//                             <Button
//                               size="sm"
//                               onClick={() => openDirections(location)}
//                               className="w-full mt-2"
//                             >
//                               <NavigationIcon className="h-3 w-3 mr-1" />
//                               {t("getDirections")}
//                             </Button>
//                           </div>
//                           <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-card"></div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                   {/* Safety Zones */}
//                   <div className="absolute top-16 left-16 w-24 h-24 bg-green-200/30 border-2 border-green-400 border-dashed rounded-full flex items-center justify-center">
//                     <Badge className="bg-green-100 text-green-800 text-xs">
//                       {t("safeZone")}
//                     </Badge>
//                   </div>

//                   <div className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-200/30 border-2 border-yellow-400 border-dashed rounded-full flex items-center justify-center">
//                     <Badge className="bg-yellow-100 text-yellow-800 text-xs">
//                       {t("caution")}
//                     </Badge>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Map Controls */}
//             <div className="absolute top-4 right-4 flex flex-col space-y-2">
//               <Button
//                 size="icon"
//                 variant="outline"
//                 className="bg-white/80 backdrop-blur"
//               >
//                 <Plus className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="icon"
//                 variant="outline"
//                 className="bg-white/80 backdrop-blur"
//               >
//                 <Minus className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="icon"
//                 variant="outline"
//                 className="bg-white/80 backdrop-blur"
//                 onClick={getCurrentLocation}
//                 disabled={locationLoading}
//               >
//                 <Locate
//                   className={`h-4 w-4 ${locationLoading ? "animate-spin" : ""}`}
//                 />
//               </Button>
//             </div>

//             {/* Live Update Indicator */}
//             <div className="absolute bottom-4 left-4">
//               <Badge className="bg-blue-100 text-blue-800 border-blue-200">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
//                 SafarSuraksha {t("liveUpdate")}{" "}
//                 {useGoogleMaps && googleMapsApiKey && "• Google Maps"}
//               </Badge>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Map Legend */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               <span className="text-sm">{t("safe")}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//               <span className="text-sm">{t("caution")}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
//               <span className="text-sm">{t("yourLocation")}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-red-600 rounded-full"></div>
//               <span className="text-sm">{t("emergencyServices")}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Real-time Nearby Places */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <span>{t("nearbyPlaces")}</span>
//             <div className="flex items-center space-x-2">
//               {loading && <Loader2 className="h-3 w-3 animate-spin" />}
//               <Badge variant="secondary">
//                 <Clock className="h-3 w-3 mr-1" />
//                 {t("lastUpdated")} {currentLocation ? "1" : "5"}{" "}
//                 {t("minutesAgo")}
//               </Badge>
//             </div>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//             {nearbyLocations
//               .filter((l) => !l.isCurrentLocation)
//               .map((location) => (
//                 <div
//                   key={location.id}
//                   className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
//                 >
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
//                       location.type === "emergency" ||
//                       location.type === "police"
//                         ? "bg-red-600"
//                         : location.type === "hospital"
//                         ? "bg-green-600"
//                         : location.type === "attraction"
//                         ? "bg-purple-600"
//                         : "bg-orange-600"
//                     }`}
//                   >
//                     {getLocationIcon(location.type)}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-sm">{location.name}</p>
//                     <div className="flex items-center space-x-2 text-xs text-muted-foreground">
//                       <span>{location.distance}</span>
//                       <div
//                         className={`w-2 h-2 rounded-full ${getSafetyColor(
//                           location.safetyLevel
//                         )}`}
//                       ></div>
//                       <span
//                         className={
//                           location.crowdLevel
//                             ? getCrowdColor(location.crowdLevel)
//                             : "text-gray-500"
//                         }
//                       >
//                         {location.crowdLevel
//                           ? `${t(location.crowdLevel)} crowd`
//                           : "No data"}
//                       </span>
//                     </div>
//                   </div>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => openDirections(location)}
//                   >
//                     <Navigation className="h-3 w-3 mr-1" />
//                     {t("getDirections")}
//                   </Button>
//                 </div>
//               ))}
//           </div>

//           {nearbyLocations.length === 0 && !loading && (
//             <div className="text-center py-8 text-muted-foreground">
//               <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p>
//                 No places found nearby.{" "}
//                 {locationError
//                   ? t("enableLocation")
//                   : "Try refreshing your location."}
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// ------------- claude2.0 half
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  MapPin,
  Navigation,
  Shield,
  Camera,
  Phone,
  Plus,
  Minus,
  Locate,
  Star,
  Clock,
  Route,
  Search,
  Layers,
  Building,
  Loader2,
  RefreshCw,
  Globe,
  NavigationIcon,
  Crosshair,
} from "lucide-react";

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
  }

  interface MapOptions {
    center: LatLng | LatLngLiteral;
    zoom: number;
    styles?: MapTypeStyle[];
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(eventName: string, handler: () => void): void;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
  }

  interface Icon {
    url: string;
    scaledSize?: Size;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map: Map, anchor?: Marker): void;
    setPosition(position: LatLng | LatLngLiteral): void;
  }

  interface InfoWindowOptions {
    content?: string;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ [key: string]: any }>;
  }

  class Circle {
    constructor(opts?: CircleOptions);
    setMap(map: Map | null): void;
    addListener(eventName: string, handler: () => void): void;
  }

  interface CircleOptions {
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    map?: Map;
    center?: LatLng | LatLngLiteral;
    radius?: number;
  }
}

interface TouristMapProps {
  language?: string;
  googleMapsApiKey?: string;
}

interface LocationPoint {
  id: string;
  name: string;
  type:
    | "user"
    | "attraction"
    | "emergency"
    | "commercial"
    | "police"
    | "hospital";
  position: { lat: number; lng: number };
  safetyLevel: "safe" | "caution" | "danger";
  crowdLevel?: "low" | "moderate" | "high";
  category: string;
  rating?: number;
  distance?: string;
  isCurrentLocation: boolean;
  lastUpdated?: string;
}

const API_BASE_URL = "http://localhost:3000/api";

// Google Maps loader utility
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Maps script failed to load"));

    document.head.appendChild(script);
  });
};

export function TouristMap({
  language = "en",
  googleMapsApiKey,
}: TouristMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [nearbyLocations, setNearbyLocations] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [dangerZones, setDangerZones] = useState<
    Array<{
      id: string;
      name: string;
      center: { lat: number; lng: number };
      radius: number;
      riskLevel: "high" | "critical";
      description: string;
    }>
  >([]);
  const [isInDangerZone, setIsInDangerZone] = useState<{
    inZone: boolean;
    zoneName: string;
    riskLevel: string;
  } | null>(null);

  // Refs for map container
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const dangerCirclesRef = useRef<google.maps.Circle[]>([]);

  const translations = {
    en: {
      interactiveMap: "SafarSuraksha Live Map",
      safeZone: "Safe Zone",
      restricted: "Restricted",
      yourLocation: "Your Location",
      attractions: "Attractions",
      moderateCrowd: "Moderate Crowd",
      aiMonitoring: "AI Monitoring",
      getDirections: "Get Directions",
      safe: "Safe",
      caution: "Caution",
      danger: "Danger",
      high: "High",
      moderate: "Moderate",
      low: "Low",
      searchPlaces: "Search places near you...",
      mapLayers: "Map Layers",
      traffic: "Traffic",
      transit: "Transit",
      satellite: "Satellite",
      terrain: "Terrain",
      myLocation: "My Location",
      nearbyPlaces: "Nearby SafarSuraksha Places",
      safetyLevel: "Safety Level",
      crowdLevel: "Crowd Level",
      lastUpdated: "Last updated",
      minutesAgo: "minutes ago",
      liveUpdate: "Live Update",
      emergencyServices: "Emergency Services",
      policeStation: "Police Station",
      hospital: "Hospital",
      touristInfo: "Tourist Information",
      gettingLocation: "Getting your location...",
      locationFound: "Location found",
      enableLocation: "Enable Location",
      refreshLocation: "Refresh Location",
      coordinates: "Coordinates",
      switchToGoogleMaps: "Switch to Google Maps",
      switchToBasicMap: "Switch to Basic Map",
      dangerZones: "Danger Zones",
      highRiskArea: "High Risk Area",
      dangerAlert: "Warning! You are near a dangerous area",
      avoidArea: "Please avoid this area",
      stayAlert: "Stay alert and safe",
    },
    hi: {
      interactiveMap: "सफरसुरक्षा लाइव मैप",
      safeZone: "सुरक्षित क्षेत्र",
      restricted: "प्रतिबंधित",
      yourLocation: "आपका स्थान",
      attractions: "आकर्षण",
      moderateCrowd: "मध्यम भीड़",
      aiMonitoring: "AI निगरानी",
      getDirections: "दिशा-निर्देश",
      safe: "सुरक्षित",
      caution: "सावधानी",
      danger: "खतरा",
      high: "उच्च",
      moderate: "मध्यम",
      low: "कम",
      searchPlaces: "अपने आस-पास स्थान खोजें...",
      mapLayers: "मैप लेयर्स",
      traffic: "ट्रैफिक",
      transit: "ट्रांजिट",
      satellite: "सैटेलाइट",
      terrain: "भूभाग",
      myLocation: "मेरा स्थान",
      nearbyPlaces: "आस-पास के सफरसुरक्षा स्थान",
      safetyLevel: "सुरक्षा स्तर",
      crowdLevel: "भीड़ का स्तर",
      lastUpdated: "अंतिम अपडेट",
      minutesAgo: "मिनट पहले",
      liveUpdate: "लाइव अपडेट",
      emergencyServices: "आपातकालीन सेवाएं",
      policeStation: "पुलिस स्टेशन",
      hospital: "अस्पताल",
      touristInfo: "पर्यटक जानकारी",
      gettingLocation: "आपका स्थान ढूंढा जा रहा है...",
      locationFound: "स्थान मिल गया",
      enableLocation: "स्थान सक्षम करें",
      refreshLocation: "स्थान रीफ्रेश करें",
      coordinates: "निर्देशांक",
      switchToGoogleMaps: "गूगल मैप्स पर स्विच करें",
      switchToBasicMap: "बेसिक मैप पर स्विच करें",
      dangerZones: "खतरनाक क्षेत्र",
      highRiskArea: "उच्च जोखिम क्षेत्र",
      dangerAlert: "सावधान! आप एक खतरनाक क्षेत्र के पास हैं",
      avoidArea: "इस क्षेत्र से बचें",
      stayAlert: "सतर्क रहें",
    },
  };

  const t = (key: string) =>
    translations[language as keyof typeof translations]?.[
      key as keyof (typeof translations)["en"]
    ] ||
    translations.en[key as keyof (typeof translations)["en"]] ||
    key;

  // Initialize danger zones (mock data - replace with real API)
  const initializeDangerZones = () => {
    if (!currentLocation) return;

    const zones = [
      {
        id: "danger-1",
        name: "Old Delhi Railway Station Area",
        center: {
          lat: currentLocation.lat + 0.015,
          lng: currentLocation.lng - 0.02,
        },
        radius: 500, // 500 meters
        riskLevel: "high" as const,
        description: "High crime rate area, avoid after dark",
      },
      // current location let's say landran cgc college is in danger
      {
        id: "danger-2",
        name: "Construction Zone",
        center: {
          // lat: currentLocation.lat - 0.025,
          // lng: currentLocation.lng + 0.018
          lat: currentLocation.lat + 0.0,
          lng: currentLocation.lng - 0.0,
        },
        radius: 300,
        riskLevel: "critical" as const,
        description: "Unsafe construction area with falling debris risk",
      },
    ];

    setDangerZones(zones);
  };

  // Check if user is in danger zone
  const checkDangerZone = (userLat: number, userLng: number) => {
    for (const zone of dangerZones) {
      const distance = calculateDistanceInMeters(
        userLat,
        userLng,
        zone.center.lat,
        zone.center.lng
      );

      if (distance <= zone.radius) {
        setIsInDangerZone({
          inZone: true,
          zoneName: zone.name,
          riskLevel: zone.riskLevel,
        });
        return;
      }
    }
    setIsInDangerZone(null);
  };

  // Calculate distance in meters
  const calculateDistanceInMeters = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Initialize Google Maps
  const initializeGoogleMap = async () => {
    if (!googleMapsApiKey || !mapContainerRef.current || !currentLocation)
      return;

    try {
      await loadGoogleMapsScript(googleMapsApiKey);

      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        zoom: 15,
        styles: [
          // Custom styling for better visibility
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      googleMapRef.current = map;

      // Clear existing markers and circles
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      dangerCirclesRef.current.forEach((circle) => circle.setMap(null));
      dangerCirclesRef.current = [];

      // Add danger zones as red circles
      dangerZones.forEach((zone) => {
        const circle = new google.maps.Circle({
          strokeColor: zone.riskLevel === "critical" ? "#DC2626" : "#EF4444",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: zone.riskLevel === "critical" ? "#DC2626" : "#EF4444",
          fillOpacity: 0.25,
          map: map,
          center: zone.center,
          radius: zone.radius,
        });

        dangerCirclesRef.current.push(circle);

        // Add info window for danger zone
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #DC2626;">
                ⚠️ ${zone.name}
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                ${zone.description}
              </p>
              <div style="margin: 8px 0;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #DC2626; margin-right: 4px;"></span>
                <span style="font-size: 12px; color: #DC2626; text-transform: uppercase; font-weight: bold;">
                  ${zone.riskLevel} Risk
                </span>
              </div>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #DC2626; font-weight: bold;">
                🚨 Avoid this area for your safety
              </p>
            </div>
          `,
        });

        circle.addListener("click", () => {
          infoWindow.setPosition(zone.center);
          infoWindow.open(map);
        });
      });

      // Add markers for all locations
      nearbyLocations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.position.lat, lng: location.position.lng },
          map: map,
          title: location.name,
          icon: {
            url: getMarkerIcon(location.type, location.safetyLevel),
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(location),
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });

      setMapLoaded(true);
      console.log("✅ Google Maps initialized successfully");
    } catch (error) {
      console.error("❌ Google Maps initialization failed:", error);
      setMapLoaded(false);
    }
  };

  // Create custom marker icons
  const getMarkerIcon = (type: string, safetyLevel: string) => {
    const color =
      safetyLevel === "safe"
        ? "#10b981"
        : safetyLevel === "caution"
        ? "#f59e0b"
        : "#ef4444";
    const emoji =
      type === "user"
        ? "📍"
        : type === "police"
        ? "👮"
        : type === "hospital"
        ? "🏥"
        : type === "attraction"
        ? "📷"
        : "🏢";

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
          ${emoji}
        </text>
      </svg>
    `)}`;
  };

  // Create info window content
  const createInfoWindowContent = (location: LocationPoint) => {
    const safetyColor =
      location.safetyLevel === "safe"
        ? "#10b981"
        : location.safetyLevel === "caution"
        ? "#f59e0b"
        : "#ef4444";

    return `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${
          location.name
        }</h3>
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${
          location.category
        }</p>
        ${
          location.distance
            ? `<p style="margin: 0 0 4px 0; font-size: 12px;">📍 ${location.distance}</p>`
            : ""
        }
        ${
          location.rating
            ? `<p style="margin: 0 0 4px 0; font-size: 12px;">⭐ ${location.rating}</p>`
            : ""
        }
        <div style="margin: 8px 0;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${safetyColor}; margin-right: 4px;"></span>
          <span style="font-size: 12px; text-transform: capitalize;">${
            location.safetyLevel
          }</span>
          ${
            location.crowdLevel
              ? `<span style="margin-left: 12px; font-size: 12px;">${location.crowdLevel} crowd</span>`
              : ""
          }
        </div>
        <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
          location.position.lat
        },${location.position.lng}', '_blank')" 
                style="padding: 4px 8px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          Get Directions
        </button>
      </div>
    `;
  };

  // Toggle between Google Maps and basic map
  const toggleMapType = () => {
    setUseGoogleMaps(!useGoogleMaps);
    if (!useGoogleMaps && googleMapsApiKey) {
      setTimeout(() => initializeGoogleMap(), 100);
    }
  };

  // Get real GPS location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    console.log("🗺️ SafarSuraksha Map: Requesting GPS location...");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("📍 SafarSuraksha Map: GPS coordinates:", { lat, lng });

        try {
          // Get location name from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=${language}`,
            {
              headers: { "User-Agent": "SafarSuraksha Tourist Safety App" },
            }
          );
          const data = await response.json();

          let locationName = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          if (data && data.address) {
            const address = data.address;
            const parts = [];
            if (address.city || address.town || address.village) {
              parts.push(address.city || address.town || address.village);
            }
            if (address.state) parts.push(address.state);
            if (address.country) parts.push(address.country);
            locationName = parts.length > 0 ? parts.join(", ") : locationName;
          }

          setCurrentLocation({ lat, lng, name: locationName });
          setMapCenter({ lat, lng });
          console.log("✅ SafarSuraksha Map: Location updated:", {
            lat,
            lng,
            name: locationName,
          });

          // Initialize danger zones
          if (dangerZones.length === 0) {
            initializeDangerZones();
          }

          // Check if user is in danger zone
          checkDangerZone(lat, lng);

          // Fetch nearby places
          fetchNearbyPlaces(lat, lng);
        } catch (error) {
          console.error("❌ SafarSuraksha Map: Geocoding failed:", error);
          setCurrentLocation({
            lat,
            lng,
            name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          });
          setMapCenter({ lat, lng });

          // Initialize danger zones and check location
          if (dangerZones.length === 0) {
            initializeDangerZones();
          }
          checkDangerZone(lat, lng);

          fetchNearbyPlaces(lat, lng);
        }
        setLocationLoading(false);
      },
      (error) => {
        console.error("❌ SafarSuraksha Map: GPS failed:", error);
        setLocationError(error.message);
        // Fallback to Delhi coordinates
        const fallbackLat = 28.6139;
        const fallbackLng = 77.209;
        setCurrentLocation({
          lat: fallbackLat,
          lng: fallbackLng,
          name: "India Gate, New Delhi (Demo Location)",
        });
        setMapCenter({ lat: fallbackLat, lng: fallbackLng });

        // Initialize danger zones even for fallback location
        setTimeout(() => {
          initializeDangerZones();
          checkDangerZone(fallbackLat, fallbackLng);
        }, 100);

        fetchNearbyPlaces(fallbackLat, fallbackLng);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  // Fetch nearby places from SafarSuraksha backend
  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      console.log("📍 SafarSuraksha Map: Fetching nearby places...");

      // You can uncomment these when your backend is ready
      // const responses = await Promise.allSettled([
      //   fetch(`${API_BASE_URL}/safety/profile?lat=${lat}&lon=${lng}&radius=5`),
      //   fetch(`${API_BASE_URL}/places/nearby?lat=${lat}&lon=${lng}&radius=5&type=tourist`),
      //   fetch(`${API_BASE_URL}/emergency/nearby?lat=${lat}&lon=${lng}&radius=10`),
      // ]);

      const locations: LocationPoint[] = [];

      // Add current location
      locations.push({
        id: "current",
        name: currentLocation?.name || "Your Location",
        type: "user",
        position: { lat, lng },
        safetyLevel: "safe",
        category: "Current Location",
        isCurrentLocation: true,
        lastUpdated: new Date().toLocaleTimeString("en-IN"),
      });

      // Add mock nearby places (replace with real API data when available)
      const mockNearbyPlaces = [
        {
          id: "place-1",
          name: "Red Fort",
          type: "attraction" as const,
          position: { lat: lat + 0.01, lng: lng - 0.01 },
          safetyLevel: "safe" as const,
          crowdLevel: "moderate" as const,
          category: "Historical Monument",
          rating: 4.8,
          distance: calculateDistance(lat, lng, lat + 0.01, lng - 0.01),
          isCurrentLocation: false,
        },
        {
          id: "place-2",
          name: "Police Station",
          type: "police" as const,
          position: { lat: lat - 0.005, lng: lng + 0.008 },
          safetyLevel: "safe" as const,
          category: "Emergency Services",
          distance: calculateDistance(lat, lng, lat - 0.005, lng + 0.008),
          isCurrentLocation: false,
        },
        {
          id: "place-3",
          name: "General Hospital",
          type: "hospital" as const,
          position: { lat: lat + 0.008, lng: lng + 0.012 },
          safetyLevel: "safe" as const,
          crowdLevel: "low" as const,
          category: "Medical Facility",
          distance: calculateDistance(lat, lng, lat + 0.008, lng + 0.012),
          isCurrentLocation: false,
        },
        {
          id: "place-4",
          name: "Tourist Information Center",
          type: "commercial" as const,
          position: { lat: lat - 0.012, lng: lng - 0.008 },
          safetyLevel: "safe" as const,
          crowdLevel: "low" as const,
          category: "Information",
          distance: calculateDistance(lat, lng, lat - 0.012, lng - 0.008),
          isCurrentLocation: false,
        },
      ];

      locations.push(...mockNearbyPlaces);
      setNearbyLocations(locations);
      console.log(
        "✅ SafarSuraksha Map: Nearby places loaded:",
        locations.length
      );
    } catch (error) {
      console.error(
        "❌ SafarSuraksha Map: Failed to fetch nearby places:",
        error
      );
    }
    setLoading(false);
  };

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): string => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

  // Initialize location on component mount
  useEffect(() => {
    getCurrentLocation();

    // Auto-refresh location every 5 minutes
    const interval = setInterval(() => {
      console.log("🔄 SafarSuraksha Map: Auto-refreshing location...");
      getCurrentLocation();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize danger zones when currentLocation is set
  useEffect(() => {
    if (currentLocation && dangerZones.length === 0) {
      initializeDangerZones();
    }
  }, [currentLocation]);

  // Check danger zones when location or zones change
  useEffect(() => {
    if (currentLocation && dangerZones.length > 0) {
      checkDangerZone(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation, dangerZones]);

  // Initialize Google Maps when switching to it
  useEffect(() => {
    if (
      useGoogleMaps &&
      googleMapsApiKey &&
      currentLocation &&
      nearbyLocations.length > 0
    ) {
      initializeGoogleMap();
    }
  }, [useGoogleMaps, currentLocation, nearbyLocations, googleMapsApiKey]);

  const getSafetyColor = (level: string) => {
    switch (level) {
      case "safe":
        return "bg-green-500";
      case "caution":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "moderate":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Crosshair className="h-4 w-4" />;
      case "attraction":
        return <Camera className="h-4 w-4" />;
      case "emergency":
        return <Phone className="h-4 w-4" />;
      case "police":
        return <Shield className="h-4 w-4" />;
      case "hospital":
        return <Plus className="h-4 w-4" />;
      case "commercial":
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const convertToMapPosition = (lat: number, lng: number) => {
    if (!currentLocation) return { x: 50, y: 50 };

    // Convert lat/lng to map pixels (simplified conversion)
    const latRange = 0.05; // ~5km range
    const lngRange = 0.05;

    const x = ((lng - (currentLocation.lng - lngRange / 2)) / lngRange) * 100;
    const y = ((currentLocation.lat + latRange / 2 - lat) / latRange) * 100;

    // Clamp to map boundaries
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const filteredLocations = nearbyLocations.filter((location) => {
    if (selectedFilter === "all") return true;
    return location.type === selectedFilter;
  });

  const mapFilters = [
    { key: "all", label: "All", icon: <Layers className="h-4 w-4" /> },
    {
      key: "attraction",
      label: "Attractions",
      icon: <Camera className="h-4 w-4" />,
    },
    {
      key: "emergency",
      label: "Emergency",
      icon: <Phone className="h-4 w-4" />,
    },
    { key: "police", label: "Police", icon: <Shield className="h-4 w-4" /> },
    { key: "hospital", label: "Medical", icon: <Plus className="h-4 w-4" /> },
    {
      key: "commercial",
      label: "Services",
      icon: <Building className="h-4 w-4" />,
    },
  ];

  const openDirections = (location: LocationPoint) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Danger Zone Alert */}
      {isInDangerZone && (
        <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-red-800 dark:text-red-300 text-lg">
                    🚨 {t("dangerAlert")}
                  </h3>
                  <Badge className="bg-red-700 text-white animate-pulse">
                    {isInDangerZone.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
                  📍 Zone: {isInDangerZone.zoneName}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Badge className="bg-red-100 text-red-800 border border-red-300">
                    ⚠️ {t("avoidArea")}
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                    🛡️ {t("stayAlert")}
                  </Badge>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      if (currentLocation) {
                        const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}`;
                        window.open(url, "_blank");
                      }
                    }}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navigate Away
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => setIsInDangerZone(null)}
                  >
                    Dismiss Alert
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Header with Real Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-orange-500" />
              {t("interactiveMap")}
            </div>
            <div className="flex items-center space-x-2">
              {locationLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              )}
              <Badge
                variant={
                  locationLoading
                    ? "secondary"
                    : currentLocation
                    ? "default"
                    : "destructive"
                }
              >
                <Globe className="h-3 w-3 mr-1" />
                {locationLoading
                  ? t("gettingLocation")
                  : currentLocation
                  ? t("locationFound")
                  : "Location Error"}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Location Display */}
          {currentLocation && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                    📍 {t("yourLocation")}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {currentLocation.name}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-500">
                    {t("coordinates")}: {currentLocation.lat.toFixed(6)}°,{" "}
                    {currentLocation.lng.toFixed(6)}°
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {googleMapsApiKey && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleMapType}
                      className="text-xs"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {useGoogleMaps
                        ? t("switchToBasicMap")
                        : t("switchToGoogleMaps")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-1 ${
                        locationLoading ? "animate-spin" : ""
                      }`}
                    />
                    {t("refreshLocation")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col space-y-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaces")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              {mapFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={
                    selectedFilter === filter.key ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedFilter(filter.key)}
                  className="flex items-center space-x-1 whitespace-nowrap"
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Interactive Map Container */}
          <div className="relative">
            <div
              ref={mapContainerRef}
              className="w-full h-96 rounded-lg border-2 border-border relative overflow-hidden"
            >
              {useGoogleMaps && googleMapsApiKey ? (
                // Google Maps will be rendered here
                <div className="w-full h-full">
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Loading Google Maps...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Basic custom map fallback
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-yellow-900/20">
                  {/* Grid Lines for Map Effect */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern
                        id="grid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Roads */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2"></div>
                    <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gray-300 transform rotate-45"></div>
                    <div className="absolute bottom-1/4 left-1/4 right-1/4 h-0.5 bg-gray-300 transform -rotate-45"></div>
                  </div>

                  {/* Real Location Points */}
                  {filteredLocations.map((location) => {
                    const mapPos = convertToMapPosition(
                      location.position.lat,
                      location.position.lng
                    );
                    return (
                      <div
                        key={location.id}
                        className="absolute group cursor-pointer z-10"
                        style={{
                          left: `${mapPos.x}%`,
                          top: `${mapPos.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${
                            location.isCurrentLocation
                              ? "bg-blue-600 animate-pulse ring-4 ring-blue-300"
                              : location.type === "emergency" ||
                                location.type === "police"
                              ? "bg-red-600"
                              : location.type === "hospital"
                              ? "bg-green-600"
                              : location.type === "attraction"
                              ? "bg-purple-600"
                              : "bg-orange-600"
                          }`}
                        >
                          {getLocationIcon(location.type)}
                        </div>

                        {/* Enhanced Hover Card with Real Data */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-card border rounded-lg shadow-lg p-3 whitespace-nowrap z-20 min-w-48">
                          <div className="space-y-2">
                            <p className="font-semibold text-sm">
                              {location.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {location.category}
                            </p>

                            {location.distance && (
                              <div className="flex items-center space-x-2 text-xs">
                                <Route className="h-3 w-3 text-blue-500" />
                                <span>{location.distance}</span>
                              </div>
                            )}

                            {location.rating && (
                              <div className="flex items-center space-x-1 text-xs">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{location.rating}</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${getSafetyColor(
                                    location.safetyLevel
                                  )}`}
                                ></div>
                                <span className="text-xs capitalize">
                                  {t(location.safetyLevel)}
                                </span>
                              </div>

                              {location.crowdLevel && (
                                <span
                                  className={`text-xs ${getCrowdColor(
                                    location.crowdLevel
                                  )}`}
                                >
                                  {t(location.crowdLevel)}
                                </span>
                              )}
                            </div>

                            {location.lastUpdated && (
                              <p className="text-xs text-muted-foreground">
                                Updated: {location.lastUpdated}
                              </p>
                            )}

                            <Button
                              size="sm"
                              onClick={() => openDirections(location)}
                              className="w-full mt-2"
                            >
                              <NavigationIcon className="h-3 w-3 mr-1" />
                              {t("getDirections")}
                            </Button>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-card"></div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Safety Zones and Danger Zones */}
                  <div className="absolute top-16 left-16 w-24 h-24 bg-green-200/30 border-2 border-green-400 border-dashed rounded-full flex items-center justify-center">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {t("safeZone")}
                    </Badge>
                  </div>

                  <div className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-200/30 border-2 border-yellow-400 border-dashed rounded-full flex items-center justify-center">
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      {t("caution")}
                    </Badge>
                  </div>

                  {/* Danger Zones - Red Areas */}
                  {dangerZones.map((zone) => {
                    const dangerMapPos = convertToMapPosition(
                      zone.center.lat,
                      zone.center.lng
                    );
                    const radiusSize = Math.max(
                      32,
                      Math.min(80, (zone.radius / 500) * 64)
                    ); // Scale radius to map
                    return (
                      <div
                        key={zone.id}
                        className="absolute group cursor-pointer"
                        style={{
                          left: `${dangerMapPos.x}%`,
                          top: `${dangerMapPos.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className={`bg-red-500/30 border-2 ${
                            zone.riskLevel === "critical"
                              ? "border-red-700 border-solid animate-pulse"
                              : "border-red-500 border-dashed"
                          } rounded-full flex items-center justify-center`}
                          style={{
                            width: `${radiusSize}px`,
                            height: `${radiusSize}px`,
                          }}
                        >
                          <Badge
                            className={`${
                              zone.riskLevel === "critical"
                                ? "bg-red-700 text-white"
                                : "bg-red-100 text-red-800"
                            } text-xs font-bold`}
                          >
                            ⚠️
                          </Badge>
                        </div>

                        {/* Danger Zone Hover Card */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-card border-2 border-red-500 rounded-lg shadow-lg p-3 whitespace-nowrap z-30 min-w-56">
                          <div className="space-y-2">
                            <p className="font-bold text-sm text-red-700 dark:text-red-400">
                              ⚠️ {zone.name}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {zone.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                              <span className="text-xs font-bold text-red-700 uppercase">
                                {zone.riskLevel} Risk Zone
                              </span>
                            </div>
                            <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200">
                              <p className="text-xs text-red-700 dark:text-red-400 font-semibold">
                                🚨 {t("avoidArea")}
                              </p>
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-red-500"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Button
                size="icon"
                variant="outline"
                className="bg-white/80 backdrop-blur"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-white/80 backdrop-blur"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-white/80 backdrop-blur"
                onClick={getCurrentLocation}
                disabled={locationLoading}
              >
                <Locate
                  className={`h-4 w-4 ${locationLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {/* Live Update Indicator */}
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                SafarSuraksha {t("liveUpdate")}{" "}
                {useGoogleMaps && googleMapsApiKey && "• Google Maps"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">{t("safe")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">{t("caution")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-red-700">
                {t("dangerZones")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm">{t("yourLocation")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-sm">{t("emergencyServices")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Nearby Places */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("nearbyPlaces")}</span>
            <div className="flex items-center space-x-2">
              {loading && <Loader2 className="h-3 w-3 animate-spin" />}
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {t("lastUpdated")} {currentLocation ? "1" : "5"}{" "}
                {t("minutesAgo")}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {nearbyLocations
              .filter((l) => !l.isCurrentLocation)
              .map((location) => (
                <div
                  key={location.id}
                  className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      location.type === "emergency" ||
                      location.type === "police"
                        ? "bg-red-600"
                        : location.type === "hospital"
                        ? "bg-green-600"
                        : location.type === "attraction"
                        ? "bg-purple-600"
                        : "bg-orange-600"
                    }`}
                  >
                    {getLocationIcon(location.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{location.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{location.distance}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${getSafetyColor(
                          location.safetyLevel
                        )}`}
                      ></div>
                      <span
                        className={
                          location.crowdLevel
                            ? getCrowdColor(location.crowdLevel)
                            : "text-gray-500"
                        }
                      >
                        {location.crowdLevel
                          ? `${t(location.crowdLevel)} crowd`
                          : "No data"}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDirections(location)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    {t("getDirections")}
                  </Button>
                </div>
              ))}
          </div>

          {nearbyLocations.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No places found nearby.{" "}
                {locationError
                  ? t("enableLocation")
                  : "Try refreshing your location."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
