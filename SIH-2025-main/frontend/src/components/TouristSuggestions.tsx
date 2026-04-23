import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Compass,
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Shield,
  Coffee,
  UtensilsCrossed,
  Bed,
  Car,
  Fuel,
  ShoppingBag,
  Search,
  Filter,
  Loader2,
  Navigation,
  Camera,
  Heart,
  Info,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Wifi,
  CreditCard,
  Users,
  Calendar,
  Map as MapIcon,
  Building2,
  Trees,
  Utensils,
  GraduationCap,
  Landmark,
  Church,
} from "lucide-react";

interface TouristSuggestionsProps {
  language: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  category:
    | "attraction"
    | "restaurant"
    | "hotel"
    | "shopping"
    | "service"
    | "transport"
    | "entertainment"
    | "education"
    | "health";
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
  features?: string[];
}

export function TouristSuggestions({ language }: TouristSuggestionsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Multilingual support
  const translations = {
    en: {
      recommendations: "SafarSuraksha Nearby Places",
      subtitle: "Discover safe and amazing places around you",
      searchPlaceholder: "Search for places, restaurants, attractions...",
      categories: {
        all: "All Places",
        attraction: "Attractions",
        restaurant: "Restaurants",
        hotel: "Hotels",
        shopping: "Shopping",
        service: "Services",
        transport: "Transport",
        entertainment: "Entertainment",
        education: "Education",
        health: "Healthcare",
      },
      distance: "away",
      rating: "Rating",
      safety: "Safety",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      open: "Open",
      closed: "Closed",
      openingHours: "Hours",
      phone: "Phone",
      website: "Website",
      getDirections: "Get Directions",
      callNow: "Call Now",
      bookNow: "Book Now",
      exploreMore: "Explore More",
      noPlaces: "No places found",
      noPlacesDesc: "Try adjusting your search or category filter",
      locationRequired: "Location access required",
      locationError: "Unable to get your location",
      enableLocation: "Enable Location",
      retry: "Try Again",
      loading: "Finding amazing places near you...",
      priceLevel: {
        1: "Budget Friendly",
        2: "Moderate",
        3: "Expensive",
        4: "Very Expensive",
      } as Record<number, string>,
      safetyLevels: {
        high: "Very Safe",
        medium: "Safe",
        low: "Exercise Caution",
        unknown: "Safety Unverified",
      },
      features: {
        wifi: "Free WiFi",
        parking: "Parking",
        wheelchair: "Wheelchair Accessible",
        cards: "Cards Accepted",
        outdoor: "Outdoor Seating",
        delivery: "Delivery Available",
      },
    },
    hi: {
      recommendations: "सफरसुरक्षा आस-पास के स्थान",
      subtitle: "अपने आस-पास के सुरक्षित और अद्भुत स्थानों की खोज करें",
      searchPlaceholder: "स्थान, रेस्टोरेंट, आकर्षण खोजें...",
      categories: {
        all: "सभी स्थान",
        attraction: "आकर्षण",
        restaurant: "रेस्टोरेंट",
        hotel: "होटल",
        shopping: "खरीदारी",
        service: "सेवाएं",
        transport: "परिवहन",
        entertainment: "मनोरंजन",
        education: "शिक्षा",
        health: "स्वास्थ्य",
      },
      distance: "दूर",
      rating: "रेटिंग",
      safety: "सुरक्षा",
      excellent: "बेहतरीन",
      good: "अच्छा",
      fair: "ठीक",
      poor: "खराब",
      open: "खुला",
      closed: "बंद",
      openingHours: "समय",
      phone: "फोन",
      website: "वेबसाइट",
      getDirections: "दिशा-निर्देश",
      callNow: "कॉल करें",
      bookNow: "बुक करें",
      exploreMore: "और देखें",
      noPlaces: "कोई स्थान नहीं मिला",
      noPlacesDesc: "अपनी खोज या श्रेणी फिल्टर समायोजित करने का प्रयास करें",
      locationRequired: "स्थान पहुंच आवश्यक",
      locationError: "आपका स्थान प्राप्त करने में असमर्थ",
      enableLocation: "स्थान सक्षम करें",
      retry: "पुनः प्रयास करें",
      loading: "आपके पास के अद्भुत स्थान खोज रहे हैं...",
      priceLevel: {
        1: "बजट के अनुकूल",
        2: "मध्यम",
        3: "महंगा",
        4: "बहुत महंगा",
      } as Record<number, string>,
      safetyLevels: {
        high: "बहुत सुरक्षित",
        medium: "सुरक्षित",
        low: "सावधानी बरतें",
        unknown: "सुरक्षा अज्ञात",
      },
      features: {
        wifi: "मुफ्त वाईफाई",
        parking: "पार्किंग",
        wheelchair: "व्हीलचेयर सुलभ",
        cards: "कार्ड स्वीकार",
        outdoor: "बाहरी बैठक",
        delivery: "डिलीवरी उपलब्ध",
      },
    },
  };

  const t = (key: string): any => {
    const keys = key.split(".");
    let value: any = (translations as any)[language] || translations.en;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      console.log("🗺️ SafarSuraksha Explore: Requesting GPS location...");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(location);
            console.log(
              "✅ SafarSuraksha Explore: Location updated for nearby search"
            );
          },
          (error) => {
            console.error("❌ SafarSuraksha Explore: Location failed:", error);
            setError(
              "Location access denied. Please enable location services."
            );
          },
          { enableHighAccuracy: true, timeout: 15, maximumAge: 300000 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation();
  }, []);

  // Fetch nearby places when location is available
  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPlaces();
    }
  }, [currentLocation]);

  // DEMO DATA: Easily editable fallback places
  const DEMO_PLACES: NearbyPlace[] = [
    {
      id: "demo_1",
      name: "Chappar Chiri War Memorial",
      category: "attraction",
      type: "Historic",
      address: "Sector 93, Sahibzada Ajit Singh Nagar, Punjab, Landran-140307",
      coordinates: { lat: 31.62, lon: 74.8765 },
      distance: 500,
      rating: 4.5,
      priceLevel: 1,
      openingHours: "8:00am–7:30pm",
      phone: "+91 183 2553957",
      website: "",
      image:
        "https://content.jdmagicbox.com/comp/mohali/d1/0172px172.x172.220322222105.y2d1/catalogue/chappar-chiri-war-memorial-mohali-tourist-attraction-08ixtwrp0q.jpg?w=3840&q=75",
      description:
        "a historic site and the location of the Fateh Burj, or Victory Tower, the tallest victory tower in India",
      safetyScore: 92,
      isOpen: true,
      tags: ["SikhHistory", "WarMemorial", "heritage"],
      features: ["wifi"],
    },
    {
      id: "demo_2",
      name: "Baba Banda Singh Bahadur War Memorial",
      category: "attraction",
      type: "Historic",
      address: "Fateh Burj, Sector 93, Chapar Chiri Khurd-140307",
      coordinates: { lat: 31.6205, lon: 74.8796 },
      distance: 700,
      rating: 4.5,
      priceLevel: 1,
      openingHours: "8:00am–7:30pm",
      phone: "",
      website: "https://amritsar.nic.in/tourist-place/jallianwala-bagh/",
      image:
        "https://content.jdmagicbox.com/v2/comp/mohali/a1/0172px172.x172.191120212226.v3a1/catalogue/baba-banda-singh-bahadur-war-memorial-chapar-chiri-khurd-mohali-tourist-attraction-91wpczzm4i.jpg?w=3840&q=75",
      description:
        "a towering monument in Punjab commemorating Sikh warrior Baba Banda Singh Bahadur's decisive victory over the Mughal Empire at Chappar Chiri in 1710.",
      safetyScore: 92,
      isOpen: true,
      tags: ["historic", "BabaBandaSinghBahadur"],
      features: [],
    },
    {
      id: "demo_3",
      name: "Levels Microbrewery & SkyGarden",
      category: "restaurant",
      type: "Restaurant",
      address: "Sector 4, Near Havells Gallaxy, Ajit Singh Nagar, Kharar Road, Mohali",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 1200,
      rating: 4.4,
      priceLevel: 2,
      openingHours: "11:00am-12midnight",
      phone: "+91 183 2552103",
      website: "",
      image:
        "https://b.zmtcdn.com/data/pictures/9/20911749/aa86701cfc090fb9e680e0500d7aca7a.jpg",
      description: "Popular eatery offering a mix of traditional and innovative flavors, with a diverse menu crafted with quality ingredients.",
      safetyScore: 80,
      isOpen: true,
      tags: ["food","cuisine"],
      features: ["wifi", "cards", "delivery"],
    },
    {
      id: "demo_4",
      name: "Landran Point",
      category: "attraction",
      type: "Landmark",
      address: "Industrial Area, Sector 91, Sahibzada Ajit Singh Nagar, Sector 91 Road-140307",
      coordinates: { lat: 31.6295, lon: 74.8769 },
      distance: 900,
      rating: 4.2,
      priceLevel: 1,
      openingHours: "24/7",
      phone: "",
      website: "",
      image:
        "https://content.jdmagicbox.com/v2/comp/mohali/k4/0172px172.x172.241212021718.j5k4/catalogue/landran-point-mohali-tourist-attraction-x09rnqqcsc.jpg?w=3840&q=75",
      description: "Landran Point is an emerging educational and residential hub in Mohali, Punjab, known for its strategic location on the Kharar-Landran road.",
      safetyScore: 88,
      isOpen: true,
      tags: ["attraction", "Landmark"],
      features: ["Tourist"],
    },
    {
      id: "demo_5",
      name: "Peacocks Garden",
      category: "attraction",
      type: "Indian Peafowl",
      address: "Industrial Area, Sahibzada Ajit Singh Nagar, Sector 91-140307",
      coordinates: { lat: 31.6331, lon: 74.8648 },
      distance: 2500,
      rating: 3.9,
      priceLevel: 2,
      openingHours: "24/7",
      phone: "",
      website: "https://www.justdial.com/Mohali/Peacocks-Garden-Industrial-Area-Sahibzada-Ajit-Singh-Nagar-Mohali-Sector-91/0172PX172-X172-230718221506-A1N5_BZDET",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0QFYHXl9UEcSfEd9qoSCYlKH78YT6PDB_p4Rh87FdZKvKElvmNL3Q4xKJRkShQ_fIkxw&usqp=CAU",
      description: "peacock-themed public gardens with sculptures and decorative elements located on the Landran-Kharar Road in Mohali, near Chandigarh",
      safetyScore: 82,
      isOpen: true,
      tags: ["Garden", "heritage"],
      features: ["Park", "Garden"],
    },
    {
      id: "demo_6",
      name: "Central Plaza",
      category: "shopping",
      type: "Market",
      address: "Emaar Mgf Mohali Sector 105, Sahibzada Ajit Singh Nagar, Sector 105-140307",
      coordinates: { lat: 31.6337, lon: 74.8721 },
      distance: 1800,
      rating: 4.2,
      priceLevel: 1,
      openingHours: "9:30am–6:30pm",
      phone: "080-46971770",
      website: "https://centralplazamohali.emaar-india.com/",
      image:
        "https://dyimg1.realestateindia.com/prop_images/1005886/952976_3-350x350.jpg",
      description: "Central Plaza Landran is a premium retail and office complex in Sector 105, Mohali, developed by Emaar, known for its Spanish-style architecture",
      safetyScore: 75,
      isOpen: true,
      tags: ["shopping", "Plaza"],
      features: ["parking"],
    },
    {
      id: "demo_7",
      name: "TDI Club Retreat Hotel",
      category: "hotel",
      type: "Hotel",
      address: "TDI CITY, Sector 74 A, Sahibzada Ajit Singh Nagar, Punjab",
      coordinates: { lat: 31.6532, lon: 74.8285 },
      distance: 3000,
      rating: 4.2,
      priceLevel: 4,
      openingHours: "24/7",
      phone: "+91 183 2871234",
      website:
        "",
      image:
        "https://lh3.googleusercontent.com/p/AF1QipMw2VR4m8L4Ay9njBIGn65SF-Uv8wf9vrLYh9aW=w574-h384-n-k-rw-no-v1",
      description: "Luxury hotel with modern amenities and dining options.",
      safetyScore: 90,
      isOpen: true,
      tags: ["hotel", "luxury"],
      features: ["wifi", "parking"],
    },
    {
      id: "demo_8",
      name: "Sohana Hospital",
      category: "health",
      type: "HealthCare",
      address: "Super Specialty Hospital, SH12A, Akal Ashram Colony, Sector 77, Sahibzada Ajit Singh Nagar, Punjab 140308",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 1200,
      rating: 4.6,
      priceLevel: 2,
      openingHours: "24/7",
      phone: "+91 087250 01155",
      website: "https://www.sghshospitals.com/",
      image:
        "https://www.sghshospitals.com/images/about.webp",

      description: "Popular eatery offering a mix of traditional and innovative flavors, with a diverse menu crafted with quality ingredients.",
      safetyScore: 80,
      isOpen: true,
      tags: ["Healthcare", "SuperSpecialty"],
      features: ["Orthopedics", "Eye", "Robotic", "Surgery"],
    },

     {
      id: "demo_9",
      name: "Guru Nanak Educational School, Landran (S.A.S.Nagar)",
      category: "education",
      type: "Education",
      address: "Sector 93, Sahibzada Ajit Singh Nagar, Punjab 140307",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 1200,
      rating: 3.9,
      priceLevel: 2,
      openingHours: "7:00am-3:00pm",
      phone: "+91 087250 01155",
      website: "https://www.gnfpsmohali.com/",
      image:
        "https://content.jdmagicbox.com/v2/comp/mohali/z8/0172px172.x172.160317122704.y2z8/catalogue/guru-nanak-foundation-public-school-mohali-mohali-public-schools-t6AggEwq15.jpg",

      description: "general education school focused on providing a comprehensive academic foundation and nurturing holistic development for its students in a supportive learning environment. ",
      safetyScore: 80,
      isOpen: true,
      tags: ["Education", "Sports"],
      features: ["Education"],
    },

         {
      id: "demo_10",
      name: "Chandigarh Group of Colleges (CGC) - Landran",
      category: "education",
      type: "Education",
      address: "Kharar Banur Hwy, Sector 112, Landran, Sahibzada Ajit Singh Nagar, Punjab 140307",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 0,
      rating: 4.1,
      priceLevel: 2,
      openingHours: "7:00am-3:00pm",
      phone: "+91 087250 01155",
      website: "https://www.cgc.edu.in/",
      image:
        "https://lh3.googleusercontent.com/p/AF1QipO_UAWD5ZUETtDVK-NVK5vzrbOkGF-Q_p2Zt0om=s1360-w1360-h1020-rw",

      description: "a leading NAAC A+ accredited institution established in 2001, offering over 55 UG/PG programs in diverse fields like Engineering, Management, and Pharmacy. ",
      safetyScore: 80,
      isOpen: true,
      tags: ["Education", "Sports"],
      features: ["Education"],
    },

    {
      id: "demo_11",
      name: "Punjab Street",
      category: "restaurant",
      type: "Restaurant",
      address: "Daun, Sector 118, Near HP Petrol Pump, TDI City, Mohali",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 1100,
      rating: 4.4,
      priceLevel: 2,
      openingHours: "24/7",
      phone: "+91 183 2552103",
      website: "",
      image:
        "https://b.zmtcdn.com/data/pictures/4/19693344/6b8a0851399cb170913ceb8a420d91ff.jpeg?fit=around|771.75:416.25&crop=771.75:416.25;*,*",
      description: "a vibrant, casual dining experience with a menu of authentic North Indian, street food, and fast-food dishes in a warm, culturally inspired atmosphere perfect for family and friends.",
      safetyScore: 80,
      isOpen: true,
      tags: ["Street Food", "Biryani", "Burger", "Shake", "Tea"],
      features: ["wifi", "cards", "delivery"],
    },

     {
      id: "demo_12",
      name: "Pizza Mexican",
      category: "restaurant",
      type: "Restaurant",
      address: "Shop 2, Guru Teg Bahadur Nagar, Gillco Valley, Mohali",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 1200,
      rating: 4.4,
      priceLevel: 2,
      openingHours: "24/7",
      phone: "+91 8968398976",
      website: "",
      image:
        "https://b.zmtcdn.com/data/pictures/4/20597214/4dc25944ff77db685f8f087c5240cc35_o2_featured_v2.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*",
      description: "A blend of popular fast-food items like pizzas and burgers with Mexican flavors, making for a unique dining experience.",
      safetyScore: 80,
      isOpen: true,
      tags: ["Pizza", "Burger", "Pasta"],
      features: ["wifi", "cards", "delivery"],
    },

     {
      id: "demo_13",
      name: "Lezzetli",
      category: "restaurant",
      type: "Restaurant",
      address: "Near Havells Galaxy Mohali, Sahibzada Ajit Singh Nagar, Kharar Road, Mohali",
      coordinates: { lat: 31.6311, lon: 74.8772 },
      distance: 1300,
      rating: 4.4,
      priceLevel: 2,
      openingHours: "11:00am-12midnight",
      phone: "+91 9888040667",
      website: "",
      image:
        "https://b.zmtcdn.com/data/pictures/3/122273/a663aab99503122327b3d46a8def0d66.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*",
      description: "A multi-cuisine menu with a focus on North Indian and Mughlai dishes, also offering Continental and Chinese options. ",
      safetyScore: 80,
      isOpen: true,
      tags: ["North Indian", "Chinese", "Continental", "Mughlai", "Oriental", "Desserts", "Beverages"],
      features: ["wifi", "cards", "delivery"],
    },

     {
      id: "demo_14",
      name: "Glades Hotel",
      category: "hotel",
      type: "Hotel",
      address: "SCO 3 and 4, Sector 55, Phase 1, Mohali, Sahibzada Ajit Singh Nagar, Chandigarh, India, 160055",
      coordinates: { lat: 31.6532, lon: 74.8285 },
      distance: 6000,
      rating: 4,
      priceLevel: 4,
      openingHours: "24/7",
      phone: "+91 183 2871234",
      website:
        "",
      image:
        "https://pix8.agoda.net/hotelImages/1617801/0/5e1d1fb8f5bd91f5e65e7d41527cc340.jpeg?ce=0&s=1024x",
      description: "Conveniently situated in Mohali, near the North Country Mall, Hibicus Garden, and the Mohali Cricket Stadium. ",
      safetyScore: 90,
      isOpen: true,
      tags: ["hotel", "luxury"],
      features: ["wifi", "parking"],
    },

         {
      id: "demo_15",
      name: "Clubhouse Hotel Chandigarh Mohali",
      category: "hotel",
      type: "Hotel",
      address: "Sector 115, Sahibzada Ajit Singh Nagar, Adjoining JTPL kharar landra road, Punjab, Mohali, Sahibzada Ajit Singh Nagar, Chandigarh, India, 140307",
      coordinates: { lat: 31.6532, lon: 74.8285 },
      distance: 2200,
      rating: 4,
      priceLevel: 4,
      openingHours: "24/7",
      phone: "+91 183 2871234",
      website:
        "",
      image:
        "https://pix8.agoda.net/hotelImages/60151882/0/37e49f6d434a2eb42716db940ddac86f.jpg?ce=0&s=1024x",
      description: "a 4-star hotel in Mohali offering comfortable, modern rooms and amenities like a spa, fitness center, and restaurant.",
      safetyScore: 90,
      isOpen: true,
      tags: ["hotel", "cleaniness"],
      features: ["wifi", "parking"],
    },

            {
      id: "demo_16",
      name: "Hotel Royal Residency Near ISBT Mohali Chandigarh",
      category: "hotel",
      type: "Hotel",
      address: "Plot No. 374-375, Kamla Market, Phase 1, Mohali Village, Sector 57, Sahibzada Ajit Singh Nagar, Punjab, India, 160055., Sahibzada Ajit Singh Nagar, Chandigarh, India, 160055",
      coordinates: { lat: 31.6532, lon: 74.8285 },
      distance: 6000,
      rating: 4,
      priceLevel: 4,
      openingHours: "24/7",
      phone: "+91 183 2871234",
      website:
        "",
      image:
        "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/674787805.jpg?k=4bde081fd4815c131fe560c02ec5c60583e2e17f68403839f643cbacaca458ba&o=&s=1024x",
      description: "Luxury hotel with modern amenities and dining options.",
      safetyScore: 90,
      isOpen: true,
      tags: ["hotel", "cleaniness"],
      features: ["wifi", "parking"],
    },
  ];

  const fetchNearbyPlaces = async () => {
    if (!currentLocation) return;

    setLoading(true);
    setError(null);

    // Helper: timeout promise
    const timeout = (ms: number) =>
      new Promise<"timeout">((resolve) =>
        setTimeout(() => resolve("timeout"), ms)
      );

    try {
      // Race backend fetch against 500ms timeout
      const backendPromise = (async () => {
        try {
          const response = await fetch("/api/places/nearby", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
              radius: 25000,
              limit: 50,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.places && data.places.length > 0) {
              return data.places;
            }
          }
        } catch {}
        return null;
      })();

      const result = await Promise.race([backendPromise, timeout(500)]); // time taken by API to fetch data if data not feteched then Show demo

      if (result && result !== "timeout") {
        setNearbyPlaces(result as NearbyPlace[]);
      } else {
        // Fallback to demo data immediately if backend is slow or fails
        setNearbyPlaces(DEMO_PLACES);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load nearby places"
      );
      setNearbyPlaces(DEMO_PLACES);
    } finally {
      setLoading(false);
    }
  };

  const fetchFromOpenStreetMap = async (): Promise<NearbyPlace[]> => {
    if (!currentLocation) return [];

    const overpassQuery = `
      [out:json][timeout:30];
      (
        // Tourist attractions and landmarks
        way["tourism"~"attraction|museum|monument|viewpoint|zoo|theme_park|gallery|artwork"](around:25000,${currentLocation.lat},${currentLocation.lng});
        node["tourism"~"attraction|museum|monument|viewpoint|zoo|theme_park|gallery|artwork"](around:25000,${currentLocation.lat},${currentLocation.lng});
        
        // Historical places
        way["historic"~"monument|castle|fort|palace|temple|ruins|archaeological_site|memorial|building"](around:25000,${currentLocation.lat},${currentLocation.lng});
        node["historic"~"monument|castle|fort|palace|temple|ruins|archaeological_site|memorial|building"](around:25000,${currentLocation.lat},${currentLocation.lng});
        
        // Religious places
        way["amenity"="place_of_worship"]["name"](around:25000,${currentLocation.lat},${currentLocation.lng});
        node["amenity"="place_of_worship"]["name"](around:25000,${currentLocation.lat},${currentLocation.lng});
        
        // Restaurants and food
        way["amenity"~"restaurant|cafe|fast_food|food_court|pub|bar"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        node["amenity"~"restaurant|cafe|fast_food|food_court|pub|bar"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        
        // Hotels and accommodation
        way["tourism"~"hotel|hostel|guest_house|motel"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        node["tourism"~"hotel|hostel|guest_house|motel"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        way["amenity"~"hotel"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        node["amenity"~"hotel"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        
        // Shopping
        way["shop"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        node["shop"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        way["amenity"="marketplace"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        node["amenity"="marketplace"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        
        // Services
        way["amenity"~"bank|atm|hospital|pharmacy|police|post_office|fuel|library"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        node["amenity"~"bank|atm|hospital|pharmacy|police|post_office|fuel|library"]["name"](around:15000,${currentLocation.lat},${currentLocation.lng});
        
        // Educational institutions
        way["amenity"~"university|college|school"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        node["amenity"~"university|college|school"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        
        // Parks and recreation
        way["leisure"~"park|garden|recreation_ground|sports_centre|stadium"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        node["leisure"~"park|garden|recreation_ground|sports_centre|stadium"]["name"](around:20000,${currentLocation.lat},${currentLocation.lng});
        way["natural"~"peak|lake|park|reserve|beach"]["name"](around:30000,${currentLocation.lat},${currentLocation.lng});
        node["natural"~"peak|lake|park|reserve|beach"]["name"](around:30000,${currentLocation.lat},${currentLocation.lng});
      );
      out center meta;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
      headers: { "Content-Type": "text/plain" },
    });

    if (!response.ok) {
      throw new Error(`OpenStreetMap query failed: ${response.status}`);
    }

    const osmData = await response.json();

    // Process and enhance places with real images
    const processedPlaces = await Promise.all(
      osmData.elements
        .filter((element: any) => {
          if (!element.tags || !element.tags.name) return false;
          const name = element.tags.name.toLowerCase();
          if (name.length < 2 || name === "unnamed" || name === "untitled")
            return false;
          return true;
        })
        .map(async (element: any) => {
          const placeLat =
            element.lat || element.center?.lat || currentLocation.lat;
          const placeLon =
            element.lon || element.center?.lon || currentLocation.lng;
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            placeLat,
            placeLon
          );

          // Get real image for this place
          const realImage = await getRealPlaceImage(
            element.tags.name,
            element.tags
          );

          return {
            element,
            distance,
            placeLat,
            placeLon,
            name: element.tags.name,
            realImage,
          };
        })
    );

    return processedPlaces
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 50) // Limit results
      .filter((item: any) => item.distance <= 50) // Within 50km
      .map((item: any) => {
        const { element, distance, placeLat, placeLon, realImage } = item;

        return {
          id: `osm_${element.type}_${element.id}`,
          name: element.tags.name,
          category: mapOSMCategory(element.tags),
          type: getPlaceType(element.tags),
          address: buildAddress(element.tags, placeLat, placeLon),
          coordinates: {
            lat: placeLat,
            lon: placeLon,
          },
          distance: Math.round(distance * 1000), // Convert to meters
          rating: calculateRating(element.tags),
          priceLevel: estimatePriceLevel(element.tags),
          openingHours: element.tags.opening_hours,
          phone: element.tags.phone || element.tags["contact:phone"],
          website: element.tags.website || element.tags["contact:website"],
          image: realImage,
          description: buildDescription(element.tags),
          safetyScore: calculateSafetyScore(element.tags, distance),
          isOpen: determineOpenStatus(element.tags),
          tags: Object.keys(element.tags),
          features: extractFeatures(element.tags),
        };
      });
  };

  // Get real images for places
  const getRealPlaceImage = async (
    placeName: string,
    tags: any
  ): Promise<string> => {
    try {
      // Try Wikipedia image first
      if (tags.wikipedia) {
        const wikipediaImage = await getWikipediaImage(tags.wikipedia);
        if (wikipediaImage) return wikipediaImage;
      }

      // Try Wikimedia Commons search
      const wikimediaImage = await searchWikimediaImage(placeName);
      if (wikimediaImage) return wikimediaImage;

      // Try Unsplash with specific search
      const unsplashImage = await searchUnsplashImage(placeName, tags);
      if (unsplashImage) return unsplashImage;

      // Fallback to category-based image
      return getCategoryImage(tags);
    } catch (error) {
      console.warn(`Failed to get image for ${placeName}:`, error);
      return getCategoryImage(tags);
    }
  };

  const getWikipediaImage = async (
    wikipediaUrl: string
  ): Promise<string | null> => {
    try {
      const title = wikipediaUrl.split("/").pop();
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail && data.thumbnail.source) {
          return data.thumbnail.source.replace(/\/\d+px-/, "/400px-");
        }
      }
    } catch (error) {
      console.warn("Wikipedia image fetch failed:", error);
    }
    return null;
  };

  const searchWikimediaImage = async (
    placeName: string
  ): Promise<string | null> => {
    try {
      const searchQuery = encodeURIComponent(placeName);
      const response = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchQuery}&srnamespace=6&srlimit=1&origin=*`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.query && data.query.search && data.query.search.length > 0) {
          const fileName = data.query.search[0].title.replace("File:", "");
          return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
            fileName
          )}?width=400`;
        }
      }
    } catch (error) {
      console.warn("Wikimedia search failed:", error);
    }
    return null;
  };

  const searchUnsplashImage = async (
    placeName: string,
    tags: any
  ): Promise<string | null> => {
    try {
      const searchTerms = [placeName];

      // Add context based on tags
      if (tags.tourism) searchTerms.push(tags.tourism);
      if (tags.historic) searchTerms.push(tags.historic);
      if (tags.amenity === "place_of_worship") {
        if (tags.religion === "sikh") searchTerms.push("gurudwara");
        else if (tags.religion === "hindu") searchTerms.push("temple");
        else if (tags.religion === "christian") searchTerms.push("church");
      }
      if (tags.amenity === "restaurant") searchTerms.push("restaurant");
      if (tags.shop) searchTerms.push("shop", tags.shop);

      searchTerms.push("punjab", "india");

      const searchQuery = searchTerms.join(" ");
      const unsplashUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(
        searchQuery
      )}`;

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(unsplashUrl);
        img.onerror = () => resolve(null);
        img.src = unsplashUrl;
        setTimeout(() => resolve(null), 3000);
      });
    } catch (error) {
      console.warn("Unsplash search failed:", error);
    }
    return null;
  };

  const getCategoryImage = (tags: any): string => {
    // Religious places
    if (tags.amenity === "place_of_worship") {
      if (tags.religion === "sikh")
        return "https://images.unsplash.com/photo-1587474805438-c4b8db37b87b?w=400&h=300&fit=crop&q=80";
      if (tags.religion === "hindu")
        return "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&q=80";
      if (tags.religion === "christian")
        return "https://images.unsplash.com/photo-1520637836862-4d197d17c9a8?w=400&h=300&fit=crop&q=80";
      return "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&q=80";
    }

    // Food and restaurants
    if (tags.amenity === "restaurant" || tags.amenity === "cafe")
      return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80";
    if (tags.amenity === "fast_food")
      return "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop&q=80";

    // Hotels
    if (tags.tourism === "hotel" || tags.amenity === "hotel")
      return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&q=80";

    // Shopping
    if (tags.shop || tags.amenity === "marketplace")
      return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80";

    // Historical places
    if (tags.historic === "fort" || tags.historic === "castle")
      return "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&q=80";
    if (tags.historic === "monument")
      return "https://images.unsplash.com/photo-1571757767896-7b93a1f40f5f?w=400&h=300&fit=crop&q=80";

    // Museums
    if (tags.tourism === "museum")
      return "https://images.unsplash.com/photo-1513475382419-0da0b5c4b4e5?w=400&h=300&fit=crop&q=80";

    // Parks and nature
    if (tags.leisure === "park" || tags.natural)
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80";

    // Educational
    if (tags.amenity === "university" || tags.amenity === "college")
      return "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&q=80";

    // Healthcare
    if (tags.amenity === "hospital")
      return "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop&q=80";

    // Banks/Services
    if (tags.amenity === "bank")
      return "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop&q=80";

    // Generic attraction
    return "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80";
  };

  // Helper functions
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const mapOSMCategory = (tags: any): NearbyPlace["category"] => {
    if (tags.tourism || tags.historic) return "attraction";
    if (
      tags.amenity?.includes("restaurant") ||
      tags.amenity?.includes("cafe") ||
      tags.amenity?.includes("fast_food")
    )
      return "restaurant";
    if (tags.tourism?.includes("hotel") || tags.amenity?.includes("hotel"))
      return "hotel";
    if (tags.shop || tags.amenity === "marketplace") return "shopping";
    if (
      tags.amenity === "university" ||
      tags.amenity === "college" ||
      tags.amenity === "school"
    )
      return "education";
    if (tags.amenity === "hospital" || tags.amenity === "pharmacy")
      return "health";
    if (tags.leisure) return "entertainment";
    return "service";
  };

  const getPlaceType = (tags: any): string => {
    if (tags.amenity === "place_of_worship") {
      if (tags.religion === "sikh") return "Gurudwara";
      if (tags.religion === "hindu") return "Hindu Temple";
      if (tags.religion === "christian") return "Church";
      return "Place of Worship";
    }
    if (tags.tourism)
      return tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1);
    if (tags.historic) return `Historic ${tags.historic}`;
    if (tags.amenity)
      return tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1);
    if (tags.shop)
      return `${tags.shop.charAt(0).toUpperCase() + tags.shop.slice(1)} Shop`;
    if (tags.leisure)
      return tags.leisure.charAt(0).toUpperCase() + tags.leisure.slice(1);
    return "Place of Interest";
  };

  const buildAddress = (tags: any, lat: number, lon: number): string => {
    const parts = [];
    if (tags["addr:street"]) parts.push(tags["addr:street"]);
    if (tags["addr:city"]) parts.push(tags["addr:city"]);
    else if (tags["addr:town"]) parts.push(tags["addr:town"]);
    else if (tags["addr:village"]) parts.push(tags["addr:village"]);
    if (tags["addr:state"]) parts.push(tags["addr:state"]);
    else parts.push("Punjab");
    parts.push("India");

    if (parts.length <= 2) {
      return `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
    }

    return parts.join(", ");
  };

  const buildDescription = (tags: any): string => {
    if (tags.description) return tags.description;

    const descriptions = [];
    if (tags.historic && tags.tourism)
      descriptions.push(
        `A historic ${tags.historic} and popular tourist attraction`
      );
    else if (tags.historic) descriptions.push(`A historic ${tags.historic}`);
    else if (tags.tourism)
      descriptions.push(`A popular tourist ${tags.tourism}`);

    if (tags.amenity === "place_of_worship") {
      descriptions.push(
        `A sacred ${tags.religion || "religious"} place of worship`
      );
    }

    if (tags.amenity === "restaurant")
      descriptions.push("A dining establishment");
    if (tags.amenity === "hotel")
      descriptions.push("An accommodation facility");
    if (tags.shop) descriptions.push(`A ${tags.shop} shop`);

    return descriptions.length > 0
      ? descriptions[0]
      : "An interesting place to visit";
  };

  const calculateRating = (tags: any): number => {
    let rating = 3.5;

    if (tags.wikipedia || tags.wikidata) rating += 0.6;
    if (tags.website) rating += 0.3;
    if (tags.heritage === "world") rating += 0.8;
    if (tags.wheelchair === "yes") rating += 0.3;
    if (tags.opening_hours) rating += 0.2;
    if (tags.phone || tags["contact:phone"]) rating += 0.1;

    if (tags.amenity === "place_of_worship") rating += 0.4;
    if (tags.tourism === "attraction") rating += 0.2;

    rating += (Math.random() - 0.5) * 0.6;

    return Math.min(5.0, Math.max(2.0, Math.round(rating * 10) / 10));
  };

  const estimatePriceLevel = (tags: any): 1 | 2 | 3 | 4 | undefined => {
    if (
      tags.fee === "no" ||
      tags.amenity === "place_of_worship" ||
      tags.leisure === "park"
    )
      return undefined;

    if (tags.tourism === "museum") return 1;
    if (tags.historic === "monument") return 1;
    if (tags.amenity === "fast_food") return 1;
    if (tags.amenity === "cafe") return 2;
    if (tags.amenity === "restaurant") return Math.random() > 0.5 ? 2 : 3;
    if (tags.tourism === "hotel") return Math.random() > 0.3 ? 3 : 2;
    if (tags.shop) return 2;

    return undefined;
  };

  const calculateSafetyScore = (tags: any, distance: number): number => {
    let score = 70;

    if (tags.tourism === "museum") score += 15;
    if (tags.amenity === "place_of_worship") score += 20;
    if (tags.leisure === "park") score += 10;
    if (tags.historic) score += 10;

    if (tags.wikipedia || tags.wikidata) score += 15;
    if (tags.website) score += 10;
    if (tags.opening_hours) score += 5;
    if (tags.wheelchair === "yes") score += 10;

    if (distance < 10) score += 10;
    else if (distance > 30) score -= 10;

    return Math.max(30, Math.min(95, score));
  };

  const determineOpenStatus = (tags: any): boolean | undefined => {
    if (!tags.opening_hours) return undefined;

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Simple heuristic for common opening hours
    if (tags.opening_hours.includes("24/7")) return true;
    if (tags.opening_hours.includes("Mo-Fr") && (day === 0 || day === 6))
      return false;
    if (hour < 6 || hour > 22) return false;

    return Math.random() > 0.3; // Most places are likely open during day
  };

  const extractFeatures = (tags: any): string[] => {
    const features = [];
    if (tags.wifi === "yes" || tags["internet_access"] === "wlan")
      features.push("wifi");
    if (tags.parking === "yes" || tags.parking) features.push("parking");
    if (tags.wheelchair === "yes") features.push("wheelchair");
    if (
      tags["payment:cards"] === "yes" ||
      tags["payment:credit_cards"] === "yes"
    )
      features.push("cards");
    if (tags["outdoor_seating"] === "yes") features.push("outdoor");
    if (tags.delivery === "yes") features.push("delivery");
    return features;
  };

  // Category icons mapping
  const categoryIcons: Record<string, React.ElementType> = {
    all: Compass,
    attraction: Camera,
    restaurant: UtensilsCrossed,
    hotel: Bed,
    shopping: ShoppingBag,
    service: Info,
    transport: Car,
    entertainment: Heart,
    education: GraduationCap,
    health: Building2,
  };

  // Filter places by category and search
  const filteredPlaces = nearbyPlaces.filter((place) => {
    const matchesCategory =
      activeCategory === "all" || place.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Get safety score color
  const getSafetyColor = (score?: number): string => {
    if (!score) return "bg-gray-100 text-gray-800";
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Get safety level text
  const getSafetyLevel = (score?: number): string => {
    if (!score) return t("safetyLevels.unknown");
    if (score >= 80) return t("safetyLevels.high");
    if (score >= 60) return t("safetyLevels.medium");
    return t("safetyLevels.low");
  };

  // Format distance
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m ${t("distance")}`;
    }
    return `${(meters / 1000).toFixed(1)}km ${t("distance")}`;
  };

  // Get price level display
  const getPriceDisplay = (level?: number): string | null => {
    if (!level) return null;
    return "₹".repeat(level);
  };

  // Handle directions
  const handleGetDirections = (place: NearbyPlace): void => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lon}`;
    window.open(url, "_blank");

    // Track visit
    try {
      const visitedPlaces = JSON.parse(
        localStorage.getItem("safar_visited_places") || "[]"
      );
      visitedPlaces.push({
        id: place.id,
        name: place.name,
        date: new Date().toISOString(),
        coordinates: place.coordinates,
      });
      localStorage.setItem(
        "safar_visited_places",
        JSON.stringify(visitedPlaces)
      );
    } catch (error) {
      console.warn("Failed to track visit:", error);
    }
  };

  // Handle phone call
  const handleCallPlace = (phone: string): void => {
    window.location.href = `tel:${phone}`;
  };

  // Handle website visit
  const handleVisitWebsite = (website: string): void => {
    window.open(website, "_blank");
  };

  if (!currentLocation && !error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="h-5 w-5 mr-2" />
              {t("recommendations")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Getting your location...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !currentLocation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="h-5 w-5 mr-2" />
              {t("recommendations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                <strong>{t("locationRequired")}:</strong> {error}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {t("retry")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setCurrentLocation({
                              lat: position.coords.latitude,
                              lng: position.coords.longitude,
                            });
                            setError(null);
                          },
                          (err) => setError("Location access denied")
                        );
                      }
                    }}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    {t("enableLocation")}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Compass className="h-5 w-5 mr-2" />
              {t("recommendations")}
              {loading && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin text-orange-500" />
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchNearbyPlaces}
              disabled={loading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </CardTitle>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(t("categories")).map(([key, label]) => {
              const IconComponent = categoryIcons[key];
              return (
                <Button
                  key={key}
                  variant={activeCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 ${
                    activeCategory === key
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "hover:bg-orange-50"
                  }`}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && currentLocation && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-300">
            <strong>Error:</strong> {error}
            <Button
              size="sm"
              onClick={fetchNearbyPlaces}
              className="ml-3 bg-red-600 hover:bg-red-700"
            >
              {t("retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Places Grid */}
      {!loading && filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer h-auto"
            >
              <div className="relative h-48 bg-muted">
                <ImageWithFallback
                  src={place.image || getCategoryImage({})}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Safety Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={getSafetyColor(place.safetyScore)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getSafetyLevel(place.safetyScore)}
                  </Badge>
                </div>

                {/* Distance Badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-white/90 text-gray-800 border-white/50">
                    <Navigation className="h-3 w-3 mr-1" />
                    {formatDistance(place.distance)}
                  </Badge>
                </div>

                {/* Open/Closed Badge */}
                {place.isOpen !== undefined && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={
                        place.isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {place.isOpen ? t("open") : t("closed")}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title and Category */}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {place.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {place.type} • {place.address}
                    </p>
                    {place.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {place.description}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  {place.features && place.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {place.features.slice(0, 3).map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="text-xs"
                        >
                          {t(`features.${feature}`) || feature}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {place.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">
                            {place.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {place.priceLevel && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600">
                            {getPriceDisplay(place.priceLevel)}
                          </span>
                        </div>
                      )}
                    </div>

                    {place.openingHours && (
                      <span className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {place.openingHours.length > 20
                          ? "See hours"
                          : place.openingHours}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(place);
                      }}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      {t("getDirections")}
                    </Button>

                    {place.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallPlace(place.phone!);
                        }}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}

                    {place.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisitWebsite(place.website!);
                        }}
                      >
                        <Globe className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredPlaces.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("noPlaces")}</h3>
            <p className="text-muted-foreground mb-4">{t("noPlacesDesc")}</p>
            <Button
              onClick={fetchNearbyPlaces}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedPlace.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedPlace(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Type:</strong> {selectedPlace.type}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedPlace.address}
                    </p>
                    <p>
                      <strong>Distance:</strong>{" "}
                      {formatDistance(selectedPlace.distance)}
                    </p>
                    {selectedPlace.phone && (
                      <p>
                        <strong>Phone:</strong> {selectedPlace.phone}
                      </p>
                    )}
                    {selectedPlace.openingHours && (
                      <p>
                        <strong>Hours:</strong> {selectedPlace.openingHours}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">SafarSuraksha Info</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Safety Score:</span>
                      <Badge
                        className={getSafetyColor(selectedPlace.safetyScore)}
                      >
                        {selectedPlace.safetyScore || "N/A"}
                      </Badge>
                    </div>
                    {selectedPlace.rating && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm">
                            {selectedPlace.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleGetDirections(selectedPlace)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                {selectedPlace.phone && (
                  <Button
                    variant="outline"
                    onClick={() => handleCallPlace(selectedPlace.phone!)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
                {selectedPlace.website && (
                  <Button
                    variant="outline"
                    onClick={() => handleVisitWebsite(selectedPlace.website!)}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
