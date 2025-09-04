"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { user: currentUser, role: userRole } =
          await authService.getCurrentUser();
        console.log("Auth initialization result:", {
          user: !!currentUser,
          role: userRole,
        });

        setUser(currentUser);
        setRole(userRole);

        if (currentUser && userRole) {
          const token = authService.generateSessionToken(
            currentUser.uid,
            userRole
          );
          setSessionToken(token);
          localStorage.setItem("sessionToken", token);
          document.cookie = `sessionToken=${token}; path=/; max-age=${
            24 * 60 * 60
          }; SameSite=Lax`;
          console.log("Session token generated and stored");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
        setIsRedirecting(false);
      }
    };

    initializeAuth();
  }, []);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    console.log("Auth redirect effect:", {
      loading,
      user: !!user,
      role,
      isRedirecting,
      pathname:
        typeof window !== "undefined" ? window.location.pathname : "server",
    });

    if (!loading && user && role && !isRedirecting) {
      // Only redirect if we're not already on the dashboard
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/dashboard")
      ) {
        console.log("Redirecting to dashboard...");
        setIsRedirecting(true);

        // Add a timeout to reset redirecting flag in case of issues
        const timeoutId = setTimeout(() => {
          console.log("Redirect timeout, resetting flag");
          setIsRedirecting(false);
        }, 5000);

        router.push("/dashboard");

        // Clear timeout if component unmounts
        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, role, loading, isRedirecting, router]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: signedInUser, role: userRole } = await authService.signIn(
        email,
        password
      );
      setUser(signedInUser);
      setRole(userRole);

      const token = authService.generateSessionToken(
        signedInUser.uid,
        userRole
      );
      setSessionToken(token);

      // Store in both localStorage and cookies for compatibility
      localStorage.setItem("sessionToken", token);
      document.cookie = `sessionToken=${token}; path=/; max-age=${
        24 * 60 * 60
      }; SameSite=Lax`;

      // Use router.push instead of window.location.href for better Next.js integration
      console.log("Sign in successful, redirecting to dashboard...");
      setIsRedirecting(true);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setRole(null);
      setSessionToken(null);
      setIsRedirecting(false);
      localStorage.removeItem("sessionToken");
      // Clear cookie
      document.cookie =
        "sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    role,
    loading,
    signIn,
    logout,
    sessionToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
