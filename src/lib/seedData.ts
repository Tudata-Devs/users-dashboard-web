import { firestoreService } from "./firestore";
import { UserData } from "@/types/user";
import { Timestamp } from "firebase/firestore";

// Sample data for testing the application
const sampleUsers: Omit<UserData, "id" | "createdAt" | "updatedAt">[] = [
  {
    nombre: "Juan",
    apellidos: "Pérez García",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "12345678",
    },
    telefono: 3001234567,
    genero: "Masculino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1990-05-15")),
    departmentOfResidency: "Cundinamarca",
    cityOfResidence: "Bogotá",
    urlDocumentoIdentidad: "https://example.com/docs/juan-perez-cc.pdf",
    terminosYcondiciones: true,
    politicaTratamientoDatos: true,
    tratamientoDatosPersonales: true,
  },
  {
    nombre: "María",
    apellidos: "López Rodríguez",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "87654321",
    },
    telefono: 3007654321,
    genero: "Femenino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1985-08-22")),
    departmentOfResidency: "Antioquia",
    cityOfResidence: "Medellín",
    urlDocumentoIdentidad: "https://example.com/docs/maria-lopez-cc.pdf",
    terminosYcondiciones: true,
    politicaTratamientoDatos: false,
    tratamientoDatosPersonales: true,
  },
  {
    nombre: "Carlos",
    apellidos: "González Martínez",
    documentoDeIdentidad: {
      tipo: "Pasaporte",
      numero: "AB123456",
    },
    telefono: 3009876543,
    genero: "Masculino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1992-12-10")),
    departmentOfResidency: "Valle del Cauca",
    cityOfResidence: "Cali",
    urlDocumentoIdentidad:
      "https://example.com/docs/carlos-gonzalez-passport.pdf",
    terminosYcondiciones: true,
    politicaTratamientoDatos: true,
    tratamientoDatosPersonales: false,
  },
  {
    nombre: "Ana",
    apellidos: "Sánchez Torres",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "11223344",
    },
    telefono: 3004567890,
    genero: "Femenino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1988-03-18")),
    departmentOfResidency: "Santander",
    cityOfResidence: "Bucaramanga",
    urlDocumentoIdentidad: "https://example.com/docs/ana-sanchez-cc.pdf",
    terminosYcondiciones: false,
    politicaTratamientoDatos: true,
    tratamientoDatosPersonales: true,
  },
  {
    nombre: "Luis",
    apellidos: "Hernández Vargas",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "55667788",
    },
    telefono: 3002345678,
    genero: "Masculino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1995-07-03")),
    departmentOfResidency: "Cundinamarca",
    cityOfResidence: "Soacha",
    urlDocumentoIdentidad: "https://example.com/docs/luis-hernandez-cc.pdf",
    terminosYcondiciones: true,
    politicaTratamientoDatos: true,
    tratamientoDatosPersonales: true,
  },
  {
    nombre: "Isabel",
    apellidos: "Ramírez Jiménez",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "99887766",
    },
    telefono: 3006789012,
    genero: "Femenino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1991-11-25")),
    departmentOfResidency: "Antioquia",
    cityOfResidence: "Envigado",
    urlDocumentoIdentidad: "https://example.com/docs/isabel-ramirez-cc.pdf",
    terminosYcondiciones: true,
    politicaTratamientoDatos: false,
    tratamientoDatosPersonales: false,
  },
  {
    nombre: "Roberto",
    apellidos: "Morales Castro",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "33445566",
    },
    telefono: 3003456789,
    genero: "Masculino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1987-09-14")),
    departmentOfResidency: "Valle del Cauca",
    cityOfResidence: "Palmira",
    urlDocumentoIdentidad: "https://example.com/docs/roberto-morales-cc.pdf",
    terminosYcondiciones: false,
    politicaTratamientoDatos: true,
    tratamientoDatosPersonales: true,
  },
  {
    nombre: "Carmen",
    apellidos: "Vega Ruiz",
    documentoDeIdentidad: {
      tipo: "Cédula de Ciudadanía",
      numero: "77889900",
    },
    telefono: 3005678901,
    genero: "Femenino",
    fechaDeNacimiento: Timestamp.fromDate(new Date("1993-01-30")),
    departmentOfResidency: "Santander",
    cityOfResidence: "Floridablanca",
    urlDocumentoIdentidad: "https://example.com/docs/carmen-vega-cc.pdf",
    terminosYcondiciones: true,
    politicaTratamientoDatos: true,
    tratamientoDatosPersonales: true,
  },
];

export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    for (const userData of sampleUsers) {
      const userId = await firestoreService.addUser(userData);
      console.log(
        `Added user: ${userData.nombre} ${userData.apellidos} (ID: ${userId})`
      );
    }

    console.log("Database seeding completed successfully!");
    console.log(`Added ${sampleUsers.length} users to the database.`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

// Function to clear all users (for testing)
export const clearDatabase = async () => {
  try {
    console.log("Clearing database...");
    const users = await firestoreService.getAllUsers();

    for (const user of users) {
      await firestoreService.deleteUser(user.id);
      console.log(`Deleted user: ${user.id}`);
    }

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
};
