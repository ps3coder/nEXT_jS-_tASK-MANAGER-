/**
 * Server-side script to import todos from a JSON file to MongoDB
 *
 * Usage:
 * 1. Export your todos from the browser to a JSON file
 * 2. Put the file in the root of your project as 'todos-export.json'
 * 3. Run this script: node scripts/server-migrate.js <user_email>
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

// MongoDB connection URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todo-app";

// Define Todo Schema (simplified version of your app model)
const TodoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  category: {
    type: String,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrencePattern: {
    type: String,
    enum: ["daily", "weekly", "monthly", null],
  },
});

// Define User Schema (simplified version)
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  provider: String,
});

async function migrateData() {
  // Check if user email was provided
  const userEmail = process.argv[2];
  if (!userEmail) {
    console.error("Error: User email is required");
    console.log("Usage: node scripts/server-migrate.js <user_email>");
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Get models
    const User = mongoose.model("User", UserSchema);
    const Todo = mongoose.model("Todo", TodoSchema);

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

    // Read JSON file
    const filePath = path.join(process.cwd(), "todos-export.json");
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found at ${filePath}`);
      console.log(
        'Please export your todos to "todos-export.json" in the project root'
      );
      process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const todos = JSON.parse(fileContent);

    if (!Array.isArray(todos)) {
      console.error("Error: The JSON file does not contain an array of todos");
      process.exit(1);
    }

    console.log(`Found ${todos.length} todos to import`);

    // Import todos
    let successCount = 0;
    let errorCount = 0;

    for (const todoData of todos) {
      try {
        // Map data to schema
        const newTodo = {
          userId: user._id,
          task: todoData.task,
          completed: todoData.completed || false,
          createdAt: todoData.createdAt
            ? new Date(todoData.createdAt)
            : new Date(),
          dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null,
          priority: todoData.priority || "medium",
          category: todoData.category || null,
          isRecurring: todoData.isRecurring || false,
          recurrencePattern: todoData.isRecurring
            ? todoData.recurrencePattern
            : null,
        };

        const result = await Todo.create(newTodo);
        successCount++;
        console.log(`Imported: "${todoData.task}" with ID: ${result._id}`);
      } catch (err) {
        errorCount++;
        console.error(`Failed to import: "${todoData.task}"`, err.message);
      }
    }

    console.log("\nImport summary:");
    console.log(`- Successfully imported: ${successCount} todos`);
    console.log(`- Failed to import: ${errorCount} todos`);

    if (successCount > 0) {
      console.log("\n✅ Migration completed successfully!");
    } else {
      console.log("\n❌ Migration failed. No todos were imported.");
    }
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateData();
