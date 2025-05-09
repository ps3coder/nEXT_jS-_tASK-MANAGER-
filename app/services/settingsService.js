/**
 * Settings Service - Handles all API calls for user settings operations
 */

// Get user settings
export async function fetchSettings() {
  try {
    const response = await fetch("/api/settings");

    if (!response.ok) {
      throw new Error(`Error fetching settings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    throw error;
  }
}

// Update user settings
export async function updateSettings(settingsData) {
  try {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settingsData),
    });

    if (!response.ok) {
      throw new Error(`Error updating settings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw error;
  }
}

// Update theme settings
export async function updateTheme(darkMode) {
  return updateSettings({ darkMode });
}

// Update pomodoro settings
export async function updatePomodoroSettings(pomodoroSettings) {
  return updateSettings({ pomodoroSettings });
}
