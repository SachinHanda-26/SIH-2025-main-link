import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
  Layers
} from 'lucide-react';

interface Tourist {
  id: number;
  name: string;
  status: string;
  location: string;
  coordinates: string;
  lastUpdate: string;
  riskLevel: string;
}

interface AuthorityMapProps {
  tourists: Tourist[];
}

export function AuthorityMap({ tourists }: AuthorityMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(14);
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [mapLayers, setMapLayers] = useState({
    tourists: true,
    safeZones: true,
    restrictedZones: true,
    emergencyServices: true,
    crowdDensity: true,
    weatherAlerts: false
  });

  // Mock location data for map visualization
  const mapLocations = [
    { x: 45, y: 60, type: 'tourist', id: 1 },
    { x: 30, y: 35, type: 'tourist', id: 2 },
    { x: 65, y: 25, type: 'tourist', id: 3 },
    { x: 55, y: 70, type: 'tourist', id: 4 }
  ];

  const emergencyServices = [
    { x: 20, y: 70, type: 'police', name: 'Police Station - CP' },
    { x: 80, y: 30, type: 'hospital', name: 'AIIMS Hospital' },
    { x: 25, y: 40, type: 'fire', name: 'Fire Station' },
    { x: 70, y: 80, type: 'police', name: 'Police Station - South' }
  ];

  const restrictedZones = [
    { x: 75, y: 20, radius: 40, reason: 'Construction Work', severity: 'medium' },
    { x: 85, y: 80, radius: 30, reason: 'VIP Movement', severity: 'high' },
    { x: 15, y: 15, radius: 35, reason: 'Event Setup', severity: 'low' }
  ];

  const crowdDensityAreas = [
    { x: 30, y: 35, radius: 60, density: 'high', count: 150 },
    { x: 50, y: 45, radius: 80, density: 'medium', count: 75 },
    { x: 65, y: 70, radius: 50, density: 'low', count: 25 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'caution': return 'bg-orange-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEmergencyServiceIcon = (type: string) => {
    switch (type) {
      case 'police': return '👮';
      case 'hospital': return '🏥';
      case 'fire': return '🚒';
      default: return '🆘';
    }
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'high': return 'bg-red-400/40 border-red-500';
      case 'medium': return 'bg-orange-400/40 border-orange-500';
      case 'low': return 'bg-green-400/40 border-green-500';
      default: return 'bg-gray-400/40 border-gray-500';
    }
  };

  const toggleLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const renderTouristDetails = (tourist: Tourist) => (
    <Card className="absolute bottom-4 left-4 right-4 z-20 max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{tourist.name}</CardTitle>
          <Badge className={`${getStatusColor(tourist.status)} text-white`}>
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
          <Button size="sm" variant="outline">
            <Navigation className="h-3 w-3 mr-1" />
            Track
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedTourist(null)}>
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
              className="pl-10 w-64 bg-background shadow-lg"
            />
          </div>
          <Button variant="outline" size="sm" className="bg-background shadow-lg">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="bg-background shadow-lg">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </Button>
          <Button variant="outline" size="sm" className="bg-background shadow-lg">
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
          onClick={() => setZoomLevel(Math.min(18, zoomLevel + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="bg-background shadow-lg"
          onClick={() => setZoomLevel(Math.max(10, zoomLevel - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="bg-background shadow-lg"
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
                <label key={key} className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleLayer(key as keyof typeof mapLayers)}
                    className="rounded"
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div className="h-full w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
        
        {/* Crowd Density Areas */}
        {mapLayers.crowdDensity && crowdDensityAreas.map((area, index) => (
          <div
            key={`density-${index}`}
            className={`absolute border-2 rounded-full ${getDensityColor(area.density)}`}
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
              width: `${area.radius}px`,
              height: `${area.radius}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
              👥{area.count}
            </div>
          </div>
        ))}

        {/* Restricted Zones */}
        {mapLayers.restrictedZones && restrictedZones.map((zone, index) => (
          <div
            key={`restricted-${index}`}
            className={`absolute border-2 rounded-full ${
              zone.severity === 'high' ? 'border-red-500 bg-red-200/30' :
              zone.severity === 'medium' ? 'border-orange-500 bg-orange-200/30' :
              'border-yellow-500 bg-yellow-200/30'
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.radius}px`,
              height: `${zone.radius}px`,
              transform: 'translate(-50%, -50%)'
            }}
            title={zone.reason}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </div>
        ))}

        {/* Emergency Services */}
        {mapLayers.emergencyServices && emergencyServices.map((service, index) => (
          <div
            key={`emergency-${index}`}
            className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${service.x}%`, top: `${service.y}%` }}
            title={service.name}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
              {getEmergencyServiceIcon(service.type)}
            </div>
          </div>
        ))}

        {/* Tourist Markers */}
        {mapLayers.tourists && mapLocations.map((location, index) => {
          const tourist = tourists.find(t => t.id === location.id);
          if (!tourist) return null;
          
          return (
            <div
              key={`tourist-${location.id}`}
              className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onClick={() => setSelectedTourist(tourist)}
            >
              <div className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getStatusColor(tourist.status)}`}>
                <Users className="h-5 w-5 text-white" />
              </div>
              
              {/* Pulsing animation for active tourists */}
              <div className={`absolute inset-0 w-10 h-10 rounded-full ${getStatusColor(tourist.status)} animate-ping opacity-30`}></div>
              
              {/* Tourist name label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                {tourist.name}
              </div>
            </div>
          );
        })}

        {/* Command Center Location */}
        <div 
          className="absolute z-10"
          style={{ left: '50%', top: '10%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-12 h-12 bg-blue-800 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg font-semibold">
            Command Center
          </div>
        </div>

        {/* Map Grid (for visual reference) */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="absolute top-4 right-4 z-10 max-w-xs">
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Active Tourists:</span>
                <Badge className="bg-green-100 text-green-800">{tourists.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Safe Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  {tourists.filter(t => t.status === 'safe').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Needs Attention:</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {tourists.filter(t => t.status === 'caution').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Emergency:</span>
                <Badge className="bg-red-100 text-red-800">
                  {tourists.filter(t => t.status === 'emergency').length}
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
}