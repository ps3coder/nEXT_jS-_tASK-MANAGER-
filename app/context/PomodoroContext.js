"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import * as settingsService from "@/app/services/settingsService";

const PomodoroContext = createContext();

export function PomodoroProvider({ children }) {
  const { data: session, status } = useSession();
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Settings with defaults
  const [settings, setSettings] = useState({
    pomodoro: 25, // minutes
    shortBreak: 5, // minutes
    longBreak: 15, // minutes
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4, // after 4 pomodoros
  });

  const timerRef = useRef(null);

  // Load settings from MongoDB
  useEffect(() => {
    async function loadSettings() {
      try {
        // For unauthenticated users, use defaults
        if (status !== "authenticated") {
          setIsLoading(false);
          return;
        }

        // For authenticated users, fetch from API
        const userSettings = await settingsService.fetchSettings();
        if (userSettings.pomodoroSettings) {
          setSettings(userSettings.pomodoroSettings);
        }
      } catch (error) {
        console.error("Error loading pomodoro settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [session, status]);

  // Save settings to MongoDB when they change
  useEffect(() => {
    async function saveSettings() {
      if (status !== "authenticated" || isLoading) return;

      try {
        await settingsService.updatePomodoroSettings(settings);
      } catch (error) {
        console.error("Error saving pomodoro settings:", error);
      }
    }

    saveSettings();
  }, [settings, status, isLoading]);

  // Update timeLeft when mode or settings change
  useEffect(() => {
    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreak * 60);
        break;
      default:
        setTimeLeft(settings.pomodoro * 60);
    }
  }, [mode, settings]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Handle timer completion
  const handleTimerComplete = () => {
    if (mode === "pomodoro") {
      setTotalPomodoros((prev) => prev + 1);

      const nextMode =
        totalPomodoros > 0 && totalPomodoros % settings.longBreakInterval === 0
          ? "longBreak"
          : "shortBreak";

      setMode(nextMode);

      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      setMode("pomodoro");

      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    }
  };

  // Start/resume timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Reset current timer
  const resetTimer = () => {
    setIsRunning(false);
    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreak * 60);
        break;
    }
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Value object
  const value = {
    isRunning,
    mode,
    timeLeft,
    settings,
    totalPomodoros,
    selectedTaskId,
    isLoading,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    setSelectedTaskId,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}
