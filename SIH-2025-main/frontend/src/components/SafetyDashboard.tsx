import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Shield,
  AlertTriangle,
  CloudRain,
  Flame,
  Droplets,
  Car,
  Heart,
  Wind,
  MapPin,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Eye,
  Clock,
  Users,
  Zap,
  Thermometer,
  Gauge,
  Navigation,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import {
  fetchSafetyProfile,
  fetchEnvironmentalData,
  fetchCrimeData,
  SafetyProfile,
  EnvironmentalData,
  CrimeData
} from "../service/api";

interface SafetyDashboardProps {
  lat: number;
  lon: number;
  locationName?: string;
}

export function SafetyDashboard({ lat, lon, locationName = "Current Location" }: SafetyDashboardProps) {
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [crimeData, setCrimeData] = useState<CrimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch comprehensive safety profile
      const [safety, environmental, crime] = await Promise.allSettled([
        fetchSafetyProfile(lat, lon, 5, 30, {
          includeWeather: true,
          includeCrime: true,
          includeDisaster: true,
          includeTraffic: true,
          includeHealth: true,
          includeEnvironmental: true,
          activityType: 'general'
        }),
        fetchEnvironmentalData(lat, lon, 10, 7),
        fetchCrimeData(lat, lon, 1, 30)
      ]);

      if (safety.status === 'fulfilled') {
        setSafetyProfile(safety.value);
      }
      if (environmental.status === 'fulfilled') {
        setEnvironmentalData(environmental.value);
      }
      if (crime.status === 'fulfilled') {
        setCrimeData(crime.value);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch safety data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [lat, lon]);

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200 font-medium';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 font-medium';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 font-medium';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 font-medium';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 font-medium';
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'low': return <Info className="h-5 w-5 text-blue-600" />;
      default: return <CheckCircle className="h-5 w-5 text-green-600" />;
    };
  };

  const getAirQualityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'good': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'unhealthy_sensitive': return 'text-orange-600';
      case 'unhealthy': return 'text-red-600';
      case 'very_unhealthy': return 'text-red-700';
      case 'hazardous': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading safety data...</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-900">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Error loading safety data</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">{error}</p>
          <Button onClick={fetchAllData} variant="outline" className="mt-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-full dark:bg-blue-900/30">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Safety Dashboard</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {locationName} ({lat.toFixed(4)}, {lon.toFixed(4)})
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAllData} className="gap-2 h-9">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overall Safety Score */}
      {safetyProfile && (
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-full dark:bg-blue-900/30">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Overall Safety Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className={`text-3xl font-bold ${getSafetyScoreColor(safetyProfile.overallSafetyScore)}`}>
                  {safetyProfile.overallSafetyScore}/100
                </div>
                <p className="text-sm text-muted-foreground font-medium">Safety Score</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <Badge className={`${getRiskLevelColor(safetyProfile.riskLevel)} text-sm px-3 py-1.5`}>
                  {safetyProfile.riskLevel.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground font-medium mt-1">Risk Level</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="text-sm flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium mt-1">Last Updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Data */}
      {environmentalData && (
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900/30">
                <Wind className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              Environmental Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Air Quality */}
              {environmentalData.airQuality && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Air Quality</span>
                    <Badge className={`${getAirQualityColor(environmentalData.airQuality.level)} bg-transparent border`}>
                      {environmentalData.airQuality.level.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{environmentalData.airQuality.aqi}</div>
                  <div className="text-xs text-gray-600">
                    PM2.5: {environmentalData.airQuality.pollutants.pm25 || 'N/A'} | 
                    PM10: {environmentalData.airQuality.pollutants.pm10 || 'N/A'}
                  </div>
                </div>
              )}

              {/* Fire Data */}
              {environmentalData.fireData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fire Risk</span>
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold">{environmentalData.fireData.totalFires}</div>
                  <div className="text-xs text-gray-600">
                    High Confidence: {environmentalData.fireData.highConfidenceFires}
                  </div>
                </div>
              )}

              {/* Flood Data */}
              {environmentalData.floodData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Flood Risk</span>
                    <Droplets className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{environmentalData.floodData.totalFloods}</div>
                  <div className="text-xs text-gray-600">
                    High Risk: {environmentalData.floodData.highRiskFloods}
                  </div>
                </div>
              )}

              {/* Weather Alerts */}
              {environmentalData.weatherAlerts && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Weather Alerts</span>
                    <CloudRain className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{environmentalData.weatherAlerts.activeAlerts}</div>
                  <div className="text-xs text-gray-600">
                    Total: {environmentalData.weatherAlerts.totalAlerts}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crime Data */}
      {crimeData && (
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-red-100 p-1.5 rounded-full dark:bg-red-900/30">
                <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              Crime Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">{crimeData.safetyScore}/100</div>
                <p className="text-sm text-muted-foreground font-medium">Crime Safety Score</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">{crimeData.statistics.total}</div>
                <p className="text-sm text-muted-foreground font-medium">Total Incidents (30 days)</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">{crimeData.statistics.recent}</div>
                <p className="text-sm text-muted-foreground font-medium">Recent Incidents</p>
              </div>
            </div>
            
            {/* Crime Types */}
            {Object.keys(crimeData.statistics.byType).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Crime Types</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(crimeData.statistics.byType).map(([type, count]) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {(safetyProfile?.alerts.length || environmentalData?.alerts.length || crimeData?.alerts.length) && (
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-orange-100 p-1.5 rounded-full dark:bg-orange-900/30">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Safety Profile Alerts */}
              {safetyProfile?.alerts.map((alert, index) => (
                <Alert key={`safety-${index}`} className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-1.5 rounded-full dark:bg-orange-900/30 flex-shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium text-orange-800 dark:text-orange-300">{alert.message}</div>
                        {alert.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Recommendations:</p>
                            <ul className="text-sm list-disc list-inside mt-1 text-orange-700 dark:text-orange-300">
                              {alert.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}

              {/* Environmental Alerts */}
              {environmentalData?.alerts.map((alert, index) => (
                <Alert key={`env-${index}`} className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1.5 rounded-full dark:bg-blue-900/30 flex-shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium text-blue-800 dark:text-blue-300">{alert.message}</div>
                        {alert.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Recommendations:</p>
                            <ul className="text-sm list-disc list-inside mt-1 text-blue-700 dark:text-blue-300">
                              {alert.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}

              {/* Crime Alerts */}
              {crimeData?.alerts.map((alert, index) => (
                <Alert key={`crime-${index}`} className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-1.5 rounded-full dark:bg-red-900/30 flex-shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium text-red-800 dark:text-red-300">{alert.message}</div>
                        {alert.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">Recommendations:</p>
                            <ul className="text-sm list-disc list-inside mt-1 text-red-700 dark:text-red-300">
                              {alert.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {safetyProfile?.recommendations.length && (
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              Safety Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {safetyProfile.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-sm">
                  <div className="bg-green-100 p-1 rounded-full dark:bg-green-900/30 mr-2.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  </div>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Data Sources */}
      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-purple-100 p-1.5 rounded-full dark:bg-purple-900/30">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
              <div className="bg-blue-100 p-1.5 rounded-full dark:bg-blue-900/30">
                <CloudRain className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Weather</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
              <div className="bg-red-100 p-1.5 rounded-full dark:bg-red-900/30">
                <Shield className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium">Crime</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
              <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900/30">
                <Wind className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Environmental</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
              <div className="bg-orange-100 p-1.5 rounded-full dark:bg-orange-900/30">
                <Car className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-medium">Traffic</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
