import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserData, UserStatistics } from "@/types/user";

export class FirestoreService {
  private static instance: FirestoreService;
  private collectionName = "users";

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  // Get all user documents
  async getAllUsers(): Promise<UserData[]> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Get a specific user by ID
  async getUserById(userId: string): Promise<UserData | null> {
    try {
      const usersRef = collection(db, this.collectionName);
      const userSnap = await getDocs(usersRef);

      const userDoc = userSnap.docs.find((doc) => doc.id === userId);
      if (userDoc) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
        } as UserData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Add a new user document
  async addUser(
    data: Omit<UserData, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const usersRef = collection(db, this.collectionName);
      const docData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(usersRef, docData);
      return docRef.id;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  // Update an existing user
  async updateUser(userId: string, data: Partial<UserData>): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Get comprehensive statistics from all user data
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const users = await this.getAllUsers();

      // Calculate gender breakdown
      const genderBreakdown = users.reduce(
        (acc, user) => {
          const gender = user.genero.toLowerCase();
          if (gender === "masculino" || gender === "male") {
            acc.male++;
          } else if (gender === "femenino" || gender === "female") {
            acc.female++;
          } else {
            acc.other++;
          }
          return acc;
        },
        { male: 0, female: 0, other: 0 }
      );

      // Calculate department breakdown
      const departmentBreakdown = users.reduce((acc, user) => {
        const dept = user.departmentOfResidency;
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate city breakdown
      const cityBreakdown = users.reduce((acc, user) => {
        const city = user.cityOfResidence;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate acceptance rates
      const acceptanceRates = {
        terminosYcondiciones:
          users.length > 0
            ? (users.filter((u) => u.terminosYcondiciones).length /
                users.length) *
              100
            : 0,
        politicaTratamientoDatos:
          users.length > 0
            ? (users.filter((u) => u.politicaTratamientoDatos).length /
                users.length) *
              100
            : 0,
        tratamientoDatosPersonales:
          users.length > 0
            ? (users.filter((u) => u.tratamientoDatosPersonales).length /
                users.length) *
              100
            : 0,
      };

      // Calculate age groups
      const now = new Date();
      const ageGroups = users.reduce(
        (acc, user) => {
          const birthDate = user.fechaDeNacimiento.toDate();
          const age = now.getFullYear() - birthDate.getFullYear();

          if (age >= 18 && age <= 25) {
            acc["18-25"]++;
          } else if (age >= 26 && age <= 35) {
            acc["26-35"]++;
          } else if (age >= 36 && age <= 45) {
            acc["36-45"]++;
          } else if (age >= 46 && age <= 55) {
            acc["46-55"]++;
          } else if (age > 55) {
            acc["55+"]++;
          }

          return acc;
        },
        { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "55+": 0 }
      );

      return {
        totalUsers: users.length,
        genderBreakdown,
        departmentBreakdown,
        cityBreakdown,
        acceptanceRates,
        ageGroups,
      };
    } catch (error) {
      console.error("Error calculating statistics:", error);
      throw error;
    }
  }

  // Get users by department
  async getUsersByDepartment(department: string): Promise<UserData[]> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(
        usersRef,
        where("departmentOfResidency", "==", department)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    } catch (error) {
      console.error("Error fetching users by department:", error);
      throw error;
    }
  }

  // Get users by gender
  async getUsersByGender(gender: string): Promise<UserData[]> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, where("genero", "==", gender));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    } catch (error) {
      console.error("Error fetching users by gender:", error);
      throw error;
    }
  }

  // Real-time listener for all users
  subscribeToUsers(
    onUpdate: (users: UserData[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserData[];

          console.log(`Real-time update: ${users.length} users received`);
          onUpdate(users);
        },
        (error) => {
          console.error("Real-time listener error:", error);
          if (onError) {
            onError(error);
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up real-time listener:", error);
      if (onError) {
        onError(error as Error);
      }
      // Return a no-op unsubscribe function
      return () => {};
    }
  }

  // Real-time listener for user statistics
  subscribeToUserStatistics(
    onUpdate: (statistics: UserStatistics) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserData[];

          // Calculate statistics from the updated users
          const statistics = this.calculateStatistics(users);
          console.log("Real-time statistics update:", statistics);
          onUpdate(statistics);
        },
        (error) => {
          console.error("Real-time statistics listener error:", error);
          if (onError) {
            onError(error);
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up statistics listener:", error);
      if (onError) {
        onError(error as Error);
      }
      return () => {};
    }
  }

  // Get admin emails from system_variables collection
  async getAdminEmails(): Promise<string[]> {
    try {
      const systemRef = doc(db, "system_variables", "access");
      const systemSnap = await getDoc(systemRef);

      if (systemSnap.exists()) {
        const data = systemSnap.data();
        return data.admin || [];
      }

      console.warn(
        "System variables document not found, returning empty admin list"
      );
      return [];
    } catch (error) {
      console.error("Error fetching admin emails:", error);
      throw error;
    }
  }

  // Update admin emails in system_variables collection
  async updateAdminEmails(emails: string[]): Promise<void> {
    try {
      const systemRef = doc(db, "system_variables", "access");
      await updateDoc(systemRef, {
        admin: emails,
        updatedAt: Timestamp.now(),
      });
      console.log(`Updated admin emails: ${emails.join(", ")}`);
    } catch (error) {
      console.error("Error updating admin emails:", error);
      throw error;
    }
  }

  // Add a new admin email
  async addAdminEmail(email: string): Promise<void> {
    try {
      const currentEmails = await this.getAdminEmails();
      if (currentEmails.includes(email)) {
        throw new Error("Email already exists in admin list");
      }

      const updatedEmails = [...currentEmails, email];
      await this.updateAdminEmails(updatedEmails);
    } catch (error) {
      console.error("Error adding admin email:", error);
      throw error;
    }
  }

  // Remove an admin email
  async removeAdminEmail(email: string): Promise<void> {
    try {
      const currentEmails = await this.getAdminEmails();
      const updatedEmails = currentEmails.filter((e) => e !== email);

      if (updatedEmails.length === currentEmails.length) {
        throw new Error("Email not found in admin list");
      }

      await this.updateAdminEmails(updatedEmails);
    } catch (error) {
      console.error("Error removing admin email:", error);
      throw error;
    }
  }

  // Helper method to calculate statistics from user data
  private calculateStatistics(users: UserData[]): UserStatistics {
    // Calculate gender breakdown
    const genderBreakdown = users.reduce(
      (acc, user) => {
        const gender = user.genero.toLowerCase();
        if (gender === "masculino" || gender === "male") {
          acc.male++;
        } else if (gender === "femenino" || gender === "female") {
          acc.female++;
        } else {
          acc.other++;
        }
        return acc;
      },
      { male: 0, female: 0, other: 0 }
    );

    // Calculate department breakdown
    const departmentBreakdown = users.reduce((acc, user) => {
      const dept = user.departmentOfResidency;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate city breakdown
    const cityBreakdown = users.reduce((acc, user) => {
      const city = user.cityOfResidence;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate acceptance rates
    const acceptanceRates = {
      terminosYcondiciones:
        users.length > 0
          ? (users.filter((u) => u.terminosYcondiciones).length /
              users.length) *
            100
          : 0,
      politicaTratamientoDatos:
        users.length > 0
          ? (users.filter((u) => u.politicaTratamientoDatos).length /
              users.length) *
            100
          : 0,
      tratamientoDatosPersonales:
        users.length > 0
          ? (users.filter((u) => u.tratamientoDatosPersonales).length /
              users.length) *
            100
          : 0,
    };

    // Calculate age groups
    const now = new Date();
    const ageGroups = users.reduce(
      (acc, user) => {
        const birthDate = user.fechaDeNacimiento.toDate();
        const age = now.getFullYear() - birthDate.getFullYear();

        if (age >= 18 && age <= 25) {
          acc["18-25"]++;
        } else if (age >= 26 && age <= 35) {
          acc["26-35"]++;
        } else if (age >= 36 && age <= 45) {
          acc["36-45"]++;
        } else if (age >= 46 && age <= 55) {
          acc["46-55"]++;
        } else if (age > 55) {
          acc["55+"]++;
        }

        return acc;
      },
      { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "55+": 0 }
    );

    return {
      totalUsers: users.length,
      genderBreakdown,
      departmentBreakdown,
      cityBreakdown,
      acceptanceRates,
      ageGroups,
    };
  }
}

export const firestoreService = FirestoreService.getInstance();
