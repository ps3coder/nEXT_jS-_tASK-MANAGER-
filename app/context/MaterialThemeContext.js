"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@/app/context/ThemeContext";
import { useMemo, useState, useEffect } from "react";

export function AppThemeProvider({ children }) {
  const { darkMode, isLoading } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate the theme based on dark mode state
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#3b82f6", // blue-500
            light: "#60a5fa", // blue-400
            dark: "#2563eb", // blue-600
            contrastText: "#ffffff",
          },
          secondary: {
            main: darkMode ? "#1f2937" : "#f3f4f6", // gray-800 or gray-100
            light: darkMode ? "#374151" : "#f9fafb", // gray-700 or gray-50
            dark: darkMode ? "#111827" : "#e5e7eb", // gray-900 or gray-200
            contrastText: darkMode ? "#f3f4f6" : "#1f2937", // gray-100 or gray-800
          },
          error: {
            main: "#ef4444", // red-500
          },
          warning: {
            main: "#f59e0b", // amber-500
          },
          info: {
            main: "#3b82f6", // blue-500
          },
          success: {
            main: "#10b981", // emerald-500
          },
          background: {
            default: darkMode ? "#0c0c0c" : "#ffffff",
            paper: darkMode ? "#1a1a1a" : "#f9f9f9",
          },
          text: {
            primary: darkMode ? "#f3f4f6" : "#171717",
            secondary: darkMode ? "#9ca3af" : "#6b7280",
          },
          divider: darkMode ? "#374151" : "#e5e7eb",
        },
        typography: {
          fontFamily:
            'var(--font-geist-sans), "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            fontWeight: 500,
            textTransform: "none",
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              },
              containedPrimary: {
                "&:hover": {
                  backgroundColor: darkMode ? "#3b82f6" : "#2563eb",
                },
              },
              containedSecondary: {
                "&:hover": {
                  backgroundColor: darkMode ? "#1f2937" : "#e5e7eb",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                width: 42,
                height: 26,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                  padding: 0,
                  margin: 2,
                  transitionDuration: "300ms",
                  "&.Mui-checked": {
                    transform: "translateX(16px)",
                    color: "#fff",
                    "& + .MuiSwitch-track": {
                      backgroundColor: "#3b82f6",
                      opacity: 1,
                      border: 0,
                    },
                    "&.Mui-disabled + .MuiSwitch-track": {
                      opacity: 0.5,
                    },
                  },
                  "&.Mui-focusVisible .MuiSwitch-thumb": {
                    color: "#3b82f6",
                    border: "6px solid #fff",
                  },
                  "&.Mui-disabled .MuiSwitch-thumb": {
                    color: darkMode ? "#424242" : "#e0e0e0",
                  },
                  "&.Mui-disabled + .MuiSwitch-track": {
                    opacity: darkMode ? 0.3 : 0.7,
                  },
                },
                "& .MuiSwitch-thumb": {
                  boxSizing: "border-box",
                  width: 22,
                  height: 22,
                },
                "& .MuiSwitch-track": {
                  borderRadius: 26 / 2,
                  backgroundColor: darkMode ? "#39393D" : "#E9E9EA",
                  opacity: 1,
                },
              },
            },
          },
        },
      }),
    [darkMode]
  );

  // Prevent hydration mismatch by only showing content once mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
