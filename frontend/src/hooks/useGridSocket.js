import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:3001";

export function useGridSocket() {
  const [nodes, setNodes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("⚡ Connected to GRIDMIND Socket.io server:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from GRIDMIND server");
      setConnected(false);
    });

    socket.on("grid:update", (data) => {
      if (data.nodes) setNodes(data.nodes);
      if (data.routes) setRoutes(data.routes);
      if (data.stats) setStats(data.stats);
      setLoading(false);
    });

    // Fallback REST fetch if socket takes a moment
    fetch(`${BACKEND_URL}/api/grid`)
      .then((res) => res.json())
      .then((data) => {
        if (data.nodes) setNodes(data.nodes);
        if (data.routes) setRoutes(data.routes);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Initial grid fetch fallback:", err.message);
        setLoading(false);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const crisisActive = nodes.some((n) => n.disabled);

  const triggerCrisis = useCallback(async () => {
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit("grid:crisis");
      } else {
        const res = await fetch(`${BACKEND_URL}/api/crisis`, { method: "POST" });
        const data = await res.json();
        if (data.nodes) setNodes(data.nodes);
        if (data.routes) setRoutes(data.routes);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Crisis trigger failed:", err);
    }
  }, []);

  const resetGrid = useCallback(async () => {
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit("grid:reset");
      } else {
        const res = await fetch(`${BACKEND_URL}/api/reset`, { method: "POST" });
        const data = await res.json();
        if (data.nodes) setNodes(data.nodes);
        if (data.routes) setRoutes(data.routes);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Grid reset failed:", err);
    }
  }, []);

  return {
    nodes,
    routes,
    stats,
    connected,
    loading,
    crisisActive,
    triggerCrisis,
    resetGrid,
    backendUrl: BACKEND_URL,
  };
}
