import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Shield,
  Users,
  Map as MapIcon,
  MessageSquare,
  AlertTriangle,
  LogOut,
  Moon,
  Sun,
  Eye,
  MapPin,
  Clock,
  Phone,
  Radio,
  TrendingUp,
  Zap,
  CloudRain,
  Navigation,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  BadgeCheck as IdentificationBadge,
  CloudLightning,
  Wind,
} from "lucide-react";
import AuthorityMap from "./AuthorityMap";
import { AuthorityChat } from "./AuthorityChat";

interface AuthorityDashboardProps {
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onNavigate: (page: string) => void; // <-- add this
}

type DashboardView = "overview" | "map" | "chat" | "alerts" | "walkie";

export function AuthorityDashboard({
  onLogout,
  theme,
  onToggleTheme,
  onNavigate, // <-- add this
}: AuthorityDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [selectedTourist, setSelectedTourist] = useState<number | null>(null);

  // REMOVE: const navigate = useNavigate();

  // Mock data for tourists
  const activeTourists = [
    {
      id: 1,
      name: "Rahul Sharma",
      status: "safe",
      location: "India Gate",
      coordinates: "28.6129°N, 77.2295°E",
      lastUpdate: "2 mins ago",
      riskLevel: "low",
      phone: "+91 9876543210",
      emergencyContact: "Priya Sharma (+91 9876543211)",
      checkInTime: "09:30 AM",
      plannedRoute: "India Gate → Red Fort → Chandni Chowk",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      status: "safe",
      location: "Red Fort",
      coordinates: "28.6562°N, 77.2410°E",
      lastUpdate: "1 min ago",
      riskLevel: "low",
      phone: "+1 555-0123",
      emergencyContact: "John Johnson (+1 555-0124)",
      checkInTime: "10:15 AM",
      plannedRoute: "Red Fort → Jama Masjid → Lotus Temple",
    },
    {
      id: 3,
      name: "Akiko Tanaka",
      status: "caution",
      location: "Chandni Chowk",
      coordinates: "28.6506°N, 77.2334°E",
      lastUpdate: "5 mins ago",
      riskLevel: "medium",
      phone: "+81 90-1234-5678",
      emergencyContact: "Embassy of Japan (+81 3-3234-5678)",
      checkInTime: "08:45 AM",
      plannedRoute: "Chandni Chowk → Raj Ghat → Akshardham",
    },
    {
      id: 4,
      name: "Michael Chen",
      status: "safe",
      location: "Humayun's Tomb",
      coordinates: "28.5933°N, 77.2507°E",
      lastUpdate: "3 mins ago",
      riskLevel: "low",
      phone: "+65 9123-4567",
      emergencyContact: "Lisa Chen (+65 9123-4568)",
      checkInTime: "11:00 AM",
      plannedRoute: "Humayun's Tomb → Lotus Temple → Qutub Minar",
    },
  ];

  // Mock alerts data
  const systemAlerts = [
    {
      id: 1,
      type: "weather",
      severity: "medium",
      title: "Heavy Rain Warning",
      description:
        "Thunderstorm expected in Central Delhi. Tourist advisory issued.",
      time: "15 mins ago",
      affectedArea: "Central Delhi",
      touristsAffected: 12,
      status: "active",
    },
    {
      id: 2,
      type: "crowd",
      severity: "low",
      title: "High Tourist Density",
      description:
        "Unusual crowd buildup at Red Fort due to special exhibition.",
      time: "30 mins ago",
      affectedArea: "Red Fort",
      touristsAffected: 8,
      status: "monitoring",
    },
    {
      id: 3,
      type: "emergency",
      severity: "high",
      title: "Medical Emergency Resolved",
      description:
        "Tourist assistance completed. Medical team responded in 3 minutes.",
      time: "1 hour ago",
      affectedArea: "Connaught Place",
      touristsAffected: 1,
      status: "resolved",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500";
      case "caution":
        return "bg-orange-500";
      case "emergency":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50 dark:bg-red-950/20";
      case "medium":
        return "border-orange-200 bg-orange-50 dark:bg-orange-950/20";
      case "low":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20";
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const renderHeader = () => (
    <header className="bg-background border-b px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Authority Control Center</h1>
            <p className="text-sm text-muted-foreground">
              Delhi Tourism Safety Division
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigate("blockchain")}
            variant="outline"
            className="flex items-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50 hover:border-blue-500 rounded-full px-5 py-2 shadow-sm transition-all"
          >
            <Shield className="h-4 w-4" />
            Blockchain
          </Button>

          <Button
            onClick={() => onNavigate("mesh-network")}
            variant="outline"
            className="flex items-center gap-2 border-green-400 text-green-700 hover:bg-green-50 hover:border-green-500 rounded-full px-5 py-2 shadow-sm transition-all"
          >
            <Radio className="h-4 w-4" />
            Mesh Network
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <AlertTriangle className="h-4 w-4" />
            Broadcast Alert
          </Button>
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 flex items-center gap-1.5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
            System Active
          </Badge>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={onToggleTheme}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Active Tourists
              </p>
              <p className="text-2xl font-semibold">147</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12 from yesterday
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Safety Incidents
              </p>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
                2 resolved today
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-full dark:bg-orange-900/30">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Response Time
              </p>
              <p className="text-2xl font-semibold">2.3m</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                -0.5m improvement
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Zones Monitored
              </p>
              <p className="text-2xl font-semibold">24</p>
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                Full coverage
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTouristOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Active Tourist Monitoring
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tourist Status Dashboard</CardTitle>
          <CardDescription>
            Real-time monitoring of registered tourists in Delhi region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tourist</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTourists.map((tourist) => (
                <TableRow
                  key={tourist.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-9 h-9 border-2 border-background">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {tourist.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tourist.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <IdentificationBadge className="h-3 w-3" />
                          TUR_{tourist.id.toString().padStart(3, "0")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tourist.status
                      )} text-white shadow-sm`}
                    >
                      {tourist.status === "safe" && (
                        <Shield className="h-3 w-3 mr-1.5" />
                      )}
                      {tourist.status === "caution" && (
                        <AlertTriangle className="h-3 w-3 mr-1.5" />
                      )}
                      {tourist.status === "emergency" && (
                        <AlertCircle className="h-3 w-3 mr-1.5" />
                      )}
                      {tourist.status.charAt(0).toUpperCase() +
                        tourist.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        <span className="font-medium">{tourist.location}</span>
                      </div>
                      <span className="text-xs text-muted-foreground pl-5">
                        {tourist.coordinates}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{tourist.lastUpdate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        tourist.riskLevel === "low"
                          ? "bg-green-100 text-green-800"
                          : tourist.riskLevel === "medium"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tourist.riskLevel === "low" && (
                        <Shield className="h-3 w-3 mr-1" />
                      )}
                      {tourist.riskLevel === "medium" && (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {tourist.riskLevel === "high" && (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {tourist.riskLevel.charAt(0).toUpperCase() +
                        tourist.riskLevel.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedTourist(tourist.id)}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Phone className="h-4 w-4 text-orange-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tourist Details Modal */}
      {selectedTourist && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tourist Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTourist(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const tourist = activeTourists.find(
                (t) => t.id === selectedTourist
              );
              if (!tourist) return null;
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Information
                      </p>
                      <p className="font-medium">{tourist.phone}</p>
                      <p className="text-sm">
                        Emergency: {tourist.emergencyContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Check-in Time
                      </p>
                      <p className="font-medium">{tourist.checkInTime}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Planned Route
                      </p>
                      <p className="font-medium">{tourist.plannedRoute}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      Call Tourist
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Send Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="h-3 w-3 mr-2" />
                      Track Location
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAlertsPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          System Alerts & Monitoring
        </h2>
        <Button size="sm" variant="outline" className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Refresh Alerts
        </Button>
      </div>

      <div className="grid gap-4">
        {systemAlerts.map((alert) => (
          <Alert
            key={alert.id}
            className={`${getSeverityColor(
              alert.severity
            )} shadow-sm hover:shadow transition-shadow`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-start space-x-3">
                {alert.type === "weather" && (
                  <div className="bg-blue-100 p-1.5 rounded-full dark:bg-blue-900/30">
                    <CloudRain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                {alert.type === "crowd" && (
                  <div className="bg-orange-100 p-1.5 rounded-full dark:bg-orange-900/30">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                )}
                {alert.type === "emergency" && (
                  <div className="bg-red-100 p-1.5 rounded-full dark:bg-red-900/30">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <Badge
                      className={`${
                        alert.status === "active"
                          ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300"
                          : alert.status === "monitoring"
                          ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300"
                          : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {alert.status === "active" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        )}
                        {alert.status === "monitoring" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                        )}
                        {alert.status === "resolved" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        )}
                        {alert.status.charAt(0).toUpperCase() +
                          alert.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                  <AlertDescription className="text-sm mb-2">
                    {alert.description}
                  </AlertDescription>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{alert.affectedArea}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{alert.touristsAffected} tourists affected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                >
                  <Eye className="h-3 w-3" />
                  View Details
                </Button>
                {alert.status === "active" && (
                  <Button size="sm" className="h-8 text-xs gap-1.5">
                    <RefreshCw className="h-3 w-3" />
                    Respond
                  </Button>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {/* Weather Widget */}
      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-blue-100 p-1.5 rounded-full dark:bg-blue-900/30">
              <CloudRain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Weather Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-2 bg-blue-50 rounded-lg dark:bg-blue-900/10">
              <p className="text-sm text-muted-foreground mb-1">Current</p>
              <div className="flex items-center justify-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                <p className="text-lg font-semibold">26°C</p>
              </div>
              <p className="text-xs mt-1">Clear Skies</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg dark:bg-red-900/10">
              <p className="text-sm text-muted-foreground mb-1">Next 3 Hours</p>
              <div className="flex items-center justify-center gap-2">
                <CloudLightning className="h-5 w-5 text-red-500" />
                <p className="text-lg font-semibold">Storm</p>
              </div>
              <p className="text-xs mt-1 text-red-600 font-medium">
                High Priority Alert
              </p>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-lg dark:bg-amber-900/10">
              <p className="text-sm text-muted-foreground mb-1">Air Quality</p>
              <div className="flex items-center justify-center gap-2">
                <Wind className="h-5 w-5 text-amber-500" />
                <p className="text-lg font-semibold">Moderate</p>
              </div>
              <p className="text-xs mt-1">AQI: 89</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case "overview":
        return renderTouristOverview();
      case "map":
        return <AuthorityMap />;
      case "chat":
        return <AuthorityChat />;
      case "walkie":
        return renderWalkieEmergency();
      case "alerts":
        return renderAlertsPanel();
      default:
        return renderTouristOverview();
    }
  };

  const renderWalkieEmergency = (): JSX.Element => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Radio className="h-5 w-5 text-red-600" />
          Emergency Communications
        </h2>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
        >
          <AlertTriangle className="h-4 w-4" />
          Broadcast Emergency
        </Button>
      </div>

      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-red-100 p-1.5 rounded-full dark:bg-red-900/30">
              <Radio className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            Walkie-Talkie Emergency Channel
          </CardTitle>
          <CardDescription>
            Real-time emergency communications with field personnel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 flex items-center gap-2">
            <div className="bg-red-100 p-1 rounded-full dark:bg-red-900/30">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <AlertDescription className="font-medium">
              Emergency channel is active. All communications are recorded and
              prioritized.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 border-2 border-red-200">
                <AvatarFallback className="bg-red-100 text-red-800 font-medium">
                  OP
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium">Officer Patel</p>
                    <span className="text-xs text-muted-foreground">
                      • 2 mins ago
                    </span>
                    <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-1.5 py-0 h-4">
                      Emergency
                    </Badge>
                  </div>
                  <p>
                    Team Alpha in position at Red Fort. Tourist group of 15
                    secured.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 border-2 border-blue-200">
                <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                  CC
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium">Control Center</p>
                    <span className="text-xs text-muted-foreground">
                      • 1 min ago
                    </span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-1.5 py-0 h-4">
                      Command
                    </Badge>
                  </div>
                  <p>
                    Roger that. Medical team dispatched to your location. ETA 3
                    minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 border-2 border-green-200">
                <AvatarFallback className="bg-green-100 text-green-800 font-medium">
                  MT
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium">Medical Team</p>
                    <span className="text-xs text-muted-foreground">
                      • Just now
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-1.5 py-0 h-4">
                      Medical
                    </Badge>
                  </div>
                  <p>
                    En route to Red Fort. Please prepare a clear access point
                    for the ambulance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white gap-2">
              <Radio className="h-4 w-4 animate-pulse" />
              Push to Talk
            </Button>
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4 text-green-600" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}

      <div className="p-6">
        {renderStatsCards()}

      <Tabs
  value={currentView}
  onValueChange={(value) => setCurrentView(value as DashboardView)}
>
  <TabsList className="mb-6 p-1 bg-slate-100 dark:bg-slate-900/80 flex rounded-lg">
    <TabsTrigger value="overview">
      <Button
        variant={currentView === "overview" ? "default" : "outline"}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
      >
        <Users className="h-4 w-4 text-blue-600" />
        Tourist Overview
      </Button>
    </TabsTrigger>

    <TabsTrigger value="map">
      <Button
        variant={currentView === "map" ? "default" : "outline"}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
      >
        <MapIcon className="h-4 w-4 text-green-600" />
        Monitoring Map
      </Button>
    </TabsTrigger>

    <TabsTrigger value="chat">
      <Button
        variant={currentView === "chat" ? "default" : "outline"}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
      >
        <MessageSquare className="h-4 w-4 text-purple-600" />
        Authority Chat
      </Button>
    </TabsTrigger>

    <TabsTrigger value="walkie">
      <Button
        variant={currentView === "walkie" ? "default" : "outline"}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
      >
        <Radio className="h-4 w-4 text-red-600" />
        Emergency Comms
      </Button>
    </TabsTrigger>

    <TabsTrigger value="alerts">
      <Button
        variant={currentView === "alerts" ? "default" : "outline"}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
      >
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        Alerts Panel
      </Button>
    </TabsTrigger>
  </TabsList>

  <TabsContent value={currentView}>{renderMainContent()}</TabsContent>
</Tabs>


      </div>
    </div>
  );
}
