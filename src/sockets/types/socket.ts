// types/socket.ts
export interface UserSocketState {
  userId: string;
  email: string;
  role: "PUBLISHER" | "VIEWER";
  socketId: string;
  rooms: string[];
  connectedAt: Date;
  lastActivityAt: Date;
  reconnectionCount: number;
  sessionData: Record<string, any>;
  videoSessions: VideoSession[];
  video_duration?: string;
}

export interface VideoSession {
  sessionId: string;
  videoId?: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  actions?: VideoAction[];
}

export interface VideoAction {
  type: "play" | "pause" | "seek" | "volume" | "fullscreen" | "quality";
  timestamp: Date;
  data?: any;
}

export interface ConnectionEstablishedPayload {
  isReconnection: boolean;
  userState: {
    email: string;
    role: string;
    reconnectionCount: number;
    connectedAt: Date;
  };
  message: string;
  timestamp: string;
}

export interface SessionRestorePayload {
  videoSessions: VideoSession[];
  message: string;
  timestamp: string;
}

export interface VideoSessionStartPayload {
  videoId?: string;
  video_duration?: string;
  [key: string]: any;
}

export interface VideoHeartbeatPayload {
  videoId: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  timestamp: Date;
}

export interface VideoActionPayload {
  videoId: string;
  action: VideoAction;
  currentTime: number;
  timestamp: Date;
}

export interface VideoSessionEndPayload {
  videoId: string;
  sessionId: string;
  duration: number;
  endedAt: Date;
}

export interface BroadcastPayload {
  type: string;
  message: string;
  data?: any;
  timestamp: Date;
}

export interface SocketConfig {
  url: string;
  token: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export interface SocketContextValue {
  socket: any | null;
  isConnected: boolean;
  isConnecting: boolean;
  userState: UserSocketState | null;
  connectionError: string | null;
  reconnectionCount: number;

  // Connection methods
  connect: (config?: SocketConfig) => void;
  disconnect: () => void;

  // Video session methods
  startVideoSession: (payload: VideoSessionStartPayload) => void;
  sendHeartbeat: (payload: VideoHeartbeatPayload) => void;
  sendVideoAction: (payload: VideoActionPayload) => void;
  endVideoSession: (payload: VideoSessionEndPayload) => void;

  // General methods
  sendPing: () => void;
  sendBroadcast: (payload: BroadcastPayload) => void;

  // Event listeners
  onConnectionEstablished: (
    callback: (data: ConnectionEstablishedPayload) => void
  ) => () => void;
  onSessionRestore: (
    callback: (data: SessionRestorePayload) => void
  ) => () => void;
  onMessage: (callback: (data: any) => void) => () => void;
  onUserLeft: (callback: (data: any) => void) => () => void;
}
