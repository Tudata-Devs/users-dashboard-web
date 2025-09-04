"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { firestoreService } from "@/lib/firestore";
import { UserData, UserStatistics } from "@/types/user";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { DataTable } from "@/components/dashboard/DataTable";
import { Navbar } from "@/components/navigation/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, Shield } from "lucide-react";
import { Unsubscribe } from "firebase/firestore";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Refs to store unsubscribe functions
  const usersUnsubscribeRef = useRef<Unsubscribe | null>(null);
  const statsUnsubscribeRef = useRef<Unsubscribe | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Set up real-time listeners when user is authenticated
  useEffect(() => {
    if (user) {
      console.log("Setting up real-time listeners...");
      setLoading(true);
      setError("");

      // Set up users listener
      usersUnsubscribeRef.current = firestoreService.subscribeToUsers(
        (usersData) => {
          console.log(`Received ${usersData.length} users`);
          setUsers(usersData);
          setLastUpdate(new Date());
          setIsConnected(true);
          setLoading(false);
        },
        (error) => {
          console.error("Users listener error:", error);
          setError("Failed to load users data. Please try again.");
          setIsConnected(false);
          setLoading(false);
        }
      );

      // Set up statistics listener
      statsUnsubscribeRef.current = firestoreService.subscribeToUserStatistics(
        (statisticsData) => {
          console.log("Received updated statistics:", statisticsData);
          setStatistics(statisticsData);
        },
        (error) => {
          console.error("Statistics listener error:", error);
          setError("Failed to load statistics. Please try again.");
          setIsConnected(false);
        }
      );

      // Cleanup function
      return () => {
        console.log("Cleaning up real-time listeners...");
        if (usersUnsubscribeRef.current) {
          usersUnsubscribeRef.current();
        }
        if (statsUnsubscribeRef.current) {
          statsUnsubscribeRef.current();
        }
      };
    }
  }, [user]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      if (usersUnsubscribeRef.current) {
        usersUnsubscribeRef.current();
      }
      if (statsUnsubscribeRef.current) {
        statsUnsubscribeRef.current();
      }
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t0-text-primary mx-auto"></div>
            <Shield className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Cargando Dashboard
            </h3>
            <p className="text-slate-600">Verificando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar variant="dashboard" />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">En Vivo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Desconectado</span>
                  </div>
                )}
                {lastUpdate && (
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    <span>
                      Última actualización:{" "}
                      {lastUpdate.toLocaleTimeString("es-ES")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              ¡Bienvenido, {user.email?.split("@")[0]}!
            </h2>
            <p className="text-muted-foreground">
              Aquí tienes una vista general de todos los datos de usuarios y
              estadísticas en tiempo real.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-destructive mb-1">
                      Error de Conexión
                    </h3>
                    <p className="text-destructive/80 text-sm">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setError("")}
                      className="mt-3 border-destructive/20 text-destructive hover:bg-destructive/5"
                    >
                      Intentar de Nuevo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics Cards */}
          {statistics && <StatisticsCards statistics={statistics} />}

          {/* Data Table */}
          <DataTable
            data={users}
            loading={loading}
            isConnected={isConnected}
            lastUpdate={lastUpdate || undefined}
          />
        </div>
      </main>
    </div>
  );
}
