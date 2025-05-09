"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import * as settingsService from "@/app/services/settingsService";

const ThemeContext = createContext();

// Helper function to safely check for dark mode preference
const getSystemPreference = () => {
  if (typeof window === "undefined") return false; // Default for server
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

export function ThemeProvider({ children }) {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false); // Default value for SSR
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Run once on client-side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load theme from API or default to system preference
  useEffect(() => {
    if (!isClient) return; // Skip on server

    async function loadTheme() {
      try {
        // For unauthenticated users, use system preference
        if (status !== "authenticated") {
          setDarkMode(getSystemPreference());
          setIsLoading(false);
          return;
        }

        // For authenticated users, fetch from API
        const settings = await settingsService.fetchSettings();
        setDarkMode(settings.darkMode);
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fallback to system preference
        setDarkMode(getSystemPreference());
      } finally {
        setIsLoading(false);
      }
    }

    loadTheme();
  }, [session, status, isClient]);

  // Update document when theme changes
  useEffect(() => {
    if (!isClient) return; // Skip on server

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, isClient]);

  // Save theme to database
  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Only update in database if user is authenticated
    if (status === "authenticated") {
      try {
        await settingsService.updateTheme(newDarkMode);
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
