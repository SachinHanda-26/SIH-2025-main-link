import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  Radio,
  Send,
  Mic,
  MicOff,
  Users,
  Shield,
  AlertTriangle,
  MapPin,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Clock,
  User,
  Plus,
  Settings,
  Wifi,
  WifiOff,
  PhoneCall,
  MessageSquare,
  Volume2,
  VolumeX,
  RefreshCw,
  Crosshair,
  Navigation,
  Globe,
  Loader2,
  Circle
} from 'lucide-react';
import { useWalkieTalkie } from '../hooks/useWalkieTalkie';

interface WalkieTalkieChatProps {
  onBack: () => void;
  language?: string;
}

interface Message {
  id: string;
  fromUserId: string;
  fromUserName?: string;
  message: string;
  messageType: 'TEXT' | 'EMERGENCY' | 'LOCATION' | 'VOICE_NOTE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  timestamp: Date;
  isEmergency: boolean;
  channelId?: string;
  reactions?: Array<{ userId: string; reaction: string; timestamp: Date }>;
  location?: { lat: number; lon: number };
  hotspotId?: string;
}

interface Channel {
  channelId: string;
  name: string;
  userCount: number;
}

interface NearbyUser {
  userId: string;
  firstName: string;
  lastName: string;
  distance?: string;
  lastSeen?: Date;
}

export function WalkieTalkieChat({ onBack, language = 'en' }: WalkieTalkieChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Use the walkie-talkie hook for real backend integration
  const {
    isConnected,
    isAuthenticated,
    connectionStatus,
    hotspotId,
    activeUsers,
    signalStrength,
    connect,
    disconnect,
    sendMessage: sendWalkieMessage,
    joinChannel,
    leaveChannel,
    createChannel,
    discoverNearbyUsers,
    discoverChannels,
    updateLocation,
    sendEmergencyMessage,
    error: walkieError,
    loading
  } = useWalkieTalkie();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLAudioElement>(null);

  const translations = {
    en: {
      walkieTalkie: "SafarSuraksha Walkie-Talkie",
      connecting: "Connecting to local network...",
      connected: "Connected to hotspot",
      disconnected: "Disconnected",
      noConnection: "No local network found",
      emergencyMode: "Emergency Broadcasting",
      broadcastMode: "Broadcast Mode",
      channelMode: "Channel Mode",
      nearbyUsers: "Nearby Users",
      activeChannels: "Active Channels",
      createChannel: "Create Channel",
      joinChannel: "Join",
      leaveChannel: "Leave",
      sendMessage: "Send Message",
      typeMessage: "Type your message...",
      emergencyMessage: "Emergency Message",
      emergencySOS: "SOS Emergency",
      noUsers: "No users nearby",
      noChannels: "No active channels",
      userJoined: "joined",
      userLeft: "left",
      messageSent: "Message sent",
      messageReceived: "New message",
      connectionError: "Connection failed",
      locationRequired: "Location access required",
      enableLocation: "Enable Location",
      refreshing: "Refreshing...",
      retry: "Retry Connection",
      soundOn: "Sound On",
      soundOff: "Sound Off",
      signalStrength: "Signal Strength",
      hotspotId: "Network ID",
      lastSeen: "Last seen",
      now: "now",
      minutesAgo: "min ago",
      emergency: "Emergency",
      broadcast: "Broadcast",
      channel: "Channel",
      you: "You"
    },
    hi: {
      walkieTalkie: "सफरसुरक्षा वॉकी-टॉकी",
      connecting: "स्थानीय नेटवर्क से जुड़ रहे हैं...",
      connected: "हॉटस्पॉट से जुड़े",
      disconnected: "डिस्कनेक्ट",
      noConnection: "कोई स्थानीय नेटवर्क नहीं मिला",
      emergencyMode: "आपातकालीन प्रसारण",
      broadcastMode: "प्रसारण मोड",
      channelMode: "चैनल मोड",
      nearbyUsers: "आस-पास के उपयोगकर्ता",
      activeChannels: "सक्रिय चैनल",
      createChannel: "चैनल बनाएं",
      joinChannel: "जुड़ें",
      leaveChannel: "छोड़ें",
      sendMessage: "संदेश भेजें",
      typeMessage: "अपना संदेश टाइप करें...",
      emergencyMessage: "आपातकालीन संदेश",
      emergencySOS: "SOS आपात",
      noUsers: "आस-पास कोई उपयोगकर्ता नहीं",
      noChannels: "कोई सक्रिय चैनल नहीं",
      userJoined: "जुड़े",
      userLeft: "छोड़े",
      messageSent: "संदेश भेजा गया",
      messageReceived: "नया संदेश",
      connectionError: "कनेक्शन विफल",
      locationRequired: "स्थान पहुंच आवश्यक",
      enableLocation: "स्थान सक्षम करें",
      refreshing: "रीफ्रेश कर रहे हैं...",
      retry: "कनेक्शन पुनः प्रयास",
      soundOn: "आवाज़ चालू",
      soundOff: "आवाज़ बंद",
      signalStrength: "सिग्नल शक्ति",
      hotspotId: "नेटवर्क ID",
      lastSeen: "अंतिम बार देखा",
      now: "अभी",
      minutesAgo: "मिनट पहले",
      emergency: "आपातकाल",
      broadcast: "प्रसारण",
      channel: "चैनल",
      you: "आप"
    }
  };

  const t = (key: string) => 
    translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']] || 
    translations.en[key as keyof typeof translations['en']] || key;

  // Get current location for walkie-talkie
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCurrentLocation(location);
            updateLocation(location.lat, location.lng);
          },
          (error) => {
            console.error('SafarSuraksha Walkie: Location error:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      }
    };

    getCurrentLocation();
    
    // Update location every 5 minutes
    const locationInterval = setInterval(getCurrentLocation, 5 * 60 * 1000);
    
    return () => clearInterval(locationInterval);
  }, [updateLocation]);

  // Connect to walkie-talkie service when component mounts
  useEffect(() => {
    if (currentLocation && !isConnected) {
      connect(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation, isConnected, connect]);

  // Auto-scroll to bottom when new messages arrive  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Play sound for new messages
  useEffect(() => {
    if (audioEnabled && soundRef.current) {
      soundRef.current.play().catch(() => {
        // Handle audio play failure silently
      });
    }
  }, [messages.length, audioEnabled]);

  // Handle incoming messages from the hook
  useEffect(() => {
    // This would be connected to the useWalkieTalkie hook's message handler
    // The hook should provide a way to listen for incoming messages
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !isAuthenticated) return;

    try {
      const messageData = {
        message: message.trim(),
        messageType: 'TEXT' as const,
        priority: 'MEDIUM' as const,
        channelId: currentChannel || undefined,
        isEmergency: false
      };

      const success = await sendWalkieMessage(messageData);
      
      if (success) {
        // Add message to local state immediately for UI responsiveness
        const newMessage: Message = {
          id: Date.now().toString(),
          fromUserId: 'currentUser', // This should come from auth context
          fromUserName: t('you'),
          message: message.trim(),
          messageType: 'TEXT',
          priority: 'MEDIUM',
          timestamp: new Date(),
          isEmergency: false,
          channelId: currentChannel || undefined,
          location: currentLocation || undefined,
          hotspotId
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
      }
    } catch (error) {
      console.error('SafarSuraksha Walkie: Send message error:', error);
    }
  };

  const handleSendEmergency = async () => {
    if (!isAuthenticated) return;

    try {
      const emergencyData = {
        message: `🚨 EMERGENCY SOS from SafarSuraksha user - Location: ${currentLocation?.lat.toFixed(4)}, ${currentLocation?.lng.toFixed(4)}`,
        messageType: 'EMERGENCY' as const,
        priority: 'EMERGENCY' as const,
        isEmergency: true,
        emergencyType: 'SAFETY' as const
      };

      const success = await sendEmergencyMessage(emergencyData);
      
      if (success) {
        const emergencyMessage: Message = {
          id: Date.now().toString(),
          fromUserId: 'currentUser',
          fromUserName: t('you'),
          message: emergencyData.message,
          messageType: 'EMERGENCY',
          priority: 'EMERGENCY',
          timestamp: new Date(),
          isEmergency: true,
          location: currentLocation || undefined,
          hotspotId
        };

        setMessages(prev => [...prev, emergencyMessage]);
      }
    } catch (error) {
      console.error('SafarSuraksha Walkie: Emergency message error:', error);
    }
  };

  const handleJoinChannel = async (channelId: string) => {
    try {
      const success = await joinChannel(channelId);
      if (success) {
        setCurrentChannel(channelId);
      }
    } catch (error) {
      console.error('SafarSuraksha Walkie: Join channel error:', error);
    }
  };

  const handleLeaveChannel = async () => {
    if (!currentChannel) return;
    
    try {
      const success = await leaveChannel(currentChannel);
      if (success) {
        setCurrentChannel(null);
      }
    } catch (error) {
      console.error('SafarSuraksha Walkie: Leave channel error:', error);
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !currentLocation) return;

    try {
      const success = await createChannel(newChannelName.trim(), currentLocation.lat, currentLocation.lng);
      if (success) {
        setNewChannelName('');
        setShowCreateChannel(false);
        // Refresh channels
        discoverChannels();
      }
    } catch (error) {
      console.error('SafarSuraksha Walkie: Create channel error:', error);
    }
  };

  const handleDiscoverUsers = () => {
    discoverNearbyUsers();
  };

  const handleDiscoverChannels = () => {
    discoverChannels();
  };

  const getSignalIcon = () => {
    switch (signalStrength) {
      case 'high': return <SignalHigh className="h-4 w-4 text-green-500" />;
      case 'medium': return <SignalMedium className="h-4 w-4 text-yellow-500" />;
      case 'low': return <SignalLow className="h-4 w-4 text-red-500" />;
      default: return <Signal className="h-4 w-4 text-gray-400" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatLastSeen = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return t('now');
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Audio element for message sounds */}
      <audio ref={soundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dxu2wbCkhGTyoEFhgFELTAE7xLGw5QQxoGGCQHHqG9GpUqHR1TdDQcOGYhQHQqgAAAAAAPFQAAABBREFUAkEQASRAAgkQAIJKFAACIUAAoQwFAACQQQAQAAAgkUAAIJBBAACAQgQAhBY9MjNzFvZ8TBB8kEqcSM8lJQQdCx4HGhwKGAseGR4YHhkeGh0aHhoZHhoIHhkAzBIFHZAKCN4OBdCHFQnqCgXqkQkFhxUG3gwHgRgL3Q8GSCMZyFoSwl4hyX8kIaZCIZUxBOCRAFAAQBTAIHhIBAEOAKYJGwAJOAAAAABSUExIAigAAAQYAAAQBgAAgEgAAIBYAABAQgAAgkgAAIEkAAAgeYwCGcBEj..." type="audio/wav" />
      </audio>

      <Card className="h-screen flex flex-col">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Radio className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">{t('walkieTalkie')}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm opacity-90">
                    {getSignalIcon()}
                    <span className={getConnectionStatusColor()}>
                      {t(connectionStatus)}
                    </span>
                    {hotspotId && (
                      <>
                        <span>•</span>
                        <span className="text-xs">{hotspotId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-white hover:bg-white/20"
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              {isConnected ? (
                <Badge className="bg-white/20 text-white border-white/30">
                  <Wifi className="h-3 w-3 mr-1" />
                  {activeUsers} {activeUsers === 1 ? 'user' : 'users'}
                </Badge>
              ) : (
                <Badge className="bg-red-600 text-white border-red-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  {t('disconnected')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Connection Status Alert */}
        {!isConnected && (
          <Alert className="m-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-300">
              {walkieError || t('noConnection')}
              <Button 
                size="sm" 
                onClick={() => currentLocation && connect(currentLocation.lat, currentLocation.lng)}
                className="ml-2 bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                {t('retry')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            {/* Current Channel/Mode Indicator */}
            <div className="p-3 bg-muted/50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {currentChannel ? (
                    <>
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{t('channelMode')}</span>
                      <Badge variant="outline">{currentChannel}</Badge>
                      <Button size="sm" variant="ghost" onClick={handleLeaveChannel}>
                        {t('leaveChannel')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">{t('broadcastMode')}</span>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        {activeUsers} nearby
                      </Badge>
                    </>
                  )}
                </div>
                
                {currentLocation && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start a conversation with nearby SafarSuraksha users</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromUserName === t('you') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.fromUserName === t('you')
                          ? 'bg-orange-500 text-white'
                          : msg.isEmergency
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.fromUserName !== t('you') && (
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-medium">{msg.fromUserName || 'Unknown'}</span>
                          {msg.isEmergency && (
                            <Badge className="bg-red-600 text-white px-1 py-0 text-xs">
                              {t('emergency')}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm">{msg.message}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {formatTime(msg.timestamp)}
                        </p>
                        
                        {msg.channelId && (
                          <Badge variant="outline" className="text-xs">
                            {t('channel')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2 mb-2">
                <Button
                  onClick={handleSendEmergency}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!isAuthenticated}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {t('emergencySOS')}
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('typeMessage')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!isAuthenticated}
                  className="flex-1"
                  maxLength={500}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isAuthenticated}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-muted/30 p-4 space-y-4">
            {/* Nearby Users */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {t('nearbyUsers')}
                  </span>
                  <Button size="sm" variant="ghost" onClick={handleDiscoverUsers}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {nearbyUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('noUsers')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {nearbyUsers.map((user) => (
                      <div key={user.userId} className="flex items-center justify-between p-2 bg-background rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                        {user.lastSeen && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastSeen(user.lastSeen)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Channels */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('activeChannels')}
                  </span>
                  <Button size="sm" variant="ghost" onClick={handleDiscoverChannels}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {channels.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('noChannels')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {channels.map((channel) => (
                      <div key={channel.channelId} className="flex items-center justify-between p-2 bg-background rounded">
                        <div>
                          <p className="text-sm font-medium">{channel.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {channel.userCount} users
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinChannel(channel.channelId)}
                          disabled={currentChannel === channel.channelId}
                        >
                          {currentChannel === channel.channelId ? t('joined') : t('joinChannel')}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create Channel */}
                <div className="mt-4 pt-4 border-t">
                  {showCreateChannel ? (
                    <div className="space-y-2">
                      <Input
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="Channel name..."
                        className="text-sm"
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleCreateChannel} className="flex-1">
                          Create
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowCreateChannel(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowCreateChannel(true)}
                      className="w-full"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {t('createChannel')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Connection Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Signal className="h-4 w-4 mr-2" />
                  Network Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('signalStrength')}:</span>
                  <div className="flex items-center space-x-1">
                    {getSignalIcon()}
                    <span className="capitalize">{signalStrength}</span>
                  </div>
                </div>
                
                {hotspotId && (
                  <div className="flex justify-between text-sm">
                    <span>{t('hotspotId')}:</span>
                    <span className="text-xs font-mono">{hotspotId}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Active Users:</span>
                  <span>{activeUsers}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge 
                    className={
                      isConnected 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {isConnected ? t('connected') : t('disconnected')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
