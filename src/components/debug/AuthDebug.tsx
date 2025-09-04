"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface DebugInfo {
  user: { uid: string; email: string | null } | null;
  role: string | null;
  loading: boolean;
  sessionToken: string | null;
  pathname: string;
  timestamp: string;
}

export const AuthDebug: React.FC = () => {
  const { user, role, loading, sessionToken } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    user: null,
    role: null,
    loading: true,
    sessionToken: null,
    pathname: "server",
    timestamp: "",
  });

  useEffect(() => {
    const info = {
      user: user ? { uid: user.uid, email: user.email } : null,
      role,
      loading,
      sessionToken: sessionToken ? "Present" : "Missing",
      pathname:
        typeof window !== "undefined" ? window.location.pathname : "server",
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
    console.log("Auth Debug Info:", info);
  }, [user, role, loading, sessionToken]);

  // Only show in development or when there's an issue
  if (process.env.NODE_ENV === "production" && !debugInfo.loading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="font-bold mb-2">Auth Debug</div>
      <div className="space-y-1">
        <div>User: {debugInfo.user ? "✓" : "✗"}</div>
        <div>Role: {debugInfo.role || "none"}</div>
        <div>Loading: {debugInfo.loading ? "✓" : "✗"}</div>
        <div>Token: {debugInfo.sessionToken}</div>
        <div>Path: {debugInfo.pathname}</div>
        <div>Time: {debugInfo.timestamp}</div>
      </div>
    </div>
  );
};
