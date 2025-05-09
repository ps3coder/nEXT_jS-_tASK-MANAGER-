// Script to test MongoDB connection
const mongoose = require("mongoose");

// Hardcoded connection URI (replace with your actual database name if different)
const MONGODB_URI = "mongodb://localhost:27017/todo-app";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    console.log(`Connection URI: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB successfully!");

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("\nCollections in database:");
    if (collections.length === 0) {
      console.log("No collections found. This appears to be a new database.");
    } else {
      collections.forEach((collection) => {
        console.log(`- ${collection.name}`);
      });
    }

    console.log("\nYour MongoDB connection is working properly.");
    console.log("You can now run your Next.js application with local MongoDB.");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB");
    console.error(error);
    console.log("\nPossible solutions:");
    console.log("1. Make sure MongoDB server is running on your machine");
    console.log("2. Check if MongoDB is installed correctly");
    console.log("3. Verify the connection string in your .env.local file");
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
}

testConnection();
