import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/app/lib/mongodb";
import UserSettings from "@/app/models/UserSettings";
import User from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get user settings
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the user's ID from their email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find or create user settings
    let userSettings = await UserSettings.findOne({ userId: user._id });

    if (!userSettings) {
      // Create default settings if none exist
      userSettings = await UserSettings.create({
        userId: user._id,
        darkMode: false,
        pomodoroSettings: {
          pomodoro: 25,
          shortBreak: 5,
          longBreak: 15,
          autoStartBreaks: false,
          autoStartPomodoros: false,
          longBreakInterval: 4,
        },
      });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Update user settings
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await request.json();

    await dbConnect();

    // Find the user's ID from their email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find or create user settings
    let userSettings = await UserSettings.findOne({ userId: user._id });

    if (!userSettings) {
      // Create with provided settings if none exist
      userSettings = await UserSettings.create({
        userId: user._id,
        ...updateData,
      });
    } else {
      // Update existing settings
      userSettings = await UserSettings.findOneAndUpdate(
        { userId: user._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
