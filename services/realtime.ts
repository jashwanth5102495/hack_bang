import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Real-time service configuration
const SOCKET_URL = 'http://localhost:5000';

interface MoodUpdate {
  userId: string;
  mood: string;
  analysis: any;
  timestamp: string;
}

interface MusicSync {
  userId: string;
  currentSong: any;
  mood: string;
  timestamp: string;
}

interface RealtimeRecommendations {
  music: Array<{
    title: string;
    genre: string;
    energy: string;
  }>;
  videos: string[];
  activities: string[];
  timestamp: string;
}

interface SystemStatus {
  status: string;
  features: string[];
  timestamp: string;
}

class RealtimeService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private eventQueue: Array<{ event: string; data: any }> = [];
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  // Event listeners
  private moodUpdateListeners: Array<(data: any) => void> = [];
  private musicUpdateListeners: Array<(data: any) => void> = [];
  private musicSyncListeners: Array<(data: any) => void> = [];
  private userJoinedSyncListeners: Array<(data: any) => void> = [];
  private userLeftSyncListeners: Array<(data: any) => void> = [];
  private recommendationListeners: Array<(data: RealtimeRecommendations) => void> = [];
  private systemStatusListeners: Array<(data: SystemStatus) => void> = [];
  private connectionListeners: Array<(connected: boolean) => void> = [];
  private activityUpdateListeners: Array<(data: any) => void> = [];

  constructor() {
    // Initialize as a mock service for now - no real socket connection
    this.isConnected = false;
    console.log('RealtimeService initialized in mock mode');
  }

  // Initialize WebSocket connection (mock implementation)
  private async initializeConnection(): Promise<void> {
    try {
      // Mock implementation - no actual socket connection
      console.log('Mock realtime service - no actual connection established');
      this.isConnected = false;
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error);
    }
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const { event, data } = this.eventQueue.shift()!;
      if (this.socket && this.isConnected) {
        this.socket.emit(event, data);
      }
    }
  }

  // Setup socket event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Real-time connection established');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Real-time connection lost');
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnection();
    });

    // Mood-related events
    this.socket.on('user-mood-changed', (data) => {
      this.notifyMoodUpdateListeners(data);
    });

    this.socket.on('mood-recommendations', (data: RealtimeRecommendations) => {
      this.notifyRecommendationListeners(data);
    });

    // Music-related events
    this.socket.on('friend-music-update', (data) => {
      this.notifyMusicUpdateListeners(data);
    });

    this.socket.on('music-sync', (data) => {
      this.notifyMusicSyncListeners(data);
    });

    this.socket.on('user-joined-sync', (data) => {
      this.notifyUserJoinedSyncListeners(data);
    });

    this.socket.on('user-left-sync', (data) => {
      this.notifyUserLeftSyncListeners(data);
    });

    // System events
    this.socket.on('system-status', (data: SystemStatus) => {
      this.notifySystemStatusListeners(data);
    });

    // Activity tracking
    this.socket.on('user-activity', (data) => {
      console.log('User activity update:', data);
      this.notifyActivityUpdateListeners(data);
    });
  }

  // Handle reconnection logic
  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.initializeConnection();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Public methods for sending events with debouncing for performance
  public sendMoodUpdate(moodData: MoodUpdate): void {
    // Mock implementation - just log the data
    console.log('Mock sendMoodUpdate:', moodData);
  }

  public sendMusicSync(musicData: MusicSync): void {
    // Mock implementation - just log the data
    console.log('Mock sendMusicSync:', musicData);
  }

  public sendActivityUpdate(activityData: any): void {
    // Mock implementation - just log the data
    console.log('Mock sendActivityUpdate:', activityData);
  }

  private debouncedEmit(event: string, data: any, delay: number): void {
    // Clear existing timer for this event type
    const existingTimer = this.debounceTimers.get(event);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      if (this.socket && this.isConnected) {
        this.socket.emit(event, data);
      }
      this.debounceTimers.delete(event);
    }, delay);

    this.debounceTimers.set(event, timer);
  }

  public joinUserRoom(userId: string): void {
    // Mock implementation - just log the action
    console.log('Mock joinUserRoom:', userId);
  }

  // Event listener management
  public onMoodUpdate(callback: (data: any) => void): () => void {
    this.moodUpdateListeners.push(callback);
    return () => {
      this.moodUpdateListeners = this.moodUpdateListeners.filter(cb => cb !== callback);
    };
  }

  public onMusicUpdate(callback: (data: any) => void): () => void {
    this.musicUpdateListeners.push(callback);
    return () => {
      this.musicUpdateListeners = this.musicUpdateListeners.filter(cb => cb !== callback);
    };
  }

  public onMusicSync(callback: (data: any) => void): () => void {
    this.musicSyncListeners.push(callback);
    return () => {
      this.musicSyncListeners = this.musicSyncListeners.filter(cb => cb !== callback);
    };
  }

  public onUserJoinedSync(callback: (data: any) => void): () => void {
    this.userJoinedSyncListeners.push(callback);
    return () => {
      this.userJoinedSyncListeners = this.userJoinedSyncListeners.filter(cb => cb !== callback);
    };
  }

  public onUserLeftSync(callback: (data: any) => void): () => void {
    this.userLeftSyncListeners.push(callback);
    return () => {
      this.userLeftSyncListeners = this.userLeftSyncListeners.filter(cb => cb !== callback);
    };
  }

  public onRecommendations(callback: (data: RealtimeRecommendations) => void): () => void {
    this.recommendationListeners.push(callback);
    return () => {
      this.recommendationListeners = this.recommendationListeners.filter(cb => cb !== callback);
    };
  }

  public onSystemStatus(callback: (data: SystemStatus) => void): () => void {
    this.systemStatusListeners.push(callback);
    return () => {
      this.systemStatusListeners = this.systemStatusListeners.filter(cb => cb !== callback);
    };
  }

  public onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback);
    };
  }

  public onActivityUpdate(callback: (data: any) => void): () => void {
    this.activityUpdateListeners.push(callback);
    return () => {
      this.activityUpdateListeners = this.activityUpdateListeners.filter(cb => cb !== callback);
    };
  }

  // Notification methods
  private notifyMoodUpdateListeners(data: any): void {
    this.moodUpdateListeners.forEach(callback => callback(data));
  }

  private notifyMusicUpdateListeners(data: any): void {
    this.musicUpdateListeners.forEach(callback => callback(data));
  }

  private notifyMusicSyncListeners(data: any): void {
    this.musicSyncListeners.forEach(callback => callback(data));
  }

  private notifyUserJoinedSyncListeners(data: any): void {
    this.userJoinedSyncListeners.forEach(callback => callback(data));
  }

  private notifyUserLeftSyncListeners(data: any): void {
    this.userLeftSyncListeners.forEach(callback => callback(data));
  }

  private notifyRecommendationListeners(data: RealtimeRecommendations): void {
    this.recommendationListeners.forEach(callback => callback(data));
  }

  private notifySystemStatusListeners(data: SystemStatus): void {
    this.systemStatusListeners.forEach(callback => callback(data));
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(callback => callback(connected));
  }

  private notifyActivityUpdateListeners(data: any): void {
    this.activityUpdateListeners.forEach(callback => callback(data));
  }

  // Utility methods
  public isConnectedToServer(): boolean {
    return this.isConnected;
  }

  public disconnect(): void {
    // Mock implementation - just update state
    console.log('Mock disconnect called');
    this.isConnected = false;
    this.cleanup();
  }

  private cleanup(): void {
    // Clear all debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    
    // Clear event queue
    this.eventQueue.length = 0;
    
    // Clear all listeners
    this.moodUpdateListeners.length = 0;
    this.musicUpdateListeners.length = 0;
    this.musicSyncListeners.length = 0;
    this.userJoinedSyncListeners.length = 0;
    this.userLeftSyncListeners.length = 0;
    this.recommendationListeners.length = 0;
    this.systemStatusListeners.length = 0;
    this.connectionListeners.length = 0;
    this.activityUpdateListeners.length = 0;
    
    // Reset connection state
    this.reconnectAttempts = 0;
  }

  // Memory management - call this when component unmounts
  public destroy(): void {
    this.disconnect();
    this.cleanup();
    this.socket = null;
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.initializeConnection();
  }
}

// Create and export singleton instance
const realtimeService = new RealtimeService();
export { realtimeService };
export default realtimeService;