import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { apiConfig } from "@juice-vibe/config";

export function useOrdersSocket(onNewOrder: (order: any) => void) {
  const socketRef = useRef<Socket | null>(null);
  const callbackRef = useRef(onNewOrder);

  // Keep callback ref fresh without re-creating the socket
  useEffect(() => {
    callbackRef.current = onNewOrder;
  }, [onNewOrder]);

  useEffect(() => {
    const socket = io(apiConfig.wsUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[OrdersSocket] Connected:", socket.id);
    });

    socket.on("newOrder", (order: any) => {
      callbackRef.current(order);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[OrdersSocket] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[OrdersSocket] Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // mount once

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  return { disconnect };
}
