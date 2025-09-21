// socket.service.ts
import { io, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import { Storage } from "../helpers/local.storage";
import { ConnectionEnum } from "./types/socket";
import { toast } from "sonner";

const url = import.meta.env.VITE_SOCKET_URL;

// 🔔 global Subject (event bus)
const listenerSubject = new Subject<any>();

let socket: Socket | null = null;

const initSocket = () => {
  const token = Storage.getToken();
  if (!token) return;

  const { id: publisherId } = Storage.getPublisherId("publisherId") || {};
  socket = io(`${url}`, {
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionAttempts: 5,
    autoConnect: true,
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
    listenerSubject.next({
      listener: "connection",
      data: { stage: ConnectionEnum.connected },
    });
    if (socket) {
      console.log("Emitting join for publisherId:", publisherId);
      socket.emit("join", `${publisherId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.io.on("reconnect_attempt", () => {
    listenerSubject.next({
      listener: "connection",
      data: { stage: ConnectionEnum.reconnecting },
    });
  });

  socket.io.on("reconnect_failed", async () => {
    listenerSubject.next({
      listener: "connection",
      data: { stage: ConnectionEnum.disconnected },
    });
    if (socket) await destroySocket(socket);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("joinedRoom", (data) => {
    console.log(data.message);
  });

  return socket;
};

const destroySocket = async (s: Socket) => {
  s.disconnect();
  toast.error("❌ Disconnected from socket");
  window.location.reload();
};

export const socketService = {
  initSocket,
  listener$: listenerSubject.asObservable(),
  get socket() {
    return socket;
  },
};
