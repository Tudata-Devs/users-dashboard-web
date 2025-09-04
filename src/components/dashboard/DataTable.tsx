"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  Copy,
  Check,
  Users,
  Database,
  FileText,
  Shield,
  UserCheck,
  Eye,
} from "lucide-react";
import { UserData } from "@/types/user";

interface DataTableProps {
  data: UserData[];
  loading: boolean;
  isConnected?: boolean;
  lastUpdate?: Date;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  loading,
  isConnected = false,
  lastUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<UserData[]>(data);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.nombre.toLowerCase().includes(searchLower) ||
        user.apellidos.toLowerCase().includes(searchLower) ||
        user.documentoDeIdentidad.numero.includes(searchTerm) ||
        user.telefono.toString().includes(searchTerm) ||
        user.departmentOfResidency.toLowerCase().includes(searchLower) ||
        user.cityOfResidence.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, data]);

  const formatDocumentType = (type: string) => {
    return type === "Cedula de Ciudadania" ? "CC" : type;
  };

  const formatPhoneNumber = (phone: number) => {
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
        3,
        6
      )}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  const copyUserId = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedId(userId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy user ID:", err);
    }
  };

  const openUserProfile = (user: UserData) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = [
      "ID",
      "Nombre",
      "Apellidos",
      "Tipo Documento",
      "Número Documento",
      "Teléfono",
      "Género",
      "Fecha Nacimiento",
      "Departamento",
      "Ciudad",
      "Términos y Condiciones",
      "Política Tratamiento Datos",
      "Autorización Tratamiento Datos",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map((user) =>
        [
          user.id,
          `"${user.nombre}"`,
          `"${user.apellidos}"`,
          `"${formatDocumentType(user.documentoDeIdentidad.tipo)}"`,
          `"${user.documentoDeIdentidad.numero}"`,
          user.telefono,
          `"${user.genero}"`,
          user.fechaDeNacimiento.toDate().toLocaleDateString("es-ES"),
          `"${user.departmentOfResidency}"`,
          `"${user.cityOfResidence}"`,
          user.terminosYcondiciones ? "Sí" : "No",
          user.politicaTratamientoDatos ? "Sí" : "No",
          user.tratamientoDatosPersonales ? "Sí" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `usuarios_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-foreground">
                Datos de Usuarios
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Cargando información...
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary mx-auto"></div>
              <p className="text-muted-foreground font-medium">
                Cargando datos...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="space-y-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground flex items-center gap-3">
                  Datos de Usuarios
                  <span className="text-sm font-normal text-muted-foreground">
                    ({filteredData.length} registros)
                  </span>
                  {isConnected && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Actualizaciones en Vivo
                    </span>
                  )}
                </CardTitle>
                {lastUpdate && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Última actualización:{" "}
                    {lastUpdate.toLocaleTimeString("es-ES")}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, apellidos, documento, teléfono, departamento o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-muted rounded-full w-fit mx-auto">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {searchTerm
                      ? "No se encontraron resultados"
                      : "No hay datos disponibles"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? "Intenta con otros términos de búsqueda"
                      : "Los datos aparecerán aquí cuando estén disponibles"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto px-8!">
              <Table className="">
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="font-medium text-muted-foreground">
                      ID
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Nombre
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Apellidos
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Documento
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Teléfono
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Género
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Fecha Nacimiento
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Departamento
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Ciudad
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Políticas
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={`transition-colors bg-card hover:bg-background duration-300 ease-in-out`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {user.id.slice(0, 8)}...
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyUserId(user.id)}
                            className="h-6 w-6 p-0 hover:bg-muted"
                          >
                            {copiedId === user.id ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {user.nombre}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.apellidos}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {formatDocumentType(user.documentoDeIdentidad.tipo)}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {user.documentoDeIdentidad.numero}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatPhoneNumber(user.telefono)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Badge
                          variant="outline"
                          className={
                            user.genero === "masculino"
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-pink-50 border-pink-200 text-pink-700"
                          }
                        >
                          {user.genero}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.fechaDeNacimiento
                          .toDate()
                          .toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.departmentOfResidency}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.cityOfResidence}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-xs">T&C</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Términos y Condiciones</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-primary" />
                                <span className="text-xs">PTD</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Política de Tratamiento de Datos</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <UserCheck className="h-4 w-4 text-primary" />
                                <span className="text-xs">ATD</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Autorización para Tratamiento de Datos</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUserProfile(user)}
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Perfil de Usuario
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-foreground">
                    {selectedUser.nombre.charAt(0).toUpperCase()}
                    {selectedUser.apellidos.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedUser.nombre} {selectedUser.apellidos}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {selectedUser.genero}
                  </Badge>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground text-base">
                    Información Personal
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Documento de Identidad
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formatDocumentType(
                          selectedUser.documentoDeIdentidad.tipo
                        )}{" "}
                        {selectedUser.documentoDeIdentidad.numero}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Teléfono
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formatPhoneNumber(selectedUser.telefono)}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Fecha de Nacimiento
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedUser.fechaDeNacimiento
                          .toDate()
                          .toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground text-base">
                    Ubicación
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Departamento
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedUser.departmentOfResidency}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Ciudad
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedUser.cityOfResidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground text-base">
                  Políticas y Términos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Términos y Condiciones
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedUser.terminosYcondiciones
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {selectedUser.terminosYcondiciones
                            ? "Aceptado"
                            : "No aceptado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Política de Tratamiento
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedUser.politicaTratamientoDatos
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {selectedUser.politicaTratamientoDatos
                            ? "Aceptado"
                            : "No aceptado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Autorización de Datos
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedUser.tratamientoDatosPersonales
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {selectedUser.tratamientoDatosPersonales
                            ? "Aceptado"
                            : "No aceptado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedUser.urlDocumentoIdentidad && (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground text-base">
                    Documentos
                  </h4>
                  <div className="p-4 border border-border rounded-lg bg-card/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            Documento de Identidad
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Archivo adjunto disponible
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            selectedUser.urlDocumentoIdentidad,
                            "_blank"
                          )
                        }
                        className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* User ID */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      ID de Usuario
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedUser.id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyUserId(selectedUser.id)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    {copiedId === selectedUser.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
