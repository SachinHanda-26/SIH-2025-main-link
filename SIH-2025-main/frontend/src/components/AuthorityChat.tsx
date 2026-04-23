import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Send, 
  Radio, 
  Phone, 
  AlertTriangle,
  Users,
  Shield,
  Clock,
  MapPin,
  FileText,
  Settings,
  Search,
  Star,
  Zap
} from 'lucide-react';

interface Message {
  id: number;
  type: 'authority' | 'tourist' | 'system';
  sender: string;
  content: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
  location?: string;
}

interface AuthorityChannel {
  id: string;
  name: string;
  type: 'emergency' | 'coordination' | 'tourist-support';
  activeMembers: number;
  unreadCount: number;
  status: 'online' | 'busy' | 'offline';
}

export function AuthorityChat() {
  const [activeChannel, setActiveChannel] = useState('emergency');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [activeChannel]);

  const authorityChannels: AuthorityChannel[] = [
    {
      id: 'emergency',
      name: 'Emergency Response',
      type: 'emergency',
      activeMembers: 8,
      unreadCount: 2,
      status: 'online'
    },
    {
      id: 'coordination',
      name: 'Team Coordination',
      type: 'coordination',
      activeMembers: 12,
      unreadCount: 0,
      status: 'online'
    },
    {
      id: 'tourist-support',
      name: 'Tourist Support',
      type: 'tourist-support',
      activeMembers: 5,
      unreadCount: 1,
      status: 'online'
    }
  ];

  const emergencyMessages: Message[] = [
    {
      id: 1,
      type: 'system',
      sender: 'System Alert',
      content: 'Weather Alert: Heavy rainfall expected in Central Delhi. Tourist advisory activated.',
      timestamp: new Date(Date.now() - 300000),
      priority: 'high',
      location: 'Central Delhi'
    },
    {
      id: 2,
      type: 'authority',
      sender: 'Cmd. Sharma',
      content: 'All units, increase patrol frequency in monsoon-affected areas. Focus on India Gate and CP sectors.',
      timestamp: new Date(Date.now() - 240000),
      priority: 'medium'
    },
    {
      id: 3,
      type: 'authority',
      sender: 'Unit-7',
      content: 'Copy that Command. Unit-7 proceeding to India Gate. ETA 5 minutes.',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      type: 'tourist',
      sender: 'Rahul Sharma (TUR_001)',
      content: 'Need assistance at Red Fort. Large crowd forming due to weather. Feeling unsafe.',
      timestamp: new Date(Date.now() - 120000),
      priority: 'medium',
      location: 'Red Fort'
    },
    {
      id: 5,
      type: 'authority',
      sender: 'Unit-3',
      content: 'Unit-3 responding to Red Fort. Tourist assistance required. ETA 3 minutes.',
      timestamp: new Date(Date.now() - 60000),
      priority: 'high'
    }
  ];

  const coordinationMessages: Message[] = [
    {
      id: 6,
      type: 'authority',
      sender: 'Operations Chief',
      content: 'Daily briefing complete. All sectors report normal status. Weather monitoring active.',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 7,
      type: 'authority',
      sender: 'Tech Support',
      content: 'System maintenance scheduled for 2:00 AM tonight. All monitoring tools will be offline for 30 minutes.',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 8,
      type: 'authority',
      sender: 'Medical Team',
      content: 'Medical assistance provided at Lotus Temple. Tourist recovered and continuing journey.',
      timestamp: new Date(Date.now() - 300000)
    }
  ];

  const touristSupportMessages: Message[] = [
    {
      id: 9,
      type: 'tourist',
      sender: 'Sarah Johnson (TUR_002)',
      content: 'Hi! I\'m looking for vegetarian restaurants near Red Fort. Any recommendations?',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 10,
      type: 'authority',
      sender: 'Tourist Support',
      content: 'Hello Sarah! I recommend Paranthe Wali Gali (2.1km from your location) for authentic vegetarian food. Safe and highly rated!',
      timestamp: new Date(Date.now() - 540000)
    },
    {
      id: 11,
      type: 'tourist',
      sender: 'Michael Chen (TUR_004)',
      content: 'Thank you for the real-time weather updates! Very helpful for planning my day.',
      timestamp: new Date(Date.now() - 180000)
    }
  ];

  const getMessages = () => {
    switch (activeChannel) {
      case 'emergency': return emergencyMessages;
      case 'coordination': return coordinationMessages;
      case 'tourist-support': return touristSupportMessages;
      default: return emergencyMessages;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // In a real app, this would send the message to the backend
    console.log(`Sending message to ${activeChannel}: ${inputText}`);
    setInputText('');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default: return 'border-l-gray-300';
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'coordination': return <Radio className="h-4 w-4 text-blue-600" />;
      case 'tourist-support': return <Users className="h-4 w-4 text-green-600" />;
      default: return <Radio className="h-4 w-4" />;
    }
  };

  const renderMessage = (message: Message) => (
    <div 
      key={message.id} 
      className={`p-4 border-l-4 rounded-r-lg mb-3 ${getPriorityColor(message.priority)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs">
              {message.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{message.sender}</span>
          {message.priority && (
            <Badge 
              variant={message.priority === 'high' ? 'destructive' : 'outline'}
              className="text-xs"
            >
              {message.priority.toUpperCase()}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
      
      <p className="text-sm mb-2">{message.content}</p>
      
      {message.location && (
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{message.location}</span>
        </div>
      )}
    </div>
  );

  const renderChannelHeader = () => {
    const channel = authorityChannels.find(c => c.id === activeChannel);
    if (!channel) return null;

    return (
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getChannelIcon(channel.type)}
            <div>
              <h3 className="font-semibold">{channel.name}</h3>
              <p className="text-xs text-muted-foreground">
                {channel.activeMembers} active members
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              channel.status === 'online' ? 'bg-green-500' : 
              channel.status === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-xs capitalize">{channel.status}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[600px] flex">
      {/* Channel Sidebar */}
      <div className="w-80 border-r bg-muted/20">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Authority Communications</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-2">
          {authorityChannels.map((channel) => (
            <Button
              key={channel.id}
              variant={activeChannel === channel.id ? "default" : "ghost"}
              className="w-full justify-start mb-2 h-auto p-3"
              onClick={() => setActiveChannel(channel.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {getChannelIcon(channel.type)}
                  <div className="text-left">
                    <p className="font-medium text-sm">{channel.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {channel.activeMembers} members
                    </p>
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {channel.unreadCount}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t">
          <p className="text-sm font-semibold mb-2">Quick Actions</p>
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
              Broadcast Alert
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2 text-blue-600" />
              Emergency Call
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2 text-green-600" />
              Incident Report
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {renderChannelHeader()}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {getMessages().map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${authorityChannels.find(c => c.id === activeChannel)?.name}...`}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Status Indicators */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span>Secure Channel</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-blue-500" />
                <span>Real-time</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span>All messages logged</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}