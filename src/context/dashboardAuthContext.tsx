import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  // add more fields depending on your backend response
}

interface DashboardAuthContextType {
  user: User | null;
  logout: () => void;
  apiRequest: (url: string, options?: RequestInit) => Promise<Response | null>;
  authenticated: boolean;
}

const DashboardAuthContext = createContext<
  DashboardAuthContextType | undefined
>(undefined);

export const useDashboardAuth = (): DashboardAuthContextType => {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error(
      "useDashboardAuth must be used within DashboardAuthProvider"
    );
  }
  return context;
};

interface DashboardAuthProviderProps {
  children: ReactNode;
}

export const DashboardAuthProvider: React.FC<DashboardAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const apiRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response | null> => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      logout();
      return null;
    }

    return response;
  };

  const logout = (): void => {
    localStorage.removeItem("authToken");
    setUser(null);
    setAuthenticated(false);
    window.location.href = "https://adboxgh.com";
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = (await response.json()) as { user: User };
        setUser(userData.user);
        setAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      let token: string | null = null;

      if (urlToken) {
        localStorage.setItem("authToken", urlToken);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        token = urlToken;
      } else {
        token = localStorage.getItem("authToken");
      }

      if (!token) {
        window.location.href = "https://adboxgh.com";
        return;
      }

      const isValid = await verifyToken(token);

      if (!isValid) {
        localStorage.removeItem("authToken");
        window.location.href = "https://adboxgh.com";
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <DashboardAuthContext.Provider
      value={{ user, logout, apiRequest, authenticated }}
    >
      {children}
    </DashboardAuthContext.Provider>
  );
};
