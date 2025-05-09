/**
 * Todo Service - Handles all API calls for todo operations
 */

// Get all todos for the current user
export async function fetchTodos() {
  try {
    const response = await fetch("/api/todos");

    if (!response.ok) {
      throw new Error(`Error fetching todos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw error;
  }
}

// Add a new todo
export async function addTodo(todoData) {
  try {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error(`Error adding todo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add todo:", error);
    throw error;
  }
}

// Update a todo
export async function updateTodo(id, updateData) {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Error updating todo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update todo:", error);
    throw error;
  }
}

// Delete a todo
export async function deleteTodo(id) {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting todo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete todo:", error);
    throw error;
  }
}

// Toggle todo completion status
export async function toggleTodoComplete(id, completed) {
  return updateTodo(id, { completed });
}
