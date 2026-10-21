import { useState, useEffect, useCallback } from "react";

const BACKEND_URL = "http://localhost:3001";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("gridmind_token") || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("gridmind_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Validate stored JWT token with backend on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("gridmind_token");
    if (!storedToken) return;

    fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("gridmind_user", JSON.stringify(data.user));
        }
      })
      .catch((err) => {
        console.warn("Session expired or invalid:", err.message);
        localStorage.removeItem("gridmind_token");
        localStorage.removeItem("gridmind_user");
        setUser(null);
        setToken(null);
      });
  }, []);

  const login = useCallback((authenticatedUser, authToken) => {
    setUser(authenticatedUser);
    setToken(authToken);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gridmind_token");
    localStorage.removeItem("gridmind_user");
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    token,
    login,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen,
    backendUrl: BACKEND_URL,
  };
}
