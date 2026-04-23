import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  CloudRain,
  Car,
  Heart,
  Wind,
  Shield,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  fetchSafetyProfile,
  fetchEnvironmentalAlerts,
  fetchDisasterAlerts,
  fetchTrafficAlerts,
  fetchHealthAlerts,
} from "../service/api";

interface AlertsViewProps {
  lat: number;
  lon: number;
  locationName?: string;
}

interface AlertItem {
  id: string;
  type: string;
  severity: string;
  message: string;
  recommendations: string[];
  source: string;
  timestamp: string;
  category: 'weather' | 'crime' | 'disaster' | 'traffic' | 'health' | 'environmental' | 'general';
}

export function AlertsView({ lat, lon, locationName = "Current Location" }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAllAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [safetyProfile, environmentalAlerts, disasterAlerts, trafficAlerts, healthAlerts] = await Promise.allSettled([
        fetchSafetyProfile(lat, lon, 5, 30, {
          includeWeather: true,
          includeCrime: true,
          includeDisaster: true,
          includeTraffic: true,
          includeHealth: true,
          includeEnvironmental: true,
          activityType: 'general'
        }),
        fetchEnvironmentalAlerts(lat, lon, 10, 7),
        fetchDisasterAlerts(lat, lon, 10, 7),
        fetchTrafficAlerts(lat, lon, 5, 7),
        fetchHealthAlerts(lat, lon, 50, 30)
      ]);

      const allAlerts: AlertItem[] = [];

      // Process safety profile alerts
      if (safetyProfile.status === 'fulfilled' && safetyProfile.value.alerts) {
        safetyProfile.value.alerts.forEach((alert, index) => {
          allAlerts.push({
            id: `safety-${index}`,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            recommendations: alert.recommendations,
            source: 'Safety Profile',
            timestamp: safetyProfile.value.lastUpdated,
            category: 'general'
          });
        });
      }

      // Process environmental alerts
      if (environmentalAlerts.status === 'fulfilled' && environmentalAlerts.value.alerts) {
        environmentalAlerts.value.alerts.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `env-${index}`,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            recommendations: alert.recommendations,
            source: 'Environmental',
            timestamp: environmentalAlerts.value.lastUpdated,
            category: 'environmental'
          });
        });
      }

      // Process disaster alerts
      if (disasterAlerts.status === 'fulfilled' && disasterAlerts.value.alerts) {
        disasterAlerts.value.alerts.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `disaster-${index}`,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            recommendations: alert.recommendations,
            source: 'Disaster',
            timestamp: disasterAlerts.value.lastUpdated,
            category: 'disaster'
          });
        });
      }

      // Process traffic alerts
      if (trafficAlerts.status === 'fulfilled' && trafficAlerts.value.alerts) {
        trafficAlerts.value.alerts.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `traffic-${index}`,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            recommendations: alert.recommendations,
            source: 'Traffic',
            timestamp: trafficAlerts.value.lastUpdated,
            category: 'traffic'
          });
        });
      }

      // Process health alerts
      if (healthAlerts.status === 'fulfilled' && healthAlerts.value.alerts) {
        healthAlerts.value.alerts.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `health-${index}`,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            recommendations: alert.recommendations,
            source: 'Health',
            timestamp: healthAlerts.value.lastUpdated,
            category: 'health'
          });
        });
      }

      // Sort alerts by severity (critical > high > medium > low)
      const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      allAlerts.sort((a, b) => {
        const aOrder = severityOrder[a.severity as keyof typeof severityOrder] ?? 4;
        const bOrder = severityOrder[b.severity as keyof typeof severityOrder] ?? 4;
        return aOrder - bOrder;
      });

      setAlerts(allAlerts);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAlerts();
  }, [lat, lon]);

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return <CloudRain className="h-4 w-4" />;
      case 'crime': return <Shield className="h-4 w-4" />;
      case 'disaster': return <AlertTriangle className="h-4 w-4" />;
      case 'traffic': return <Car className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'environmental': return <Wind className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weather': return 'text-blue-600';
      case 'crime': return 'text-red-600';
      case 'disaster': return 'text-orange-600';
      case 'traffic': return 'text-yellow-600';
      case 'health': return 'text-green-600';
      case 'environmental': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.category === filter);

  const alertCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity.toLowerCase() === 'critical').length,
    high: alerts.filter(a => a.severity.toLowerCase() === 'high').length,
    medium: alerts.filter(a => a.severity.toLowerCase() === 'medium').length,
    low: alerts.filter(a => a.severity.toLowerCase() === 'low').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading alerts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="ml-2" onClick={fetchAllAlerts}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Safety Alerts</h2>
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {locationName} ({lat.toFixed(4)}, {lon.toFixed(4)})
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAllAlerts}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Alert Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alert Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{alertCounts.all}</div>
              <p className="text-sm text-gray-600">Total Alerts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{alertCounts.high}</div>
              <p className="text-sm text-gray-600">High</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{alertCounts.medium}</div>
              <p className="text-sm text-gray-600">Medium</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{alertCounts.low}</div>
              <p className="text-sm text-gray-600">Low</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({alertCounts.all})
        </Button>
        <Button
          variant={filter === 'critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('critical')}
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          Critical ({alertCounts.critical})
        </Button>
        <Button
          variant={filter === 'high' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('high')}
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          High ({alertCounts.high})
        </Button>
        <Button
          variant={filter === 'medium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('medium')}
          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          Medium ({alertCounts.medium})
        </Button>
        <Button
          variant={filter === 'low' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('low')}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Low ({alertCounts.low})
        </Button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No safety alerts for this location. You\'re all set!' 
                : `No ${filter} severity alerts for this location.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert: AlertItem) => (
            <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start">
                {getSeverityIcon(alert.severity)}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.severity}
                      </Badge>
                      <div className={`flex items-center gap-1 text-xs ${getCategoryColor(alert.category)}`}>
                        {getCategoryIcon(alert.category)}
                        {alert.category.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <AlertDescription>
                    <div className="font-medium mb-2">{alert.message}</div>
                    
                    {alert.recommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Recommendations:</p>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {alert.recommendations.map((rec, i) => (
                            <li key={i} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Source: {alert.source}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
}
