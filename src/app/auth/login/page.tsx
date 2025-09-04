"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/navigation/Navbar";
import { AuthDebug } from "@/components/debug/AuthDebug";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t0-text-primary mx-auto"></div>
            <Shield className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Cargando</h3>
            <p className="text-slate-600">Verificando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar variant="auth" backHref="/" backLabel="Volver al inicio" />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          {/* <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-muted-foreground">
              Accede a tu panel de administración de usuarios
            </p>
          </div> */}

          {/* Auth Forms */}
          <div className="space-y-6">
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Sistema seguro de gestión de usuarios con autenticación Firebase
            </p>
          </div>
        </div>
      </div>

      {/* Debug Component */}
      <AuthDebug />
    </div>
  );
}
