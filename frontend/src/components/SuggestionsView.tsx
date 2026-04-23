import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Compass,
  MapPin,
  Star,
  Clock,
  Users,
  Shield,
  Heart,
  Car,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Navigation,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import {
  fetchSafetyProfile,
} from "../service/api";

interface SuggestionsViewProps {
  lat: number;
  lon: number;
  locationName?: string;
}

interface Destination {
  name: string;
  lat: number;
  lon: number;
  distance: number;
  safetyScore: number;
  category: string;
  description: string;
  rating: number;
  estimatedTime: string;
  features: string[];
}

const popularDestinations: Destination[] = [
  {
    name: "Red Fort",
    lat: 28.6562,
    lon: 77.2410,
    distance: 2.5,
    safetyScore: 85,
    category: "Historical",
    description: "Historic Mughal fortress and UNESCO World Heritage Site",
    rating: 4.5,
    estimatedTime: "2-3 hours",
    features: ["Historical", "Photography", "Family-friendly"]
  },
  {
    name: "Qutub Minar",
    lat: 28.5355,
    lon: 77.3910,
    distance: 8.2,
    safetyScore: 90,
    category: "Historical",
    description: "Tallest brick minaret in the world",
    rating: 4.6,
    estimatedTime: "1-2 hours",
    features: ["Historical", "Architecture", "UNESCO"]
  },
  {
    name: "Lotus Temple",
    lat: 28.5921,
    lon: 77.2505,
    distance: 3.1,
    safetyScore: 95,
    category: "Religious",
    description: "Bahá'í House of Worship with unique lotus-shaped architecture",
    rating: 4.4,
    estimatedTime: "1 hour",
    features: ["Religious", "Architecture", "Peaceful"]
  },
  {
    name: "Rashtrapati Bhavan",
    lat: 28.6129,
    lon: 77.2295,
    distance: 1.8,
    safetyScore: 88,
    category: "Government",
    description: "Official residence of the President of India",
    rating: 4.3,
    estimatedTime: "1 hour",
    features: ["Government", "Architecture", "Gardens"]
  },
  {
    name: "Humayun's Tomb",
    lat: 28.5931,
    lon: 77.2503,
    distance: 3.0,
    safetyScore: 87,
    category: "Historical",
    description: "Mughal emperor's tomb and UNESCO World Heritage Site",
    rating: 4.5,
    estimatedTime: "1-2 hours",
    features: ["Historical", "Architecture", "Gardens"]
  },
  {
    name: "Jama Masjid",
    lat: 28.6508,
    lon: 77.2334,
    distance: 2.8,
    safetyScore: 82,
    category: "Religious",
    description: "One of the largest mosques in India",
    rating: 4.2,
    estimatedTime: "1 hour",
    features: ["Religious", "Architecture", "Cultural"]
  }
];

export function SuggestionsView({ lat, lon, locationName = "Current Location" }: SuggestionsViewProps) {
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchSafetyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await fetchSafetyProfile(lat, lon, 5, 30, {
        includeWeather: true,
        includeCrime: true,
        includeDisaster: true,
        includeTraffic: true,
        includeHealth: true,
        includeEnvironmental: true,
        activityType: 'general'
      });

      setSafetyProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch safety data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyData();
  }, [lat, lon]);

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSafetyScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    if (score >= 40) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'historical': return <Shield className="h-4 w-4" />;
      case 'religious': return <Heart className="h-4 w-4" />;
      case 'government': return <Shield className="h-4 w-4" />;
      case 'nature': return <Wind className="h-4 w-4" />;
      case 'entertainment': return <Users className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'historical': return 'text-amber-600';
      case 'religious': return 'text-purple-600';
      case 'government': return 'text-blue-600';
      case 'nature': return 'text-green-600';
      case 'entertainment': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  const categories = ['all', ...Array.from(new Set(popularDestinations.map(d => d.category.toLowerCase())))];

  const filteredDestinations = selectedCategory === 'all' 
    ? popularDestinations 
    : popularDestinations.filter(d => d.category.toLowerCase() === selectedCategory);

  const sortedDestinations = filteredDestinations.sort((a, b) => {
    // Sort by distance first, then by safety score
    if (Math.abs(a.distance - b.distance) < 0.5) {
      return b.safetyScore - a.safetyScore;
    }
    return a.distance - b.distance;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading suggestions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <Button variant="outline" size="sm" className="ml-2" onClick={fetchSafetyData}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Explore & Suggestions</h2>
        <p className="text-sm text-gray-600 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {locationName} ({lat.toFixed(4)}, {lon.toFixed(4)})
        </p>
      </div>

      {/* Safety Overview */}
      {safetyProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Current Location Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getSafetyScoreColor(safetyProfile.overallSafetyScore)}`}>
                  {safetyProfile.overallSafetyScore}/100
                </div>
                <p className="text-sm text-gray-600">Overall Safety Score</p>
              </div>
              <div className="text-center">
                <Badge className={`${getSafetyScoreBg(safetyProfile.overallSafetyScore)} text-sm px-3 py-1`}>
                  {safetyProfile.riskLevel.toUpperCase()}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Risk Level</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{safetyProfile.alerts.length}</div>
                <p className="text-sm text-gray-600">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Safety Recommendations */}
      {safetyProfile?.recommendations.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Safety Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safetyProfile.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Popular Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Compass className="h-5 w-5 mr-2" />
            Popular Destinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedDestinations.map((destination, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{destination.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{destination.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSafetyScoreBg(destination.safetyScore)} ${getSafetyScoreColor(destination.safetyScore)}`}>
                    {destination.safetyScore}/100
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 mr-1" />
                    {destination.distance} km
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {destination.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {destination.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 text-xs ${getCategoryColor(destination.category)}`}>
                      {getCategoryIcon(destination.category)}
                      {destination.category}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {destination.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Compass className="h-5 w-5 mr-2" />
            Travel Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-green-800">Safety Tips</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Keep emergency contacts handy
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Share your location with trusted contacts
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Stay aware of your surroundings
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Avoid isolated areas, especially at night
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">General Tips</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Check weather conditions before heading out
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Carry sufficient water and snacks
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Wear comfortable walking shoes
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Keep your phone charged
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
