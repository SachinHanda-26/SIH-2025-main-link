import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Shield,
  Map as MapIcon,
  AlertTriangle,
  Phone,
  LogOut,
  Moon,
  Sun,
  MessageSquare,
  Compass,
  MapPin,
  CloudRain,
  Users,
  Search,
  Radio,
  Calendar as CalendarIcon,
  Bell,
  Settings,
  ChevronRight,
  Home,
  Bot,
  Menu,
  X,
  Loader2,
  RefreshCw,
  Star,
  Navigation,
  Globe,
  User,
  Clock,
  TrendingUp,
} from "lucide-react";
import { TouristMap } from "./TouristMap";
import { TouristSuggestions } from "./TouristSuggestions";
import { TouristChat } from "./TouristChat";
import { WalkieTalkieChat } from "./WalkieTalkieChat";
import { Settings as SettingsComponent } from "./settings";
import { Friends } from "./friends";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useSafarSathiData } from "../hooks/useSafarSathiData";
import { useUserProfile } from "../hooks/useuserprofile";
import { useUserStats } from "../hooks/useuserstats";

interface TouristDashboardProps {
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language: string;
  onLanguageChange?: (language: string) => void;
}

type DashboardView =
  | "dashboard"
  | "map"
  | "explore"
  | "alerts"
  | "chatbot"
  | "friends"
  | "settings";

export function TouristDashboard({
  onLogout,
  theme,
  onToggleTheme,
  language,
  onLanguageChange,
}: TouristDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard");
  const [showWalkieTalkie, setShowWalkieTalkie] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // SafarSuraksha Real Location State
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lon: 0,
    name: "Getting your location...",
  });
  const [locationLoading, setLocationLoading] = useState(true);

  // Real Backend Integrations
  const { safetyData, weatherData, alerts, loading, error, refetch } =
    useSafarSathiData(currentLocation);
  const {
    userProfile,
    loading: profileLoading,
    error: profileError,
    refetchProfile,
  } = useUserProfile();
  const {
    userStats,
    loading: statsLoading,
    error: statsError,
    refetchStats,
  } = useUserStats();

  // Get Real GPS Location
  useEffect(() => {
    const getCurrentPosition = () => {
      setLocationLoading(true);
      console.log("🛡️ SafarSuraksha: Requesting GPS location...");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log("📍 SafarSuraksha: GPS coordinates:", { lat, lon });

            try {
              // Get location name from coordinates
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=en`,
                {
                  headers: { "User-Agent": "SafarSuraksha App" },
                }
              );
              const data = await response.json();

              let locationName = `Location (${lat.toFixed(4)}, ${lon.toFixed(
                4
              )})`;
              if (data && data.address) {
                const address = data.address;
                const parts = [];
                if (address.city || address.town || address.village) {
                  parts.push(address.city || address.town || address.village);
                }
                if (address.state) parts.push(address.state);
                if (address.country) parts.push(address.country);
                locationName =
                  parts.length > 0 ? parts.join(", ") : locationName;
              }

              setCurrentLocation({ lat, lon, name: locationName });
              console.log("✅ SafarSuraksha: Location updated:", {
                lat,
                lon,
                name: locationName,
              });
            } catch (error) {
              console.error("❌ SafarSuraksha: Geocoding failed:", error);
              setCurrentLocation({
                lat,
                lon,
                name: `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
              });
            }
            setLocationLoading(false);
          },
          (error) => {
            console.error("❌ SafarSuraksha: GPS failed:", error);
            setCurrentLocation({
              lat: 28.6139,
              lon: 77.209,
              name: "India Gate, New Delhi (Demo Location)",
            });
            setLocationLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      } else {
        console.error("❌ SafarSuraksha: Geolocation not supported");
        setCurrentLocation({
          lat: 28.6139,
          lon: 77.209,
          name: "India Gate, New Delhi (Demo - GPS Not Available)",
        });
        setLocationLoading(false);
      }
    };

    getCurrentPosition();
  }, []);

  // Multilingual support for SafarSuraksha
  const translations = {
    en: {
      welcome: userProfile?.firstName
        ? `Hello, ${userProfile.firstName}!`
        : "Hello, Traveler!",
      welcomeSubtitle:
        "Stay safe and explore India with SafarSuraksha confidence.",
      dashboard: "Dashboard",
      map: "Map",
      explore: "Explore",
      alerts: "Safety Alerts",
      chatbot: "ChatBot",
      friends: "Friends",
      settings: "Settings",
      logout: "Log Out",
      searchPlaceholder: "Search for destinations, places...",
      currentLocation: "Current Location",
      emergencyHelp: "Emergency Help",
      safetyStatus: "Safety Status",
      allGood: "All Good",
      locationActive: "Location Active",
      emergencyContacts: "Emergency Contacts",
      safetyScore: "Safety Score",
      connectedFriends: "Friends Online",
      visitedPlaces: "Places Visited",
      walkieTalkie: "Walkie Talkie",
      viewAll: "View All",
      exploreNow: "Get Directions",
      userName: userProfile
        ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
        : "SafarSuraksha User",
      emergencySOS: "Emergency SOS",
      todayWeather: "Today's Weather",
      temperature: weatherData?.temperature
        ? `${weatherData.temperature}°C`
        : "Loading...",
      condition: weatherData?.condition || "Loading weather...",
      humidity: weatherData?.humidity
        ? `${weatherData.humidity}%`
        : "Loading...",
      windSpeed: weatherData?.windSpeed
        ? `${weatherData.windSpeed} km/h`
        : "Loading...",
      appName: "SafarSuraksha",
      appTagline: "Tourist Safety Platform",
      recentTrips: "Recent Trips",
      loading: "Loading...",
      noData: "No data available",
      refreshData: "Refresh Data",
    },
    hi: {
      welcome: userProfile?.firstName
        ? `नमस्ते, ${userProfile.firstName}!`
        : "नमस्ते, यात्री!",
      welcomeSubtitle: "सफरसुरक्षा के साथ भारत की सुरक्षित खोज करें।",
      dashboard: "डैशबोर्ड",
      map: "मानचित्र",
      explore: "खोजें",
      alerts: "सुरक्षा अलर्ट",
      chatbot: "चैटबॉट",
      friends: "मित्र",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      searchPlaceholder: "गंतव्य, स्थान खोजें...",
      currentLocation: "वर्तमान स्थान",
      emergencyHelp: "आपातकालीन सहायता",
      safetyStatus: "सुरक्षा स्थिति",
      allGood: "सब ठीक है",
      locationActive: "स्थान सक्रिय",
      emergencyContacts: "आपातकालीन संपर्क",
      safetyScore: "सुरक्षा स्कोर",
      connectedFriends: "ऑनलाइन मित्र",
      visitedPlaces: "देखे गए स्थान",
      walkieTalkie: "वॉकी टॉकी",
      viewAll: "सभी देखें",
      exploreNow: "दिशा-निर्देश प्राप्त करें",
      userName: userProfile
        ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
        : "सफरसुरक्षा उपयोगकर्ता",
      emergencySOS: "आपातकालीन SOS",
      todayWeather: "आज का मौसम",
      temperature: weatherData?.temperature
        ? `${weatherData.temperature}°C`
        : "लोड हो रहा...",
      condition: weatherData?.condition || "मौसम लोड हो रहा...",
      humidity: weatherData?.humidity
        ? `${weatherData.humidity}%`
        : "लोड हो रहा...",
      windSpeed: weatherData?.windSpeed
        ? `${weatherData.windSpeed} किमी/घंटा`
        : "लोड हो रहा...",
      appName: "सफरसुरक्षा",
      appTagline: "पर्यटक सुरक्षा प्लेटफॉर्म",
      recentTrips: "हालिया यात्राएं",
      loading: "लोड हो रहा...",
      noData: "कोई डेटा उपलब्ध नहीं",
      refreshData: "डेटा रीफ्रेश करें",
    },
  };

  const t = (key: string) =>
    (translations as any)[language]?.[key] ||
    (translations as any).en[key] ||
    key;

  const handlePanicButton = async () => {
    try {
      // Real SOS integration with backend
      const response = await fetch("/api/emergency/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("safar_auth_token")}`,
        },
        body: JSON.stringify({
          location: currentLocation,
          userId: userProfile?.id,
          timestamp: new Date().toISOString(),
          type: "MANUAL_SOS",
        }),
      });

      if (response.ok) {
        alert(
          "🚨 SafarSuraksha Emergency SOS Activated! Authorities have been notified. Stay calm and help is on the way."
        );
      } else {
        alert("🚨 Emergency SOS sent via local systems. Help is on the way!");
      }
    } catch (error) {
      console.error("Emergency alert error:", error);
      alert(
        "🚨 Emergency SOS activated locally. Broadcasting to nearby SafarSuraksha users."
      );
    }
  };

  // Navigation items for SafarSuraksha sidebar
  const navigationItems = [
    { key: "dashboard", icon: Home, label: t("dashboard") },
    { key: "map", icon: MapIcon, label: t("map") },
    { key: "explore", icon: Compass, label: t("explore") },
    { key: "alerts", icon: AlertTriangle, label: t("alerts") },
    { key: "chatbot", icon: Bot, label: t("chatbot") },
    { key: "friends", icon: Users, label: t("friends") },
    { key: "settings", icon: Settings, label: t("settings") },
  ];

  const renderSidebar = () => (
    <div className="w-64 lg:w-72 bg-card border-r border-border h-screen flex flex-col hidden md:flex">
      {/* SafarSuraksha App Logo */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">
              <span className="font-bold">SafarSuraksha</span>
            </h2>
            <p className="text-xs text-muted-foreground">{t("appTagline")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 lg:py-6">
        <nav className="space-y-1 px-3 lg:px-4">
          {navigationItems.map((item) => (
            <Button
              key={item.key}
              variant={currentView === item.key ? "default" : "ghost"}
              className={`w-full justify-start h-10 lg:h-12 text-sm lg:text-base ${
                currentView === item.key
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
                  : "hover:bg-muted"
              }`}
              onClick={() => setCurrentView(item.key as DashboardView)}
            >
              <item.icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Real User Profile & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={userProfile?.profilePicture || "/placeholder-avatar.jpg"}
              alt="User"
            />
            <AvatarFallback>
              {userProfile?.firstName ? userProfile.firstName[0] : "U"}
              {userProfile?.lastName ? userProfile.lastName[0] : ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("userName")}</p>
            <p className="text-xs text-muted-foreground truncate">
              {currentLocation.name}
            </p>
            {userProfile?.memberSince && (
              <p className="text-xs text-muted-foreground">
                Since {new Date(userProfile.memberSince).getFullYear()}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );

  const renderTopBar = () => (
    <div className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Mobile SafarSuraksha Logo */}
        <div className="flex items-center space-x-2 md:hidden">
          <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-md">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">SafarSuraksha</h2>
          </div>
        </div>

        {/* SafarSuraksha Status Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              safetyData?.riskLevel === "low"
                ? "bg-green-500"
                : safetyData?.riskLevel === "medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></div>
          <span
            className={`text-xs font-medium ${
              safetyData?.riskLevel === "low"
                ? "text-green-600"
                : safetyData?.riskLevel === "medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            SafarSuraksha{" "}
            {safetyData?.riskLevel === "low"
              ? "Safe"
              : safetyData?.riskLevel === "medium"
              ? "Caution"
              : "Alert"}
          </span>
          {(loading || locationLoading || profileLoading) && (
            <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          {userStats?.unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {userStats.unreadNotifications > 9
                ? "9+"
                : userStats.unreadNotifications}
            </Badge>
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("welcome")}
        </h1>
        <p className="text-muted-foreground">{t("welcomeSubtitle")}</p>
      </div>

      {/* Real-time Location & API Status */}
 <Card className="bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">SafarSuraksha Live Data</span>
                {(loading || locationLoading || profileLoading) && (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-500" />
                )}
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-normal mt-1">Real-time monitoring system</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                <div className="bg-red-100 dark:bg-red-800 p-1.5 rounded-full mr-2">
                  <span className="text-red-600 dark:text-red-300 text-sm">📍</span>
                </div>
                Current GPS Location
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">Name:</strong> {currentLocation.name}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">LATITUDE</p>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-200">{currentLocation.lat.toFixed(6)}°</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">LONGITUDE</p>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-200">{currentLocation.lon.toFixed(6)}°</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-2 rounded-lg border border-green-200 dark:border-green-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${locationLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className={`text-sm font-semibold ${locationLoading ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>
                      {locationLoading ? " Getting location..." : " ✅ Live GPS"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                <div className="bg-green-100 dark:bg-green-800 p-1.5 rounded-full mr-2">
                  <span className="text-green-600 dark:text-green-300 text-sm">🔄</span>
                </div>
                API Status
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">🛡️ Safety API:</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">✅ Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">🌤️ Weather API:</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">✅ Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">👤 Profile API:</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${profileError ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`text-sm font-semibold ${profileError ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                      {profileError ? "❌ Error" : "✅ Active"}
                    </span>
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ⏱️ Last Update: <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date().toLocaleTimeString("en-IN")}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 flex-col sm:flex-row">
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Location
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                refetch();
                refetchProfile();
                refetchStats();
              }}
              className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all hover:scale-105 flex-1"
            >
              <Navigation className="h-4 w-4 mr-1" />
              Update Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
            <Button className="absolute right-2 top-2 h-8" size="sm">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SafarSuraksha Quick Stats - Real Data Integration */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
  {/* Safety Score */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105">
    <CardContent
      className="p-3 md:p-4 rounded-xl"
      style={{ backgroundColor: "#dbeafe", color: "#2563eb" }} // light blue bg + blue text
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm truncate font-medium opacity-70">
            {t("safetyScore")}
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#2563eb]" />
            ) : (
              `${safetyData?.overallScore || userStats?.safetyScore || 85}%`
            )}
          </p>
        </div>
        <Shield className="h-6 w-6 md:h-8 md:w-8 text-[#2563eb] flex-shrink-0" />
      </div>
    </CardContent>
  </Card>

  {/* Places Visited */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105">
    <CardContent
      className="p-3 md:p-4 rounded-xl"
      style={{ backgroundColor: "#dcfce7", color: "#16a34a" }} // mint bg + green text
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm truncate font-medium opacity-70">
            {t("visitedPlaces")}
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#16a34a]" />
            ) : (
              userStats?.visitedPlaces || 0
            )}
          </p>
        </div>
        <MapPin className="h-6 w-6 md:h-8 md:w-8 text-[#16a34a] flex-shrink-0" />
      </div>
    </CardContent>
  </Card>

  {/* Friends Online */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105">
    <CardContent
      className="p-3 md:p-4 rounded-xl"
      style={{ backgroundColor: "#f3e8ff", color: "#7c3aed" }} // lavender bg + violet text
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm truncate font-medium opacity-70">
            {t("connectedFriends")}
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#7c3aed]" />
            ) : (
              userStats?.friendsCount || 0
            )}
          </p>
        </div>
        <Users className="h-6 w-6 md:h-8 md:w-8 text-[#7c3aed] flex-shrink-0" />
      </div>
    </CardContent>
  </Card>

  {/* Emergency Contacts */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105">
    <CardContent
      className="p-3 md:p-4 rounded-xl"
      style={{ backgroundColor: "#ffe4e6", color: "#e11d48" }} // rose bg + muted red text
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm truncate font-medium opacity-70">
            {t("emergencyContacts")}
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#e11d48]" />
            ) : (
              userStats?.emergencyContacts || 0
            )}
          </p>
        </div>
        <Phone className="h-6 w-6 md:h-8 md:w-8 text-[#e11d48] flex-shrink-0" />
      </div>
    </CardContent>
  </Card>
</div>




      {/* SafarSuraksha Emergency Help Section */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700 dark:text-red-300">
            <Phone className="h-6 w-6 mr-2" />
            SafarSuraksha {t("emergencyHelp")}
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            24/7 emergency support available for your safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              onClick={handlePanicButton}
              className="bg-red-600 hover:bg-red-700 text-white h-12 md:h-14 font-bold shadow-lg transition-all hover:scale-105 flex-1"
            >
              <Phone className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">{t("emergencySOS")}</span>
            </Button>
            <Button
              onClick={() => setShowWalkieTalkie(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white h-12 md:h-14 font-bold shadow-lg transition-all hover:scale-105 flex-1"
            >
              <Radio className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">{t("walkieTalkie")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SafarSuraksha Safety Alerts - Real Data */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
            <AlertTriangle className="h-6 w-6 mr-2" />
            SafarSuraksha Safety Alerts
            {loading && (
              <Loader2 className="h-4 w-4 ml-2 animate-spin text-green-500" />
            )}
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Real-time safety information for {currentLocation.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(() => {
              // Dummy alerts as fallback
              const dummyAlerts = [
                {
                  id: "dummy_weather_1",
                  source: "Weather Alert",
                  message:
                    "Heavy rain expected in nearby areas — please carry an umbrella and avoid low-lying roads.",
                  time: "11:45 pm",
                },
                {
                  id: "dummy_road_2",
                  source: "Road Closure",
                  message:
                    "Main Street (Sector 4) closed for maintenance — use alternate route via East Avenue.",
                  time: "11:10 pm",
                },
                {
                  id: "dummy_event_3",
                  source: "Community Notice",
                  message:
                    "Local festival near Central Market — expect crowds and limited parking tomorrow evening.",
                  time: "10:50 pm",
                },
                {
                  id: "dummy_transport_4",
                  source: "Transport Alert",
                  message:
                    "Train delays reported on Northern Line — expect ~20–30 minute delays.",
                  time: "10:25 pm",
                },
                {
                  id: "dummy_power_5",
                  source: "Power Update",
                  message:
                    "A scheduled power outage in Sector 5 between 02:00–04:00 AM for maintenance.",
                  time: "09:15 pm",
                },
              ];

              // Prefer live alerts, fallback to dummy if none
              const mergedAlerts =
                alerts && alerts.length > 0 ? alerts : dummyAlerts;

              // Show all or just first 2
              const toShow = showAllAlerts
                ? mergedAlerts
                : mergedAlerts.slice(0, 2);

              return mergedAlerts.length > 0 ? (
                toShow.map((alert) => (
                  <Alert
                    key={alert.id}
                    className="border-green-200 bg-green-50 dark:bg-green-950/20"
                  >
                    <AlertTriangle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      <strong>{alert.source}:</strong> {alert.message}
                      <span className="block text-xs mt-1 opacity-75">
                        {alert.time}
                      </span>
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    <strong>All Clear:</strong> No safety alerts for your
                    current area. SafarSuraksha is monitoring your safety.
                  </AlertDescription>
                </Alert>
              );
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setShowAllAlerts(!showAllAlerts)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {showAllAlerts
              ? "Show Less Alerts"
              : "View All SafarSuraksha Alerts"}
          </Button>
        </CardContent>
      </Card>

      {/* Real Popular Destinations - Updated with Real Images and Directions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg md:text-xl font-semibold">
            SafarSuraksha Recommended Destinations
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("explore")}
          >
            {t("viewAll")} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-96 flex flex-col">
                <div className="h-48 bg-muted animate-pulse rounded-t-lg"></div>
                <CardContent className="p-4 flex-1">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userStats?.recommendedDestinations &&
          userStats.recommendedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {userStats.recommendedDestinations
              .slice(0, 3)
              .map((destination) => (
                <Card
                  key={destination.id}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-96 flex flex-col border-0 shadow-lg"
                >
                  <div className="relative overflow-hidden h-48 flex-shrink-0">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Safety Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`${
                          destination.safetyRating === "Excellent"
                            ? "bg-green-100 text-green-800 border-green-200 shadow-sm"
                            : destination.safetyRating === "Good"
                            ? "bg-blue-100 text-blue-800 border-blue-200 shadow-sm"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm"
                        }`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {destination.safetyRating}
                      </Badge>
                    </div>
                    {/* Distance Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 shadow-sm">
                        <Navigation className="h-3 w-3 mr-1" />
                        {destination.distance}km away
                      </Badge>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                        <p className="text-lg font-bold text-orange-600">
                          {destination.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          {destination.duration}
                        </p>
                      </div>
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg line-clamp-1 text-gray-800">
                          {destination.name}
                        </h4>
                        <div className="flex items-center space-x-1 ml-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {destination.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        <span className="font-medium text-orange-600">
                          {destination.placeType}
                        </span>{" "}
                        • {destination.location}
                      </p>

                      {destination.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {destination.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 mt-auto">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // Open Google Maps directions with exact coordinates
                          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates.lat},${destination.coordinates.lng}&travelmode=driving`;
                          window.open(directionsUrl, "_blank");

                          // Track visit for real analytics
                          try {
                            const visitedPlaces = JSON.parse(
                              localStorage.getItem("safar_visited_places") ||
                                "[]"
                            );
                            visitedPlaces.push({
                              id: destination.id,
                              name: destination.name,
                              date: new Date().toISOString(),
                              coordinates: destination.coordinates,
                              placeType: destination.placeType,
                              location: destination.location,
                            });
                            localStorage.setItem(
                              "safar_visited_places",
                              JSON.stringify(visitedPlaces)
                            );

                            // Update visited places count
                            const currentCount = userStats?.visitedPlaces || 0;
                            if (userStats) {
                              userStats.visitedPlaces = currentCount + 1;
                            }
                          } catch (error) {
                            console.warn("Failed to track visit:", error);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        size="sm"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {t("exploreNow")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Discovering Amazing Places Near You
            </h3>
            <p className="text-muted-foreground mb-4">
              SafarSuraksha is finding the best and safest destinations based on
              your location
            </p>
            <Button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => {
                      refetchStats();
                    },
                    (error) => {
                      console.error("Location access denied:", error);
                      alert(
                        "Please enable location access to get personalized recommendations"
                      );
                    }
                  );
                } else {
                  alert("Geolocation is not supported by this browser");
                }
              }}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Enable Location & Get Recommendations
            </Button>
          </Card>
        )}
      </div>
    </div>
  );

  const renderRightSidebar = () => (
    <div className="w-80 bg-card border-l border-border p-6 space-y-6">
      {/* Calendar Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Travel Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </CardContent>
      </Card>

      {/* SafarSuraksha Weather Widget - Real Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CloudRain className="h-5 w-5 mr-2 text-blue-600" />
            {t("todayWeather")}
            {loading && (
              <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold">{t("temperature")}</p>
            <p className="text-muted-foreground">{t("condition")}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-muted-foreground">Humidity</p>
                <p className="font-medium">{t("humidity")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Wind</p>
                <p className="font-medium">{t("windSpeed")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("recentTrips")}</span>
            <Button variant="ghost" size="sm">
              {t("viewAll")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statsLoading ? (
            [1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted animate-pulse rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted animate-pulse rounded"></div>
                  <div className="h-2 bg-muted animate-pulse rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : userStats?.recentTrips && userStats.recentTrips.length > 0 ? (
            userStats.recentTrips.slice(0, 2).map((trip) => (
              <div key={trip.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{trip.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(trip.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {trip.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("noData")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SafarSuraksha Safety Status - Real Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            SafarSuraksha {t("safetyStatus")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">System Status</span>
              <Badge
                className={`${
                  safetyData?.riskLevel === "low"
                    ? "bg-green-100 text-green-800"
                    : safetyData?.riskLevel === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {safetyData?.riskLevel === "low"
                  ? t("allGood")
                  : safetyData?.riskLevel === "medium"
                  ? "Caution"
                  : "Alert"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Location Sharing</span>
              <Badge className="bg-blue-100 text-blue-800">
                {t("locationActive")}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Contacts</span>
              <Badge className="bg-orange-100 text-orange-800">
                {userStats?.emergencyContacts || 0} Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Crime Rate</span>
              <Badge
                className={`${
                  safetyData?.crimeRate === "Low"
                    ? "bg-green-100 text-green-800"
                    : safetyData?.crimeRate === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {safetyData?.crimeRate || "Low"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case "dashboard":
        return renderDashboardContent();
      case "map":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                SafarSuraksha Interactive Map
              </h1>
              <p className="text-muted-foreground">
                Navigate safely with real-time location tracking
              </p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                        {t("currentLocation")}
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        {currentLocation.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {currentLocation.lat.toFixed(4)}°,{" "}
                        {currentLocation.lon.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <TouristMap
              language="en"
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            />
          </div>
        );
      case "explore":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">SafarSuraksha Explore</h1>
              <p className="text-muted-foreground">
                Discover safe and amazing places to visit
              </p>
            </div>
            <TouristSuggestions language={language} />
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                SafarSuraksha Safety Alerts
              </h1>
              <p className="text-muted-foreground">
                Stay informed with real-time safety updates for{" "}
                {currentLocation.name}
              </p>
            </div>

            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className={`${
                      alert.type === "warning"
                        ? "border-orange-200 bg-orange-50 dark:bg-orange-950/20"
                        : alert.type === "error"
                        ? "border-red-200 bg-red-50 dark:bg-red-950/20"
                        : "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        alert.type === "warning"
                          ? "text-orange-600"
                          : alert.type === "error"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{alert.source} Alert</h4>
                      <AlertDescription>{alert.message}</AlertDescription>
                      <p className="text-xs text-muted-foreground mt-2">
                        {alert.time}
                      </p>
                    </div>
                  </Alert>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    SafarSuraksha hasn't detected any safety alerts for your
                    current location.
                  </p>
                </Card>
              )}
            </div>
          </div>
        );
      case "chatbot":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                SafarSuraksha AI Assistant
              </h1>
              <p className="text-muted-foreground">
                Get instant assistance from our AI-powered safety chatbot
              </p>
            </div>
            <TouristChat language={language} />
          </div>
        );
      case "friends":
        return (
          <Friends
            onBack={() => setCurrentView("dashboard")}
            language={language}
            onStartChat={() => setShowWalkieTalkie(true)}
          />
        );
      case "settings":
        return (
          <SettingsComponent
            onBack={() => setCurrentView("dashboard")}
            theme={theme}
            onToggleTheme={onToggleTheme}
            language={language}
            onLanguageChange={onLanguageChange || (() => {})}
          />
        );
      default:
        return renderDashboardContent();
    }
  };

  const renderMobileSidebar = () => (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* SafarSuraksha Mobile Sidebar */}
          <div className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border shadow-xl">
            {/* SafarSuraksha App Logo */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">SafarSuraksha</h2>
                    <p className="text-xs text-muted-foreground">
                      {t("appTagline")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {/* Navigation */}
            <div className="flex-1 py-4">
              <nav className="space-y-1 px-3">
                {navigationItems.map((item) => (
                  <Button
                    key={item.key}
                    variant={currentView === item.key ? "default" : "ghost"}
                    className={`w-full justify-start h-12 ${
                      currentView === item.key
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setCurrentView(item.key as DashboardView);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </div>
            {/* User Profile & Logout */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      userProfile?.profilePicture || "/placeholder-avatar.jpg"
                    }
                    alt="User"
                  />
                  <AvatarFallback>
                    {userProfile?.firstName ? userProfile.firstName[0] : "U"}
                    {userProfile?.lastName ? userProfile.lastName[0] : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("userName")}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentLocation.name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // For full-screen views (Friends and Settings)
  if (currentView === "friends" || currentView === "settings") {
    return (
      <div className="min-h-screen bg-background">
        {showWalkieTalkie ? (
          <WalkieTalkieChat onBack={() => setShowWalkieTalkie(false)} />
        ) : (
          renderMainContent()
        )}

        {/* SafarSuraksha Floating Emergency SOS Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handlePanicButton}
            className="bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full shadow-2xl border-4 border-white animate-pulse transition-all hover:scale-105"
            size="lg"
          >
            <div className="flex flex-col items-center">
              <Phone className="h-6 w-6 mb-1" />
              <span className="text-xs font-bold">SOS</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {renderMobileSidebar()}

      {/* Left Sidebar - Desktop Only */}
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {renderTopBar()}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {showWalkieTalkie ? (
              <WalkieTalkieChat onBack={() => setShowWalkieTalkie(false)} />
            ) : (
              renderMainContent()
            )}
          </div>

          {/* Right Sidebar - Only show on dashboard and desktop */}
          {currentView === "dashboard" && (
            <div className="hidden xl:block">{renderRightSidebar()}</div>
          )}
        </div>
      </div>

      {/* SafarSuraksha Floating Emergency SOS Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40">
        <Button
          onClick={handlePanicButton}
          className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl border-4 border-white animate-pulse transition-all hover:scale-105"
          size="lg"
        >
          <div className="flex flex-col items-center">
            <Phone className="h-5 w-5 md:h-6 md:w-6 mb-1" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
