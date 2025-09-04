#!/usr/bin/env bun

import { firestoreService } from "../src/lib/firestore";
import { Timestamp } from "firebase/firestore";

async function addTestUser() {
  try {
    console.log("Adding test user...");

    const testUser = {
      nombre: "Test User",
      apellidos: "Real-time Test",
      documentoDeIdentidad: {
        tipo: "Cédula de Ciudadanía",
        numero: "TEST123456",
      },
      telefono: 3001234567,
      genero: "Masculino",
      fechaDeNacimiento: Timestamp.fromDate(new Date("1990-01-01")),
      departmentOfResidency: "Cundinamarca",
      cityOfResidence: "Bogotá",
      urlDocumentoIdentidad: "https://example.com/test.pdf",
      terminosYcondiciones: true,
      politicaTratamientoDatos: true,
      tratamientoDatosPersonales: true,
    };

    const userId = await firestoreService.addUser(testUser);
    console.log(`✅ Test user added successfully with ID: ${userId}`);
    console.log(
      "You should see this user appear in the dashboard in real-time!"
    );
  } catch (error) {
    console.error("❌ Error adding test user:", error);
  }
}

addTestUser();
