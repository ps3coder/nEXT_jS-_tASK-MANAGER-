"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as todoService from "@/app/services/todoService";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    // Don't fetch if not authenticated
    if (status !== "authenticated") {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await todoService.fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load your tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load todos when session changes
  useEffect(() => {
    if (status === "loading") return;
    fetchTodos();
  }, [session, status]);

  // Add a new todo
  const addTodo = async (
    task,
    dueDate = null,
    priority = "medium",
    category = null,
    isRecurring = false,
    recurrencePattern = null
  ) => {
    try {
      setError(null);

      const todoData = {
        task,
        dueDate,
        priority,
        category,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
      };

      const newTodo = await todoService.addTodo(todoData);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add task. Please try again.");
      throw err;
    }
  };

  // Edit an existing todo
  const editTodo = async (id, updatedFields) => {
    try {
      setError(null);

      const updatedTodo = await todoService.updateTodo(id, updatedFields);

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id || todo.id === id ? updatedTodo : todo
        )
      );

      return updatedTodo;
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update task. Please try again.");
      throw err;
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setError(null);

      await todoService.deleteTodo(id);

      // Remove from state after successful API call
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo._id !== id && todo.id !== id)
      );
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete task. Please try again.");
      throw err;
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (id) => {
    try {
      setError(null);

      const todoToToggle = todos.find(
        (todo) => todo._id === id || todo.id === id
      );
      if (!todoToToggle) return;

      const updatedTodo = await todoService.toggleTodoComplete(
        id,
        !todoToToggle.completed
      );

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id || todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      console.error("Error toggling todo completion:", err);
      setError("Failed to update task. Please try again.");
      throw err;
    }
  };

  // Get filtered todos
  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply status filter
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.task.toLowerCase().includes(query) ||
          (todo.category && todo.category.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  // Sort todos by various criteria
  const sortTodos = (todos, criteria = "dueDate") => {
    const sortedTodos = [...todos];

    switch (criteria) {
      case "dueDate":
        return sortedTodos.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case "priority":
        const priorityValues = { high: 1, medium: 2, low: 3 };
        return sortedTodos.sort(
          (a, b) => priorityValues[a.priority] - priorityValues[b.priority]
        );
      case "alphabetical":
        return sortedTodos.sort((a, b) => a.task.localeCompare(b.task));
      default:
        return sortedTodos;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        filter,
        searchQuery,
        setFilter,
        setSearchQuery,
        addTodo,
        editTodo,
        deleteTodo,
        toggleComplete,
        getFilteredTodos,
        sortTodos,
        refreshTodos: fetchTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
