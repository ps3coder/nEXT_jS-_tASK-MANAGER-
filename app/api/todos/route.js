import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";
import User from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all todos for the current user
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

    // Get all todos for this user
    const todos = await Todo.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Create a new todo
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      task,
      dueDate,
      priority,
      category,
      isRecurring,
      recurrencePattern,
    } = await request.json();

    // Validate required fields
    if (!task) {
      return NextResponse.json({ error: "Task is required" }, { status: 400 });
    }

    await dbConnect();

    // Find the user's ID from their email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the todo
    const todo = await Todo.create({
      userId: user._id,
      task,
      dueDate,
      priority: priority || "medium",
      category,
      isRecurring: isRecurring || false,
      recurrencePattern: isRecurring ? recurrencePattern : null,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
