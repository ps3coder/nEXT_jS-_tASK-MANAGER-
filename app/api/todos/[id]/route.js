import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";
import User from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get a specific todo
export async function GET(request, context) {
  try {
    const { params } = context;
    const id = params.id;
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

    // Get the todo and verify it belongs to the user
    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Check if the todo belongs to the user
    if (todo.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Update a todo
export async function PUT(request, context) {
  try {
    const { params } = context;
    const id = params.id;
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

    // Get the todo and verify it belongs to the user
    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Check if the todo belongs to the user
    if (todo.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the todo
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Delete a todo
export async function DELETE(request, context) {
  try {
    const { params } = context;
    const id = params.id;
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

    // Get the todo and verify it belongs to the user
    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Check if the todo belongs to the user
    if (todo.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the todo
    await Todo.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
