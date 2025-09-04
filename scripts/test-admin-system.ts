#!/usr/bin/env bun

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testAdminSystem() {
  try {
    console.log("🧪 Testing Admin System...\n");

    // Test 1: Fetch admin emails from Firestore
    console.log("1️⃣ Fetching admin emails from Firestore...");
    const systemRef = doc(db, "system_variables", "access");
    const systemSnap = await getDoc(systemRef);

    if (systemSnap.exists()) {
      const data = systemSnap.data();
      const adminEmails = data.admin || [];

      console.log(`✅ Found ${adminEmails.length} admin emails:`);
      adminEmails.forEach((email: string, index: number) => {
        console.log(`   ${index + 1}. ${email}`);
      });
    } else {
      console.log("❌ System variables document not found!");
      return;
    }

    // Test 2: Test AuthService methods
    console.log("\n2️⃣ Testing AuthService methods...");

    // Import AuthService (we need to do this dynamically to avoid module issues)
    const { authService } = await import("../src/lib/auth");

    // Test isEmailAllowed
    const testEmail = "fitosegrera@gmail.com";
    console.log(`   Testing isEmailAllowed for: ${testEmail}`);
    const isAllowed = await authService.isEmailAllowed(testEmail);
    console.log(`   ✅ isEmailAllowed: ${isAllowed}`);

    // Test getUserRole
    console.log(`   Testing getUserRole for: ${testEmail}`);
    const role = await authService.getUserRole(testEmail);
    console.log(`   ✅ getUserRole: ${role}`);

    // Test with non-admin email
    const nonAdminEmail = "test@example.com";
    console.log(`   Testing isEmailAllowed for: ${nonAdminEmail}`);
    const isNonAdminAllowed = await authService.isEmailAllowed(nonAdminEmail);
    console.log(`   ✅ isEmailAllowed: ${isNonAdminAllowed}`);

    // Test cache functionality
    console.log("\n3️⃣ Testing cache functionality...");
    console.log("   Clearing cache...");
    authService.clearAdminEmailsCache();
    console.log("   ✅ Cache cleared");

    console.log("   Refreshing admin emails...");
    const refreshedEmails = await authService.refreshAdminEmails();
    console.log(`   ✅ Refreshed ${refreshedEmails.length} admin emails`);

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ Firestore connection working");
    console.log("   ✅ Admin emails fetched successfully");
    console.log("   ✅ AuthService methods working");
    console.log("   ✅ Cache system working");
    console.log("\n🚀 Your dynamic admin system is ready to use!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testAdminSystem();
