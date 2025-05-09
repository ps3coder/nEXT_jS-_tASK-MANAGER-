"use client";

import { useState, useEffect } from "react";
import { useTodos } from "@/app/context/TodoContext";
import { format } from "date-fns";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LabelIcon from "@mui/icons-material/Label";
import RepeatIcon from "@mui/icons-material/Repeat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function TodoForm({ todoToEdit, onCancel }) {
  const { addTodo, editTodo } = useTodos();
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState("daily");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // If we're editing a todo, populate the form
  useEffect(() => {
    if (todoToEdit) {
      setTask(todoToEdit.task);
      setDueDate(
        todoToEdit.dueDate
          ? format(new Date(todoToEdit.dueDate), "yyyy-MM-dd")
          : ""
      );
      setPriority(todoToEdit.priority || "medium");
      setCategory(todoToEdit.category || "");
      setIsRecurring(todoToEdit.isRecurring || false);
      setRecurrencePattern(todoToEdit.recurrencePattern || "daily");
      setShowAdvanced(true);
    }
  }, [todoToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

    if (todoToEdit) {
      editTodo(todoToEdit.id, {
        task,
        dueDate: formattedDueDate,
        priority,
        category: category || null,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
      });

      if (onCancel) onCancel();
    } else {
      addTodo(
        task,
        formattedDueDate,
        priority,
        category || null,
        isRecurring,
        isRecurring ? recurrencePattern : null
      );

      // Reset form
      setTask("");
      setDueDate("");
      setPriority("medium");
      setCategory("");
      setIsRecurring(false);
      setRecurrencePattern("daily");
      setShowAdvanced(false);
    }
  };

  const getPriorityColor = (value) => {
    switch (value) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="500">
          {todoToEdit ? "Edit Task" : "Add New Task"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            autoFocus
            size="medium"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              type="button"
              startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="medium"
              color="primary"
              sx={{ textTransform: "none" }}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </Button>

            <Box>
              {todoToEdit && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ mr: 1, px: 3 }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!task.trim()}
                startIcon={todoToEdit ? <UpdateIcon /> : <AddIcon />}
                sx={{ px: 3 }}
              >
                {todoToEdit ? "Update" : "Add"} Task
              </Button>
            </Box>
          </Box>

          <Collapse in={showAdvanced}>
            <Paper variant="outlined" sx={{ p: 3, mt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    placeholder="e.g., Work, Personal"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="priority-select-label">Priority</InputLabel>
                    <Select
                      labelId="priority-select-label"
                      value={priority}
                      label="Priority"
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <MenuItem value="high" sx={{ color: "error.main" }}>
                        High
                      </MenuItem>
                      <MenuItem value="medium" sx={{ color: "warning.main" }}>
                        Medium
                      </MenuItem>
                      <MenuItem value="low" sx={{ color: "success.main" }}>
                        Low
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <RepeatIcon fontSize="small" color="action" />
                          <Typography>Recurring Task</Typography>
                        </Box>
                      }
                    />

                    {isRecurring && (
                      <FormControl fullWidth sx={{ mt: 1.5 }}>
                        <InputLabel id="recurrence-select-label">
                          Repeat
                        </InputLabel>
                        <Select
                          labelId="recurrence-select-label"
                          value={recurrencePattern}
                          label="Repeat"
                          onChange={(e) => setRecurrencePattern(e.target.value)}
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
}
