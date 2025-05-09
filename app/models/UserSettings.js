import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Theme settings
    darkMode: {
      type: Boolean,
      default: false,
    },
    // Pomodoro settings
    pomodoroSettings: {
      pomodoro: {
        type: Number,
        default: 25, // minutes
      },
      shortBreak: {
        type: Number,
        default: 5, // minutes
      },
      longBreak: {
        type: Number,
        default: 15, // minutes
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
        default: 4, // after 4 pomodoros
      },
    },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent recompilation errors
const UserSettings =
  mongoose.models.UserSettings ||
  mongoose.model("UserSettings", UserSettingsSchema);

export default UserSettings;
