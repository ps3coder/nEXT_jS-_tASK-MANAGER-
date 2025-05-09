/**
 * Server-side script to migrate user settings to MongoDB
 * Usage: node scripts/server-migrate-settings.js <user_email> <dark_mode> <pomodoro_settings_json>
 *
 * Example:
 * node scripts/server-migrate-settings.js user@example.com true '{"pomodoro":25,"shortBreak":5,"longBreak":15,"autoStartBreaks":false,"autoStartPomodoros":false,"longBreakInterval":4}'
 */

const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

// MongoDB connection URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todo-app";

// Define User Schema (simplified)
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  provider: String,
});

// Define UserSettings Schema
const UserSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  pomodoroSettings: {
    pomodoro: {
      type: Number,
      default: 25,
    },
    shortBreak: {
      type: Number,
      default: 5,
    },
    longBreak: {
      type: Number,
      default: 15,
    },
    autoStartBreaks: {
      type: Boolean,
      default: false,
    },
    autoStartPomodoros: {
      type: Boolean,
      default: false,
    },
    longBreakInterval: {
      type: Number,
      default: 4,
    },
  },
});

async function migrateSettings() {
  // Check if required parameters are provided
  const userEmail = process.argv[2];
  const darkMode = process.argv[3];
  const pomodoroSettingsJson = process.argv[4];

  if (!userEmail) {
    console.error("Error: User email is required");
    console.log(
      "Usage: node scripts/server-migrate-settings.js <user_email> [dark_mode] [pomodoro_settings_json]"
    );
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Get models
    const User = mongoose.model("User", UserSchema);
    const UserSettings = mongoose.model("UserSettings", UserSettingsSchema);

    // Find or create user
    console.log(`Looking for user with email: ${userEmail}`);
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log(
        `User not found. Creating a new user with email: ${userEmail}`
      );
      user = await User.create({
        name: userEmail.split("@")[0], // Use part of email as name
        email: userEmail,
        provider: "migration",
      });
      console.log(`Created new user with id: ${user._id}`);
    } else {
      console.log(`Found existing user with id: ${user._id}`);
    }

    // Check if settings already exist
    const existingSettings = await UserSettings.findOne({ userId: user._id });
    if (existingSettings) {
      console.log("User settings already exist. Use --force to overwrite.");
      process.exit(0);
    }

    // Prepare settings data
    const settingsData = {
      userId: user._id,
      darkMode: darkMode === "true",
    };

    // Add pomodoro settings if provided
    if (pomodoroSettingsJson) {
      try {
        settingsData.pomodoroSettings = JSON.parse(pomodoroSettingsJson);
      } catch (error) {
        console.error("Error parsing pomodoro settings JSON:", error);
        console.log("Using default pomodoro settings instead");
      }
    }

    // Create settings
    const settings = await UserSettings.create(settingsData);
    console.log("Settings created successfully:");
    console.log(JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateSettings();
