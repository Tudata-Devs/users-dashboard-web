"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStatistics } from "@/types/user";
import {
  Users,
  UserCheck,
  MapPin,
  TrendingUp,
  BarChart3,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface StatisticsCardsProps {
  statistics: UserStatistics;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  statistics,
}) => {
  const topDepartment =
    Object.keys(statistics.departmentBreakdown).length > 0
      ? Object.entries(statistics.departmentBreakdown).reduce((a, b) =>
          statistics.departmentBreakdown[a[0]] >
          statistics.departmentBreakdown[b[0]]
            ? a
            : b
        )[0]
      : null;

  const topDepartmentCount = topDepartment
    ? statistics.departmentBreakdown[topDepartment]
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Usuarios
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </div>
          <div className="p-2 bg-primary rounded-lg">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground mb-1">
            {statistics.totalUsers.toLocaleString("es-ES")}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Usuarios activos</span>
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Distribución por Género
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Desglose demográfico
            </p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Masculino</span>
              </div>
              <span className="font-medium text-foreground">
                {statistics.genderBreakdown.male}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Femenino</span>
              </div>
              <span className="font-medium text-foreground">
                {statistics.genderBreakdown.female}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span className="text-sm text-muted-foreground">Otro</span>
              </div>
              <span className="font-medium text-foreground">
                {statistics.genderBreakdown.other}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Department */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departamento Principal
            </CardTitle>
            <p className="text-xs text-muted-foreground">Con más usuarios</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {topDepartment ? (
            <div>
              <div className="text-xl font-semibold text-foreground mb-1">
                {topDepartment}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                <span>{topDepartmentCount} usuarios</span>
              </div>
            </div>
          ) : (
            <div className="text-xl font-semibold text-muted-foreground">-</div>
          )}
        </CardContent>
      </Card>

      {/* Acceptance Rate */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aceptación de Términos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Tasa de aceptación</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground mb-1">
            {statistics.acceptanceRates.terminosYcondiciones.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3" />
            <span>Términos y Condiciones</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
