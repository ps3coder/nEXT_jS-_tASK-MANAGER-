"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const PomodoroContext = createContext();

export function PomodoroProvider({ children }) {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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

  // Load settings from localStorage on first render
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error parsing pomodoro settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
  }, [settings]);

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
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Handle timer completion
  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);

    // Play notification sound
    const audio = new Audio("/notification.mp3");
    audio
      .play()
      .catch((error) =>
        console.error("Error playing notification sound:", error)
      );

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: `${
          mode === "pomodoro"
            ? "Time for a break!"
            : "Break finished. Back to work!"
        }`,
        icon: "/icon.png",
      });
    }

    // Handle cycle transitions
    if (mode === "pomodoro") {
      const newTotalPomodoros = totalPomodoros + 1;
      setTotalPomodoros(newTotalPomodoros);

      // Determine if it's time for a long break
      if (newTotalPomodoros % settings.longBreakInterval === 0) {
        setMode("longBreak");
        if (settings.autoStartBreaks) setIsRunning(true);
      } else {
        setMode("shortBreak");
        if (settings.autoStartBreaks) setIsRunning(true);
      }
    } else {
      // Break is over, go back to pomodoro
      setMode("pomodoro");
      if (settings.autoStartPomodoros) setIsRunning(true);
    }
  };

  // Start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Pause the timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);

    // Reset to the current mode's full time
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
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <PomodoroContext.Provider
      value={{
        isRunning,
        mode,
        timeLeft,
        totalPomodoros,
        settings,
        selectedTaskId,
        formatTime,
        startTimer,
        pauseTimer,
        resetTimer,
        setMode,
        updateSettings,
        setSelectedTaskId,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}
