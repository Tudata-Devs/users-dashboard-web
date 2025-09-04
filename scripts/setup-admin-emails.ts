#!/usr/bin/env bun

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration (same as in your .env.local)
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

async function setupAdminEmails() {
  try {
    console.log("Setting up admin emails in system_variables collection...");

    // Create the system_variables/access document with admin emails array
    const adminEmails = [
      "fitosegrera@gmail.com",
      // Add more admin emails here as needed
    ];

    await setDoc(doc(db, "system_variables", "access"), {
      admin: adminEmails,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin emails setup completed successfully!");
    console.log(`📧 Admin emails configured: ${adminEmails.join(", ")}`);
    console.log(
      "🔧 You can now add/remove admin emails from the Firestore console"
    );
    console.log("📍 Collection: system_variables");
    console.log("📍 Document: access");
    console.log("📍 Field: admin (array of email strings)");
  } catch (error) {
    console.error("❌ Error setting up admin emails:", error);
    process.exit(1);
  }
}

// Run the setup
setupAdminEmails();
