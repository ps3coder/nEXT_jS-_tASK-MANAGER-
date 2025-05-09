"use client";

import { useState } from "react";
import { usePomodoro } from "@/app/context/PomodoroContext";
import { useTodos } from "@/app/context/TodoContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "@/app/utils/timeUtils";

export default function PomodoroTimer() {
  const {
    isRunning,
    mode,
    timeLeft,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    setMode,
    updateSettings,
    selectedTaskId,
  } = usePomodoro();

  const { todos } = useTodos();
  const [showSettings, setShowSettings] = useState(false);

  // Find selected task details with support for both MongoDB _id and localStorage id
  const selectedTask = todos.find(
    (todo) =>
      (todo._id && todo._id === selectedTaskId) || todo.id === selectedTaskId
  );

  // Mode buttons
  const modeButtons = [
    { id: "pomodoro", label: "Focus" },
    { id: "shortBreak", label: "Short" },
    { id: "longBreak", label: "Long" },
  ];

  // Get mode color
  const getModeColor = () => {
    switch (mode) {
      case "pomodoro":
        return "primary";
      case "shortBreak":
        return "info";
      case "longBreak":
        return "secondary";
      default:
        return "primary";
    }
  };

  // Settings form
  const PomodoroSettings = () => {
    const [formSettings, setFormSettings] = useState({ ...settings });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormSettings({
        ...formSettings,
        [name]: type === "checkbox" ? checked : parseInt(value, 10),
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      updateSettings(formSettings);
      setShowSettings(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <Paper variant="outlined" sx={{ mt: 2, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Timer Settings</Typography>
            <IconButton
              size="small"
              onClick={() => setShowSettings(false)}
              aria-label="close settings"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  label="Pomodoro"
                  type="number"
                  name="pomodoro"
                  inputProps={{ min: 1, max: 60 }}
                  value={formSettings.pomodoro}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label="Short Break"
                  type="number"
                  name="shortBreak"
                  inputProps={{ min: 1, max: 30 }}
                  value={formSettings.shortBreak}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label="Long Break"
                  type="number"
                  name="longBreak"
                  inputProps={{ min: 1, max: 60 }}
                  value={formSettings.longBreak}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Long Break Interval"
                  type="number"
                  name="longBreakInterval"
                  inputProps={{ min: 1, max: 10 }}
                  value={formSettings.longBreakInterval}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  helperText="Number of pomodoros before a long break"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formSettings.autoStartBreaks}
                      onChange={handleChange}
                      name="autoStartBreaks"
                    />
                  }
                  label="Auto-start breaks"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formSettings.autoStartPomodoros}
                      onChange={handleChange}
                      name="autoStartPomodoros"
                    />
                  }
                  label="Auto-start pomodoros"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    );
  };

  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }} id="pomodoro-timer">
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight="500">
            Pomodoro Timer
          </Typography>
          <Tooltip title="Timer settings">
            <IconButton
              size="small"
              onClick={() => setShowSettings(!showSettings)}
              color="inherit"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mode selector */}
        <ButtonGroup variant="outlined" fullWidth sx={{ mb: 3 }} size="medium">
          {modeButtons.map((btn) => (
            <Button
              key={btn.id}
              variant={mode === btn.id ? "contained" : "outlined"}
              color={mode === btn.id ? getModeColor() : "inherit"}
              onClick={() => {
                setMode(btn.id);
                resetTimer();
              }}
              sx={{ py: 1 }}
            >
              {btn.label}
            </Button>
          ))}
        </ButtonGroup>

        {/* Simplified timer display */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "action.hover",
            borderRadius: 2,
            py: 4,
            mx: 1,
            mb: 3,
          }}
        >
          <Typography
            variant="h1"
            component="div"
            align="center"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "3rem", sm: "4rem" },
              letterSpacing: 2,
              color: `${getModeColor()}.main`,
              fontFamily: "monospace",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>

          <Typography
            variant="subtitle1"
            component="div"
            color="text.secondary"
            sx={{ mt: 1, textTransform: "capitalize" }}
          >
            {mode === "pomodoro"
              ? "Focus Time"
              : mode === "shortBreak"
              ? "Short Break"
              : "Long Break"}
          </Typography>
        </Box>

        {/* Selected task */}
        {selectedTask && (
          <Paper
            variant="outlined"
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1.5,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Task:
            </Typography>
            <Typography variant="body1" noWrap fontWeight="medium">
              {selectedTask.task}
            </Typography>
          </Paper>
        )}

        {/* Control buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
          {isRunning ? (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<PauseIcon />}
              onClick={pauseTimer}
              size="large"
              sx={{ px: 4, py: 1.2 }}
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="contained"
              color={getModeColor()}
              startIcon={<PlayArrowIcon />}
              onClick={startTimer}
              size="large"
              sx={{ px: 4, py: 1.2 }}
            >
              Start
            </Button>
          )}

          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={resetTimer}
            size="large"
            sx={{ px: 3, py: 1.2 }}
          >
            Reset
          </Button>
        </Box>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && <PomodoroSettings />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
