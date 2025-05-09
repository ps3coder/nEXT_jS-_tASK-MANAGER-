"use client";

import { useState } from "react";
import { useTodos } from "@/app/context/TodoContext";
import { usePomodoro } from "@/app/context/PomodoroContext";
import { format, isValid, isPast, isToday } from "date-fns";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimerIcon from "@mui/icons-material/Timer";
import EventIcon from "@mui/icons-material/Event";
import LabelIcon from "@mui/icons-material/Label";
import RepeatIcon from "@mui/icons-material/Repeat";

export default function TodoItem({ todo, onEdit }) {
  const { toggleComplete, deleteTodo } = useTodos();
  const { setSelectedTaskId, setMode } = usePomodoro();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleToggleComplete = () => {
    toggleComplete(todo.id);
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      deleteTodo(todo.id);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const handleStartPomodoro = () => {
    setSelectedTaskId(todo.id);
    setMode("pomodoro");
    // Scroll to pomodoro timer on mobile
    if (window.innerWidth < 768) {
      const pomodoroElement = document.getElementById("pomodoro-timer");
      if (pomodoroElement) {
        pomodoroElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Format due date for display
  const formatDueDate = () => {
    if (!todo.dueDate) return null;

    const date = new Date(todo.dueDate);
    if (!isValid(date)) return null;

    if (isToday(date)) {
      return "Today";
    }

    return format(date, "MMM d, yyyy");
  };

  // Determine color based on priority and due date
  const getPriorityColor = () => {
    if (todo.priority === "high") return "error";
    if (todo.priority === "medium") return "warning";
    return "success";
  };

  const getDueDateColor = () => {
    if (!todo.dueDate) return "default";

    const date = new Date(todo.dueDate);
    if (!isValid(date)) return "default";

    if (isPast(date) && !isToday(date)) {
      return "error";
    }
    if (isToday(date)) {
      return "warning";
    }
    return "default";
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        bgcolor: todo.completed ? "action.hover" : "background.paper",
        transition: "all 0.2s ease-in-out",
        borderRadius: 2,
        opacity: todo.completed ? 0.8 : 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Checkbox */}
        <Box sx={{ pt: 0.5 }}>
          <Checkbox
            checked={todo.completed}
            onChange={handleToggleComplete}
            color="primary"
            sx={{ p: 0.5 }}
            inputProps={{
              "aria-label": `Mark "${todo.task}" as ${
                todo.completed ? "incomplete" : "complete"
              }`,
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 1.5,
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              component="h3"
              sx={{
                fontWeight: 500,
                wordBreak: "break-word",
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "text.secondary" : "text.primary",
              }}
            >
              {todo.task}
            </Typography>

            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {/* Priority chip */}
              <Chip
                label={todo.priority}
                color={getPriorityColor()}
                size="small"
                variant="outlined"
                sx={{ height: "24px", fontSize: "0.7rem" }}
              />

              {/* Category chip */}
              {todo.category && (
                <Chip
                  icon={<LabelIcon sx={{ fontSize: "0.9rem" }} />}
                  label={todo.category}
                  size="small"
                  variant="outlined"
                  sx={{ height: "24px", fontSize: "0.7rem" }}
                />
              )}

              {/* Recurring indicator */}
              {todo.isRecurring && (
                <Chip
                  icon={<RepeatIcon sx={{ fontSize: "0.9rem" }} />}
                  label={todo.recurrencePattern}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{ height: "24px", fontSize: "0.7rem" }}
                />
              )}
            </Stack>
          </Box>

          {/* Due date */}
          {todo.dueDate && (
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<EventIcon sx={{ fontSize: "0.9rem" }} />}
                label={formatDueDate()}
                size="small"
                color={getDueDateColor()}
                variant="outlined"
                sx={{ height: "24px", fontSize: "0.7rem" }}
              />
            </Box>
          )}

          {/* Action buttons */}
          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            <Tooltip title="Focus on this task with Pomodoro timer">
              <span>
                {" "}
                {/* Wrapper to make tooltip work with disabled button */}
                <Button
                  onClick={handleStartPomodoro}
                  startIcon={<TimerIcon />}
                  size="small"
                  variant="text"
                  disabled={todo.completed}
                  sx={{ py: 0.5 }}
                >
                  Focus
                </Button>
              </span>
            </Tooltip>

            <Button
              onClick={() => onEdit(todo)}
              startIcon={<EditIcon />}
              size="small"
              variant="text"
              sx={{ py: 0.5 }}
            >
              Edit
            </Button>

            {/* Delete with confirmation */}
            {showConfirmDelete ? (
              <Grow in={showConfirmDelete}>
                <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                  <Button
                    onClick={handleDelete}
                    startIcon={<DeleteIcon />}
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{ py: 0.5 }}
                  >
                    Confirm
                  </Button>

                  <Button
                    onClick={() => setShowConfirmDelete(false)}
                    size="small"
                    variant="outlined"
                    sx={{ py: 0.5 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grow>
            ) : (
              <Button
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
                size="small"
                variant="text"
                color="error"
                sx={{ py: 0.5, ml: "auto" }}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
