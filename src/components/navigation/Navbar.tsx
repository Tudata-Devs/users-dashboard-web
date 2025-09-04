"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowRight, ArrowLeft, User, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavbarProps {
  variant?: "home" | "auth" | "dashboard";
  backHref?: string;
  backLabel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  variant = "home",
  backHref = "/",
  backLabel = "Volver al inicio",
}) => {
  const { user, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Home page navigation
  if (variant === "home") {
    return (
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 bg-primary rounded-full">
                <Image src="icon.svg" alt="Logo" width={28} height={28} />
              </div>
              <span className="font-semibold text-foreground hidden sm:block">
                Panel de Usuarios
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={() => (window.location.href = "/auth/login")}
                className="px-4!"
              >
                Iniciar Sesión
                <ArrowRight className="h-4 w-4 ml-0!" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    aria-label="Abrir menú"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <VisuallyHidden>
                    <h2>Menú de navegación</h2>
                  </VisuallyHidden>
                  <div className="flex flex-col h-full p-6">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-lg">
                          <Image
                            src="icon.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                          />
                        </div>
                        <span className="font-semibold text-foreground">
                          Panel de Usuarios
                        </span>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 py-6">
                      <nav className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Tema
                          </span>
                          <ThemeToggle />
                        </div>
                        <Button
                          onClick={() => {
                            window.location.href = "/auth/login";
                            closeMobileMenu();
                          }}
                          className="w-full justify-start"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Iniciar Sesión
                        </Button>
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Auth page navigation
  if (variant === "auth") {
    return (
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button */}
            <Link
              href={backHref}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium hidden sm:block">{backLabel}</span>
              <span className="font-medium sm:hidden">Atrás</span>
            </Link>

            {/* Logo */}
            {/* <div className="flex flex-col items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Image src="/icon.svg" alt="Logo" width={40} height={40} />
              </div>
            </div> */}

            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    aria-label="Abrir menú"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <VisuallyHidden>
                    <h2>Menú de navegación</h2>
                  </VisuallyHidden>
                  <div className="flex flex-col h-full p-6">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-lg">
                          <Image
                            src="icon.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                          />
                        </div>
                        <span className="font-semibold text-foreground">
                          Panel de Usuarios
                        </span>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 py-6">
                      <nav className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Tema
                          </span>
                          <ThemeToggle />
                        </div>
                        <Link
                          href={backHref}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          {backLabel}
                        </Link>
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard navigation
  if (variant === "dashboard" && user) {
    return (
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Image src="icon.svg" alt="Logo" width={24} height={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">
                  Panel de Usuarios
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestión de datos en tiempo real
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-semibold text-foreground">Panel</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted rounded-full">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground truncate max-w-32">
                    {user.email}
                  </p>
                  <p className="text-muted-foreground capitalize">
                    {role === "admin" ? "Administrador" : "Usuario"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    aria-label="Abrir menú"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <VisuallyHidden>
                    <h2>Menú de navegación</h2>
                  </VisuallyHidden>
                  <div className="flex flex-col h-full p-6">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-lg">
                          <Image
                            src="icon.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                          />
                        </div>
                        <span className="font-semibold text-foreground">
                          Panel de Usuarios
                        </span>
                      </div>
                    </div>

                    {/* Mobile User Info */}
                    <div className="py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.email}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {role === "admin" ? "Administrador" : "Usuario"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 py-6">
                      <nav className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Tema
                          </span>
                          <ThemeToggle />
                        </div>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full justify-start border-border text-muted-foreground hover:bg-muted"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return null;
};
