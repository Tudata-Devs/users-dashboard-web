"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navigation/Navbar";
import { Zap, Shield, CheckCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary mx-auto"></div>
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

  return (
    <div className="min-h-screen bg-background border-green-500 ">
      {/* Header */}
      <Navbar variant="home" />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 flex grow flex-col h-full">
        <div className="max-w-[1400px] min-h-[calc(100vh-10rem)] mx-auto px-6 lg:px-8 h-full flex items-center justify-center flex-col">
          <div className="text-center space-y-8 py-24">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Tiempo Real
                </span>
              </div>
              <h1 className="text-6xl max-w-4xl font-semibold text-foreground leading-tight">
                Panel de Administrativo de Usuarios Tudata
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Acceso seguro basado en roles a datos de usuarios con análisis
                completos y estadísticas en tiempo real para Tudata.
              </p>
            </div>

            <div className="flex justify-center mt-16">
              <Button
                onClick={() => router.push("/auth/login")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 text-lg"
              >
                Acceder al Panel
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="py-16 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Características Principales
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas avanzadas para la gestión eficiente de datos de
              usuarios
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-border bg-card shadow-sm">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Autenticación Segura
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Sistema de autenticación robusto con Firebase Auth y control
                  de acceso basado en roles
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card shadow-sm">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Visualización y administración completa de datos de usuarios
                  con interfaz intuitiva
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card shadow-sm">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Análisis en Tiempo Real
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Estadísticas y métricas actualizadas automáticamente con
                  Firestore en tiempo real
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card shadow-sm">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4">
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Base de Datos NoSQL
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Almacenamiento escalable y flexible con Firestore para manejo
                  eficiente de datos
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      {/* <div className="py-16 bg-primary">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-primary-foreground">
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Accede a tu panel de administración y comienza a gestionar los
              datos de usuarios de manera eficiente y segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/auth/login")}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 px-8 py-3 text-lg font-medium"
              >
                Iniciar Sesión
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      {/* <footer className="py-8 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-1.5 bg-primary rounded-lg">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                Panel de Usuarios
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema de gestión de usuarios con Firebase Authentication y
              Firestore
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>En Tiempo Real</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Escalable</span>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
