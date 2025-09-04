/**
 * Example Firestore Queries for User Data Management
 *
 * This file demonstrates various ways to query and manipulate user data
 * using the FirestoreService. These examples can be used as reference
 * for implementing additional features or custom queries.
 */

import { firestoreService } from "./firestore";
import { UserData } from "@/types/user";

export class ExampleQueries {
  /**
   * Example 1: Get all users with basic information
   * This is the most common query used in the dashboard
   */
  static async getAllUsersExample() {
    try {
      const users = await firestoreService.getAllUsers();
      console.log(`Found ${users.length} users`);

      // Display basic information for each user
      users.forEach((user) => {
        console.log(
          `${user.nombre} ${user.apellidos} - ${user.genero} - ${user.departmentOfResidency}`
        );
      });

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Example 2: Get comprehensive statistics
   * This query calculates various statistics from all user data
   */
  static async getStatisticsExample() {
    try {
      const statistics = await firestoreService.getUserStatistics();

      console.log("=== USER STATISTICS ===");
      console.log(`Total Users: ${statistics.totalUsers}`);
      console.log(`Gender Breakdown:`, statistics.genderBreakdown);
      console.log(`Department Breakdown:`, statistics.departmentBreakdown);
      console.log(`City Breakdown:`, statistics.cityBreakdown);
      console.log(`Acceptance Rates:`, statistics.acceptanceRates);
      console.log(`Age Groups:`, statistics.ageGroups);

      return statistics;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }

  /**
   * Example 3: Get users by specific department
   * This query filters users based on their department of residency
   */
  static async getUsersByDepartmentExample(department: string) {
    try {
      const users = await firestoreService.getUsersByDepartment(department);
      console.log(`Found ${users.length} users in ${department}`);

      users.forEach((user) => {
        console.log(
          `${user.nombre} ${user.apellidos} - ${user.cityOfResidence}`
        );
      });

      return users;
    } catch (error) {
      console.error("Error fetching users by department:", error);
      throw error;
    }
  }

  /**
   * Example 4: Get users by gender
   * This query filters users based on their gender
   */
  static async getUsersByGenderExample(gender: string) {
    try {
      const users = await firestoreService.getUsersByGender(gender);
      console.log(`Found ${users.length} ${gender.toLowerCase()} users`);

      return users;
    } catch (error) {
      console.error("Error fetching users by gender:", error);
      throw error;
    }
  }

  /**
   * Example 5: Add a new user with validation
   * This example shows how to add a new user with proper data validation
   */
  static async addUserExample(userData: Partial<UserData>) {
    try {
      // Validate required fields
      const requiredFields = [
        "nombre",
        "apellidos",
        "documentoDeIdentidad",
        "telefono",
        "genero",
      ];
      const missingFields = requiredFields.filter(
        (field) => !userData[field as keyof UserData]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Add the user
      const userId = await firestoreService.addUser(
        userData as Omit<UserData, "id" | "createdAt" | "updatedAt">
      );
      console.log(`User added successfully with ID: ${userId}`);

      return userId;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  /**
   * Example 6: Update user information
   * This example shows how to update specific fields of a user
   */
  static async updateUserExample(userId: string, updates: Partial<UserData>) {
    try {
      await firestoreService.updateUser(userId, updates);
      console.log(`User ${userId} updated successfully`);

      // Fetch the updated user to verify changes
      const updatedUser = await firestoreService.getUserById(userId);
      console.log("Updated user:", updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Example 7: Complex filtering and analysis
   * This example demonstrates how to perform complex analysis on user data
   */
  static async complexAnalysisExample() {
    try {
      const users = await firestoreService.getAllUsers();

      // Find users who have accepted all terms
      const fullyCompliantUsers = users.filter(
        (user) =>
          user.terminosYcondiciones &&
          user.politicaTratamientoDatos &&
          user.tratamientoDatosPersonales
      );

      console.log(`Fully compliant users: ${fullyCompliantUsers.length}`);

      // Find users by age range
      const now = new Date();
      const youngUsers = users.filter((user) => {
        const birthDate = user.fechaDeNacimiento.toDate();
        const age = now.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 25;
      });

      console.log(`Young users (18-25): ${youngUsers.length}`);

      // Find users with specific document types
      const cedulaUsers = users.filter(
        (user) => user.documentoDeIdentidad.tipo === "Cédula de Ciudadanía"
      );

      console.log(`Users with Cédula: ${cedulaUsers.length}`);

      // Calculate average phone number length (just for fun)
      const avgPhoneLength =
        users.reduce((sum, user) => sum + user.telefono.toString().length, 0) /
        users.length;

      console.log(`Average phone number length: ${avgPhoneLength.toFixed(2)}`);

      return {
        totalUsers: users.length,
        fullyCompliantUsers: fullyCompliantUsers.length,
        youngUsers: youngUsers.length,
        cedulaUsers: cedulaUsers.length,
        avgPhoneLength: avgPhoneLength,
      };
    } catch (error) {
      console.error("Error in complex analysis:", error);
      throw error;
    }
  }

  /**
   * Example 8: Export data with custom formatting
   * This example shows how to export user data in different formats
   */
  static async exportDataExample() {
    try {
      const users = await firestoreService.getAllUsers();

      // Export as JSON
      const jsonData = users.map((user) => ({
        id: user.id,
        fullName: `${user.nombre} ${user.apellidos}`,
        document: `${user.documentoDeIdentidad.tipo}: ${user.documentoDeIdentidad.numero}`,
        phone: user.telefono,
        gender: user.genero,
        location: `${user.cityOfResidence}, ${user.departmentOfResidency}`,
        compliance: {
          terms: user.terminosYcondiciones,
          policy: user.politicaTratamientoDatos,
          treatment: user.tratamientoDatosPersonales,
        },
      }));

      console.log("JSON Export:", JSON.stringify(jsonData, null, 2));

      // Export as CSV
      const csvHeaders = [
        "ID",
        "Full Name",
        "Document",
        "Phone",
        "Gender",
        "Location",
        "Terms",
        "Policy",
        "Treatment",
      ];
      const csvRows = users.map((user) => [
        user.id,
        `"${user.nombre} ${user.apellidos}"`,
        `"${user.documentoDeIdentidad.tipo}: ${user.documentoDeIdentidad.numero}"`,
        user.telefono,
        user.genero,
        `"${user.cityOfResidence}, ${user.departmentOfResidency}"`,
        user.terminosYcondiciones ? "Yes" : "No",
        user.politicaTratamientoDatos ? "Yes" : "No",
        user.tratamientoDatosPersonales ? "Yes" : "No",
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.join(","))
        .join("\n");

      console.log("CSV Export:");
      console.log(csvContent);

      return { jsonData, csvContent };
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }

  /**
   * Example 9: Real-time data monitoring
   * This example shows how to set up real-time monitoring of user data
   */
  static async monitorDataChanges() {
    try {
      console.log("Setting up real-time monitoring...");

      // This would typically use Firestore's onSnapshot for real-time updates
      // For demonstration, we'll just fetch data periodically
      const checkForUpdates = async () => {
        const users = await firestoreService.getAllUsers();
        const stats = await firestoreService.getUserStatistics();

        console.log(`[${new Date().toISOString()}] Data snapshot:`);
        console.log(`- Total users: ${users.length}`);
        console.log(`- Gender distribution:`, stats.genderBreakdown);
        console.log(
          `- Department distribution:`,
          Object.keys(stats.departmentBreakdown).length,
          "departments"
        );
      };

      // Check for updates every 30 seconds
      const interval = setInterval(checkForUpdates, 30000);

      // Initial check
      await checkForUpdates();

      // Return cleanup function
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error setting up monitoring:", error);
      throw error;
    }
  }
}

// Example usage function
export async function runExamples() {
  try {
    console.log("=== Running Firestore Query Examples ===\n");

    // Example 1: Get all users
    console.log("1. Getting all users...");
    await ExampleQueries.getAllUsersExample();
    console.log("\n");

    // Example 2: Get statistics
    console.log("2. Getting statistics...");
    await ExampleQueries.getStatisticsExample();
    console.log("\n");

    // Example 3: Complex analysis
    console.log("3. Running complex analysis...");
    await ExampleQueries.complexAnalysisExample();
    console.log("\n");

    // Example 4: Export data
    console.log("4. Exporting data...");
    await ExampleQueries.exportDataExample();
    console.log("\n");

    console.log("=== All examples completed successfully! ===");
  } catch (error) {
    console.error("Error running examples:", error);
  }
}
