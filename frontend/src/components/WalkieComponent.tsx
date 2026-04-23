import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useWalkieConnection, WalkieMessage, WalkieChannel } from '../hooks/useWalkieTalkie';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { AlertTriangle, Send, Users, Radio, MessageSquare, Plus, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from "../components/ui/use-toast";
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation'; // Assuming you have a location hook

export interface WalkieComponentProps {
  className?: string;
  lat?: number;
  lon?: number;
  locationName?: string;
}

const WalkieComponent: React.FC<WalkieComponentProps> = ({ className, lat, lon, locationName }) => {
  const { user } = useAuth();
  const { location } = useLocation();
  const { toast } = useToast();
  const userLocation = {
    lat: lat || location?.lat || 0,
    lon: lon || location?.lon || 0
  };
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('broadcast');
  const [newChannelName, setNewChannelName] = useState('');
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    isAuthenticated,
    error,
    messages,
    nearbyUsers,
    availableChannels,
    currentChannelId,
    connect,
    updateLocation,
    discoverNearbyUsers,
    discoverChannels,
    joinChannel,
    leaveChannel,
    createChannel,
    sendMessage,
    sendEmergencyMessage
  } = useWalkieConnection({
    onNewMessage: (msg) => {
      // Auto-scroll to bottom on new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (err) => {
      toast({
        title: 'Walkie-Talkie Error',
        description: err.message,
        variant: 'destructive'
      });
    },
    onChannelJoined: (data) => {
      toast({
        title: 'Channel Joined',
        description: `You've joined the channel successfully.`,
      });
      setActiveTab('channel');
    }
  });

  // Update location when it changes
  useEffect(() => {
    if (isAuthenticated) {
      updateLocation(userLocation);
    }
  }, [userLocation, isAuthenticated, updateLocation]);

  // Discover nearby users and channels periodically
  useEffect(() => {
    if (isAuthenticated) {
      discoverNearbyUsers();
      discoverChannels();
      
      const interval = setInterval(() => {
        discoverNearbyUsers();
        discoverChannels();
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, discoverNearbyUsers, discoverChannels]);

  // Handle message sending
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (activeTab === 'broadcast') {
      sendMessage(message);
    } else if (activeTab === 'channel' && currentChannelId) {
      sendMessage(message, { channelId: currentChannelId });
    } else if (activeTab === 'emergency') {
      sendEmergencyMessage(message);
    }
    
    setMessage('');
  };

  // Handle channel creation
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    
    createChannel(newChannelName);
    setNewChannelName('');
    setIsCreateChannelOpen(false);
  };

  // Handle channel joining
  const handleJoinChannel = (channelId: string) => {
    joinChannel(channelId);
  };

  // Handle channel leaving
  const handleLeaveChannel = () => {
    if (currentChannelId) {
      leaveChannel(currentChannelId);
      setActiveTab('broadcast');
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-xs">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );

  return (
    <Card className={`w-full max-w-md mx-auto shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            <span>Walkie-Talkie</span>
          </CardTitle>
          <ConnectionStatus />
        </div>
        <CardDescription>
          Local P2P messaging for tourists
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="broadcast" className="flex-1">
              <Radio className="h-4 w-4 mr-2" />
              Broadcast
            </TabsTrigger>
            <TabsTrigger value="channel" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Channel
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4">
          <TabsContent value="broadcast" className="m-0">
            <div className="mb-2 flex justify-between items-center">
              <h4 className="text-sm font-medium">Broadcasting to nearby tourists</h4>
              <Badge variant="outline">{nearbyUsers.length} nearby</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="channel" className="m-0">
            {currentChannelId ? (
              <div className="mb-2 flex justify-between items-center">
                <h4 className="text-sm font-medium">
                  Channel: {availableChannels.find(c => c.channelId === currentChannelId)?.name || 'Unknown'}
                </h4>
                <Button variant="ghost" size="sm" onClick={handleLeaveChannel}>
                  Leave
                </Button>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Available Channels</h4>
                  <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" /> New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Channel</DialogTitle>
                        <DialogDescription>
                          Create a new channel for tourists in your area.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., Hotel Guests"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreateChannel}>Create Channel</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {availableChannels.length > 0 ? (
                  <ScrollArea className="h-[100px]">
                    {availableChannels.map((channel) => (
                      <div
                        key={channel.channelId}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleJoinChannel(channel.channelId)}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{channel.name}</span>
                        </div>
                        <Badge variant="outline">{channel.userCount} users</Badge>
                      </div>
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No channels available. Create one!
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="emergency" className="m-0">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h4 className="text-sm font-medium text-red-500">Emergency Broadcast</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Messages sent here will be marked as emergencies and may be shared with authorities.
            </p>
          </TabsContent>
          
          <Separator className="my-2" />
          
          {/* Messages Area */}
          <ScrollArea className="h-[300px] pr-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 mb-4 ${msg.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.fromUserId !== user?.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{msg.fromUserId.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${msg.fromUserId === user?.id
                      ? msg.isEmergency
                        ? 'bg-red-100 text-red-800'
                        : 'bg-primary text-primary-foreground'
                      : msg.isEmergency
                        ? 'bg-red-100 text-red-800'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {msg.fromUserId === user?.id ? 'You' : `User ${msg.fromUserId.substring(0, 6)}`}
                      </span>
                      <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                    </div>
                    
                    <p className="text-sm break-words">{msg.message}</p>
                    
                    {msg.isEmergency && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-xs">Emergency</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <MessageSquare className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        
        <CardFooter>
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              placeholder={`Type a message${activeTab === 'emergency' ? ' (Emergency)' : ''}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={activeTab === 'emergency' ? 'border-red-300 focus-visible:ring-red-300' : ''}
            />
            <Button
              type="submit"
              size="icon"
              className={activeTab === 'emergency' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default WalkieComponent;