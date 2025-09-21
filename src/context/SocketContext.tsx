// context/SocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { socketService } from "../sockets/connections";

interface SocketContextValue {
  socket: ReturnType<typeof socketService.initSocket> | null;
  isConnected: boolean;
  testEventData: any | null;
  UploadingEventData: any | null;
  publishedVideo: any | null;
  UploadedTos3: any | null;
}

const SocketContext = createContext<SocketContextValue | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [testEventData, setTestEventData] = useState<any | null>(null);
  const [UploadingEventData, setUploadingEventData] = useState<any | null>(
    null
  );
  const [publishedVideo, setpublishedVideo] = useState<any | null>(null);
  const [UploadedTos3, setUploadedTos3] = useState<any | null>(null);

  useEffect(() => {
    // 🔌 initialize socket from service
    const newSocket = socketService.initSocket();
    setSocket(newSocket);

    if (!newSocket) return;

    // ✅ connection listeners
    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    // 🎯 only care about test-event
    newSocket.on("test-event", (data: any) => {
      setTestEventData(data);
    });

    newSocket.on("UploadCompleted", (data: any) => {
      setUploadingEventData(data);
    });

    newSocket.on("uploaded-to-s3", (data: any) => {
      console.log("Tooooooo s3", data);
      setUploadedTos3(data);
    });

    newSocket.on("published", (data: any) => {
      console.log("published ", data);

      setpublishedVideo(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const value: SocketContextValue = {
    socket,
    publishedVideo,
    isConnected,
    UploadingEventData,
    testEventData,
    UploadedTos3,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
