#!/usr/bin/env bun

import { seedDatabase, clearDatabase } from "../src/lib/seedData";

async function main() {
  const command = process.argv[2];

  try {
    if (command === "seed") {
      await seedDatabase();
    } else if (command === "clear") {
      await clearDatabase();
    } else if (command === "reset") {
      console.log("Clearing existing data...");
      await clearDatabase();
      console.log("Seeding new data...");
      await seedDatabase();
    } else {
      console.log("Usage: bun run seed [seed|clear|reset]");
      console.log("  seed  - Add sample data to the database");
      console.log("  clear - Remove all data from the database");
      console.log("  reset - Clear and then seed the database");
      process.exit(1);
    }
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  }
}

main();
