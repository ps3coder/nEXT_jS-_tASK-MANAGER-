/**
 * Format seconds to mm:ss display format
 * @param {number} seconds - The number of seconds to format
 * @returns {string} - Formatted time string (mm:ss)
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
