"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const { data: session } = useSession();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to determine if we should use API or localStorage
  const isApiEnabled = () => {
    return session?.user?.id != null; // Use API if authenticated with a real user ID
  };

  // Get user-specific storage key for localStorage fallback
  const getUserStorageKey = () => {
    if (!session?.user?.email) return null;
    return `todos_${session.user.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
  };

  // Fetch todos from API or localStorage
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isApiEnabled()) {
        // Fetch from API
        const response = await fetch("/api/todos");

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        setTodos(data);
      } else {
        // Fallback to localStorage
        const storageKey = getUserStorageKey();
        if (!storageKey) {
          setTodos([]);
          return;
        }

        const savedTodos = localStorage.getItem(storageKey);
        if (savedTodos) {
          try {
            setTodos(JSON.parse(savedTodos));
          } catch (error) {
            console.error("Error parsing saved todos:", error);
            setTodos([]);
          }
        } else {
          setTodos([]);
        }
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load your tasks. Please try again.");

      // Fallback to localStorage if API fails
      const storageKey = getUserStorageKey();
      if (storageKey) {
        const savedTodos = localStorage.getItem(storageKey);
        if (savedTodos) {
          try {
            setTodos(JSON.parse(savedTodos));
          } catch (error) {
            setTodos([]);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load todos when session changes
  useEffect(() => {
    if (session === undefined) return; // Wait for session to be determined
    fetchTodos();
  }, [session]);

  // Save todos to localStorage as a fallback
  useEffect(() => {
    const storageKey = getUserStorageKey();
    if (!storageKey || isLoading) return;

    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, session, isLoading]);

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
      const newTodo = {
        task,
        dueDate,
        priority,
        category,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
      };

      if (isApiEnabled()) {
        // Add via API
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
          throw new Error("Failed to add todo");
        }

        const addedTodo = await response.json();
        setTodos((prevTodos) => [...prevTodos, addedTodo]);
      } else {
        // Add directly to state (localStorage fallback)
        const todoWithId = {
          ...newTodo,
          id: Date.now().toString(),
          completed: false,
          createdAt: new Date().toISOString(),
          userEmail: session?.user?.email,
        };

        setTodos((prevTodos) => [...prevTodos, todoWithId]);
      }
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add task. Please try again.");
    }
  };

  // Edit an existing todo
  const editTodo = async (id, updatedFields) => {
    try {
      if (isApiEnabled()) {
        // Update via API
        const response = await fetch(`/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }

        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id || todo.id === id ? updatedTodo : todo
          )
        );
      } else {
        // Update directly in state (localStorage fallback)
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, ...updatedFields } : todo
          )
        );
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      if (isApiEnabled()) {
        // Delete via API
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
      }

      // Remove from state regardless of API success
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo._id !== id && todo.id !== id)
      );
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (id) => {
    try {
      const todoToToggle = todos.find(
        (todo) => todo._id === id || todo.id === id
      );
      if (!todoToToggle) return;

      const updatedData = { completed: !todoToToggle.completed };

      if (isApiEnabled()) {
        // Update via API
        const response = await fetch(`/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo completion");
        }

        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id || todo.id === id ? updatedTodo : todo
          )
        );
      } else {
        // Update directly in state (localStorage fallback)
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, ...updatedData } : todo
          )
        );
      }
    } catch (err) {
      console.error("Error toggling todo completion:", err);
      setError("Failed to update task. Please try again.");
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
