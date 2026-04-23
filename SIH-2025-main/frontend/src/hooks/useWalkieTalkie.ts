import { useState, useEffect, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface WalkieMessage {
  message: string;
  messageType: 'TEXT' | 'EMERGENCY' | 'LOCATION' | 'VOICE_NOTE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  channelId?: string;
  isEmergency: boolean;
  emergencyType?: 'MEDICAL' | 'SAFETY' | 'LOST' | 'ACCIDENT' | 'CRIME' | 'NATURAL_DISASTER';
}

interface EmergencyMessage extends WalkieMessage {
  isEmergency: true;
  emergencyType: 'MEDICAL' | 'SAFETY' | 'LOST' | 'ACCIDENT' | 'CRIME' | 'NATURAL_DISASTER';
}

interface NearbyUser {
  userId: string;
  firstName?: string;
  lastName?: string;
  lastSeen?: Date;
}

interface Channel {
  channelId: string;
  name: string;
  userCount: number;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
type SignalStrength = 'none' | 'low' | 'medium' | 'high';

const API_BASE_URL = 'http://localhost:5001';

export const useWalkieTalkie = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [signalStrength, setSignalStrength] = useState<SignalStrength>('none');
  const [hotspotId, setHotspotId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Message and event callbacks
  const [onMessageReceived, setOnMessageReceived] = useState<((message: any) => void) | null>(null);
  const [onUserJoined, setOnUserJoined] = useState<((user: any) => void) | null>(null);
  const [onUserLeft, setOnUserLeft] = useState<((user: any) => void) | null>(null);
  const [onChannelUpdate, setOnChannelUpdate] = useState<((channels: Channel[]) => void) | null>(null);
  
  const currentLocationRef = useRef<{lat: number, lng: number} | null>(null);
  const authTokenRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  // Get auth token (you should implement this based on your auth system)
  const getAuthToken = useCallback(() => {
    // This should return the actual auth token from your auth context/localStorage
    return localStorage.getItem('safar_auth_token') || 'demo_token_' + Date.now();
  }, []);

  // Generate user ID
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem('safar_user_id');
    if (!userId) {
      userId = 'demo_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('safar_user_id', userId);
    }
    return userId;
  }, []);

  // Connect to walkie-talkie service
  const connect = useCallback(async (lat: number, lng: number) => {
    if (socket?.connected) return;

    setLoading(true);
    setConnectionStatus('connecting');
    setError(null);

    try {
      console.log('🔌 SafarSuraksha Walkie: Connecting to socket server...');

      const newSocket = io(API_BASE_URL, {
        // Use default Socket.IO path - FIXED!
        transports: ['polling', 'websocket'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        forceNew: true
      });

      newSocket.on('connect', () => {
        console.log('✅ SafarSuraksha Walkie: Socket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        setSignalStrength('high');
        
        // Authenticate with the server
        const token = getAuthToken();
        const userId = getUserId();
        authTokenRef.current = token;
        currentUserIdRef.current = userId;
        currentLocationRef.current = { lat, lng };
        
        newSocket.emit('authenticate', {
          userId: userId,
          token: token,
          location: { latitude: lat, longitude: lng }
        });
      });

      newSocket.on('authenticated', (data) => {
        console.log('🔐 SafarSuraksha Walkie: Authentication result:', data);
        if (data.success) {
          setIsAuthenticated(true);
          setError(null);
          
          // Discover nearby users and channels
          newSocket.emit('discover_nearby');
          newSocket.emit('discover_channels');
        } else {
          setError(data.error || 'Authentication failed');
          setIsAuthenticated(false);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ SafarSuraksha Walkie: Socket disconnected:', reason);
        setIsConnected(false);
        setIsAuthenticated(false);
        setConnectionStatus('disconnected');
        setSignalStrength('none');
        setHotspotId(null);
        setActiveUsers(0);
        setNearbyUsers([]);
        setChannels([]);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 SafarSuraksha Walkie: Reconnected after', attemptNumber, 'attempts');
        setConnectionStatus('connected');
        setError(null);
      });

      newSocket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 SafarSuraksha Walkie: Reconnection attempt', attemptNumber);
        setConnectionStatus('connecting');
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ SafarSuraksha Walkie: Connection error:', error);
        setConnectionStatus('error');
        setError(`Connection failed: ${error.message}`);
        setIsConnected(false);
        setIsAuthenticated(false);
        setSignalStrength('none');
      });

      // Handle incoming messages
      newSocket.on('new_message', (messageData) => {
        console.log('📨 SafarSuraksha Walkie: New message received:', messageData);
        if (onMessageReceived) {
          onMessageReceived(messageData);
        }
      });

      // Handle user events
      newSocket.on('user_joined_hotspot', (data) => {
        console.log('👋 SafarSuraksha Walkie: User joined hotspot:', data);
        setActiveUsers(prev => prev + 1);
        if (onUserJoined) {
          onUserJoined(data);
        }
      });

      newSocket.on('user_left_hotspot', (data) => {
        console.log('👋 SafarSuraksha Walkie: User left hotspot:', data);
        setActiveUsers(prev => Math.max(0, prev - 1));
        if (onUserLeft) {
          onUserLeft(data);
        }
      });

      newSocket.on('user_joined_channel', (data) => {
        console.log('📻 SafarSuraksha Walkie: User joined channel:', data);
      });

      newSocket.on('user_left_channel', (data) => {
        console.log('📻 SafarSuraksha Walkie: User left channel:', data);
      });

      // Handle nearby users discovery
      newSocket.on('nearby_users', (data) => {
        console.log('👥 SafarSuraksha Walkie: Nearby users discovered:', data);
        setActiveUsers((data.users?.length || 0) + 1); // +1 for current user
        setHotspotId(data.hotspotId);
        setNearbyUsers(data.users || []);
      });

      // Handle channel discovery
      newSocket.on('available_channels', (data) => {
        console.log('📻 SafarSuraksha Walkie: Available channels:', data);
        setChannels(data.channels || []);
        if (onChannelUpdate) {
          onChannelUpdate(data.channels || []);
        }
      });

      // Handle channel events
      newSocket.on('channel_created', (data) => {
        console.log('🆕 SafarSuraksha Walkie: Channel created:', data);
        // Refresh channels
        newSocket.emit('discover_channels');
      });

      newSocket.on('channel_joined', (data) => {
        console.log('✅ SafarSuraksha Walkie: Joined channel:', data);
      });

      newSocket.on('channel_left', (data) => {
        console.log('👋 SafarSuraksha Walkie: Left channel:', data);
      });

      // Handle message sent confirmation
      newSocket.on('message_sent', (data) => {
        console.log('✅ SafarSuraksha Walkie: Message sent confirmation:', data);
      });

      // Handle errors
      newSocket.on('error', (error) => {
        console.error('❌ SafarSuraksha Walkie: Socket error:', error);
        setError(error.message || 'Unknown error occurred');
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('❌ SafarSuraksha Walkie: Connection setup failed:', error);
      setConnectionStatus('error');
      setError('Failed to connect to walkie-talkie service');
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, getUserId, onMessageReceived, onUserJoined, onUserLeft, onChannelUpdate]);

  // Disconnect from service
  const disconnect = useCallback(() => {
    if (socket) {
      console.log('🔌 SafarSuraksha Walkie: Disconnecting...');
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  // Send a message
  const sendMessage = useCallback(async (messageData: WalkieMessage): Promise<boolean> => {
    if (!socket || !isAuthenticated) {
      console.error('❌ SafarSuraksha Walkie: Not connected or authenticated');
      return false;
    }

    try {
      console.log('📤 SafarSuraksha Walkie: Sending message:', messageData);
      
      return new Promise((resolve) => {
        socket.emit('send_message', messageData);
        
        // Listen for confirmation
        const timeout = setTimeout(() => {
          console.warn('⚠️ SafarSuraksha Walkie: Message send timeout');
          resolve(false);
        }, 5000);
        
        const messageHandler = (data: any) => {
          clearTimeout(timeout);
          socket.off('message_sent', messageHandler);
          socket.off('error', errorHandler);
          resolve(data.success || true);
        };
        
        const errorHandler = (error: any) => {
          clearTimeout(timeout);
          socket.off('message_sent', messageHandler);
          socket.off('error', errorHandler);
          console.error('❌ SafarSuraksha Walkie: Message send error:', error);
          resolve(false);
        };
        
        socket.on('message_sent', messageHandler);
        socket.on('error', errorHandler);
      });
    } catch (error) {
      console.error('❌ SafarSuraksha Walkie: Send message error:', error);
      return false;
    }
  }, [socket, isAuthenticated]);

  // Send emergency message
  const sendEmergencyMessage = useCallback(async (emergencyData: EmergencyMessage): Promise<boolean> => {
    if (!socket || !isAuthenticated) {
      console.error('❌ SafarSuraksha Walkie: Not connected for emergency');
      return false;
    }

    try {
      console.log('🚨 SafarSuraksha Walkie: Sending emergency message:', emergencyData);
      
      return new Promise((resolve) => {
        socket.emit('send_message', {
          ...emergencyData,
          priority: 'EMERGENCY'
        });
        
        const timeout = setTimeout(() => resolve(false), 5000);
        
        const messageHandler = (data: any) => {
          clearTimeout(timeout);
          socket.off('message_sent', messageHandler);
          socket.off('error', errorHandler);
          resolve(data.success || true);
        };
        
        const errorHandler = () => {
          clearTimeout(timeout);
          socket.off('message_sent', messageHandler);
          socket.off('error', errorHandler);
          resolve(false);
        };
        
        socket.on('message_sent', messageHandler);
        socket.on('error', errorHandler);
      });
    } catch (error) {
      console.error('❌ SafarSuraksha Walkie: Emergency message error:', error);
      return false;
    }
  }, [socket, isAuthenticated]);

  // Join a channel
  const joinChannel = useCallback(async (channelId: string): Promise<boolean> => {
    if (!socket || !isAuthenticated) {
      console.error('❌ SafarSuraksha Walkie: Not connected for join channel');
      return false;
    }

    try {
      console.log('📻 SafarSuraksha Walkie: Joining channel:', channelId);
      
      return new Promise((resolve) => {
        socket.emit('join_channel', { channelId });
        
        const timeout = setTimeout(() => resolve(false), 5000);
        
        const joinHandler = () => {
          clearTimeout(timeout);
          socket.off('channel_joined', joinHandler);
          socket.off('error', errorHandler);
          resolve(true);
        };
        
        const errorHandler = () => {
          clearTimeout(timeout);
          socket.off('channel_joined', joinHandler);
          socket.off('error', errorHandler);
          resolve(false);
        };
        
        socket.on('channel_joined', joinHandler);
        socket.on('error', errorHandler);
      });
    } catch (error) {
      console.error('❌ SafarSuraksha Walkie: Join channel error:', error);
      return false;
    }
  }, [socket, isAuthenticated]);

  // Leave a channel
  const leaveChannel = useCallback(async (channelId: string): Promise<boolean> => {
    if (!socket || !isAuthenticated) return false;

    try {
      console.log('📻 SafarSuraksha Walkie: Leaving channel:', channelId);
      
      return new Promise((resolve) => {
        socket.emit('leave_channel', { channelId });
        
        const timeout = setTimeout(() => resolve(false), 5000);
        
        const leaveHandler = () => {
          clearTimeout(timeout);
          socket.off('channel_left', leaveHandler);
          socket.off('error', errorHandler);
          resolve(true);
        };
        
        const errorHandler = () => {
          clearTimeout(timeout);
          socket.off('channel_left', leaveHandler);
          socket.off('error', errorHandler);
          resolve(false);
        };
        
        socket.on('channel_left', leaveHandler);
        socket.on('error', errorHandler);
      });
    } catch (error) {
      console.error('❌ SafarSuraksha Walkie: Leave channel error:', error);
      return false;
    }
  }, [socket, isAuthenticated]);

  // Create a new channel
  const createChannel = useCallback(async (channelName: string, lat: number, lng: number): Promise<boolean> => {
    if (!socket || !isAuthenticated) return false;

    try {
      console.log('📻 SafarSuraksha Walkie: Creating channel:', channelName);
      
      return new Promise((resolve) => {
        socket.emit('create_channel', { channelName });
        
        const timeout = setTimeout(() => resolve(false), 5000);
        
        const createHandler = () => {
          clearTimeout(timeout);
          socket.off('channel_created', createHandler);
          socket.off('error', errorHandler);
          resolve(true);
        };
        
        const errorHandler = () => {
          clearTimeout(timeout);
          socket.off('channel_created', createHandler);
          socket.off('error', errorHandler);
          resolve(false);
        };
        
        socket.on('channel_created', createHandler);
        socket.on('error', errorHandler);
      });
    } catch (error) {
      console.error('❌ SafarSuraksha Walkie: Create channel error:', error);
      return false;
    }
  }, [socket, isAuthenticated]);

  // Discover nearby users
  const discoverNearbyUsers = useCallback(() => {
    if (!socket || !isAuthenticated) return;
    
    console.log('👥 SafarSuraksha Walkie: Discovering nearby users...');
    socket.emit('discover_nearby');
  }, [socket, isAuthenticated]);

  // Discover available channels
  const discoverChannels = useCallback(() => {
    if (!socket || !isAuthenticated) return;
    
    console.log('📻 SafarSuraksha Walkie: Discovering channels...');
    socket.emit('discover_channels');
  }, [socket, isAuthenticated]);

  // Update user location
  const updateLocation = useCallback((lat: number, lng: number) => {
    if (!socket || !isAuthenticated) return;
    
    console.log('📍 SafarSuraksha Walkie: Updating location:', { lat, lng });
    currentLocationRef.current = { lat, lng };
    socket.emit('update_location', { latitude: lat, longitude: lng });
  }, [socket, isAuthenticated]);

  // Event handlers for components
  const setMessageHandler = useCallback((handler: (message: any) => void) => {
    setOnMessageReceived(() => handler);
  }, []);

  const setUserJoinedHandler = useCallback((handler: (user: any) => void) => {
    setOnUserJoined(() => handler);
  }, []);

  const setUserLeftHandler = useCallback((handler: (user: any) => void) => {
    setOnUserLeft(() => handler);
  }, []);

  const setChannelUpdateHandler = useCallback((handler: (channels: Channel[]) => void) => {
    setOnChannelUpdate(() => handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Auto-reconnect on location change
  useEffect(() => {
    if (isConnected && currentLocationRef.current) {
      const { lat, lng } = currentLocationRef.current;
      updateLocation(lat, lng);
    }
  }, [isConnected, updateLocation]);

  return {
    // Connection state
    isConnected,
    isAuthenticated,
    connectionStatus,
    signalStrength,
    hotspotId,
    activeUsers,
    nearbyUsers,
    channels,
    error,
    loading,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    sendEmergencyMessage,
    joinChannel,
    leaveChannel,
    createChannel,
    discoverNearbyUsers,
    discoverChannels,
    updateLocation,
    
    // Event handlers
    setMessageHandler,
    setUserJoinedHandler,
    setUserLeftHandler,
    setChannelUpdateHandler,
    
    // User info
    currentUserId: currentUserIdRef.current
  };
};
