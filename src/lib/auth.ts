import {
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { AllowedUser } from "@/types/user";
import { firestoreService } from "./firestore";

// Cache for admin emails to avoid repeated Firestore calls
let adminEmailsCache: string[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Fetch admin emails from Firestore with caching
  private async getAdminEmails(): Promise<string[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (adminEmailsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
      return adminEmailsCache;
    }

    try {
      const emails = await firestoreService.getAdminEmails();
      adminEmailsCache = emails;
      cacheTimestamp = now;
      console.log(`Fetched ${emails.length} admin emails from Firestore`);
      return emails;
    } catch (error) {
      console.error("Error fetching admin emails:", error);
      // Return cached data if available, otherwise return empty array
      return adminEmailsCache.length > 0 ? adminEmailsCache : [];
    }
  }

  // Convert admin emails to AllowedUser format
  private async getAllowedUsers(): Promise<AllowedUser[]> {
    const adminEmails = await this.getAdminEmails();
    return adminEmails.map((email) => ({
      email,
      role: "admin" as const,
      isActive: true,
    }));
  }

  // Clear admin emails cache (useful when admin emails are updated)
  clearAdminEmailsCache(): void {
    adminEmailsCache = [];
    cacheTimestamp = 0;
    console.log("Admin emails cache cleared");
  }

  // Force refresh admin emails from Firestore
  async refreshAdminEmails(): Promise<string[]> {
    this.clearAdminEmailsCache();
    return await this.getAdminEmails();
  }

  // Check if email is in allowed users list
  async isEmailAllowed(email: string): Promise<boolean> {
    const allowedUsers = await this.getAllowedUsers();
    return allowedUsers.some((user) => user.email === email && user.isActive);
  }

  // Get user role from allowed users list
  async getUserRole(email: string): Promise<"admin" | "user" | null> {
    const allowedUsers = await this.getAllowedUsers();
    const user = allowedUsers.find((u) => u.email === email && u.isActive);
    return user ? user.role : null;
  }

  // Sign in with email and password
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; role: string }> {
    try {
      // Check if email is allowed before attempting sign in
      const isAllowed = await this.isEmailAllowed(email);
      if (!isAllowed) {
        throw new Error(
          "Access denied. Your email is not authorized to use this application."
        );
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const role = await this.getUserRole(email);

      if (!role) {
        await signOut(auth);
        throw new Error("Access denied. Unable to determine user role.");
      }

      return { user: userCredential.user, role };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      throw new Error(errorMessage);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      throw new Error("Failed to sign out");
    }
  }

  // Get current user with role
  async getCurrentUser(): Promise<{ user: User | null; role: string | null }> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe after first call
        if (user) {
          const role = await this.getUserRole(user.email || "");
          resolve({ user, role });
        } else {
          resolve({ user: null, role: null });
        }
      });
    });
  }

  // Generate a simple token for session management
  generateSessionToken(userId: string, role: string): string {
    const tokenData = {
      userId,
      role,
      timestamp: Date.now(),
    };
    return btoa(JSON.stringify(tokenData));
  }

  // Validate session token
  validateSessionToken(token: string): {
    userId: string;
    role: string;
    isValid: boolean;
  } {
    try {
      const tokenData = JSON.parse(atob(token));
      const now = Date.now();
      const tokenAge = now - tokenData.timestamp;

      // Token expires after 24 hours
      const isValid = tokenAge < 24 * 60 * 60 * 1000;

      return {
        userId: tokenData.userId,
        role: tokenData.role,
        isValid,
      };
    } catch {
      return {
        userId: "",
        role: "",
        isValid: false,
      };
    }
  }
}

export const authService = AuthService.getInstance();
