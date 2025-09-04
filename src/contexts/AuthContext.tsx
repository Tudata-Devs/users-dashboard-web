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
          console.log("Session token generated and stored");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
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
      pathname:
        typeof window !== "undefined" ? window.location.pathname : "server",
    });

    if (!loading && user && role) {
      // Only redirect if we're not already on the dashboard
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/dashboard")
      ) {
        console.log("Redirecting to dashboard...");
        window.location.href = "/dashboard";
      }
    }
  }, [user, role, loading, router]);

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
      localStorage.setItem("sessionToken", token);

      // Redirect to dashboard after successful sign in
      console.log("Sign in successful, redirecting to dashboard...");
      window.location.href = "/dashboard";
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
      localStorage.removeItem("sessionToken");
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
