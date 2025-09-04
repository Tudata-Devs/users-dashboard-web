import { Timestamp } from "firebase/firestore";

export interface DocumentoIdentidad {
  tipo: string;
  numero: string;
}

export interface UserData {
  id: string;
  nombre: string;
  apellidos: string;
  documentoDeIdentidad: DocumentoIdentidad;
  telefono: number;
  genero: string;
  fechaDeNacimiento: Timestamp;
  departmentOfResidency: string;
  cityOfResidence: string;
  urlDocumentoIdentidad: string;
  terminosYcondiciones: boolean;
  politicaTratamientoDatos: boolean;
  tratamientoDatosPersonales: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserStatistics {
  totalUsers: number;
  genderBreakdown: {
    male: number;
    female: number;
    other: number;
  };
  departmentBreakdown: Record<string, number>;
  cityBreakdown: Record<string, number>;
  acceptanceRates: {
    terminosYcondiciones: number;
    politicaTratamientoDatos: number;
    tratamientoDatosPersonales: number;
  };
  ageGroups: {
    "18-25": number;
    "26-35": number;
    "36-45": number;
    "46-55": number;
    "55+": number;
  };
}

export interface AllowedUser {
  email: string;
  role: "admin" | "user";
  isActive: boolean;
}
