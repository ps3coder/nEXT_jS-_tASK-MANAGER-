"use client";

import { useState } from "react";
import { useTodos } from "@/app/context/TodoContext";
import TodoItem from "@/app/components/TodoItem";
import TodoForm from "@/app/components/TodoForm";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { motion, AnimatePresence } from "framer-motion";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function TodoList() {
  const { getFilteredTodos, filter, setFilter, sortTodos } = useTodos();
  const [editingTodo, setEditingTodo] = useState(null);
  const [sortBy, setSortBy] = useState("dueDate");

  const filteredTodos = getFilteredTodos();
  const sortedTodos = sortTodos(filteredTodos, sortBy);

  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const filterButtons = [
    {
      id: "all",
      label: "All",
      icon: <FormatListBulletedIcon fontSize="small" />,
    },
    {
      id: "active",
      label: "Active",
      icon: <AccessTimeIcon fontSize="small" />,
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CheckCircleOutlineIcon fontSize="small" />,
    },
  ];

  const sortOptions = [
    { id: "dueDate", label: "Due Date" },
    { id: "priority", label: "Priority" },
    { id: "alphabetical", label: "Alphabetical" },
  ];

  return (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            My Tasks
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <ButtonGroup
              variant="outlined"
              aria-label="filter button group"
              fullWidth
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {filterButtons.map((btn) => (
                <Button
                  key={btn.id}
                  color={filter === btn.id ? "primary" : "inherit"}
                  variant={filter === btn.id ? "contained" : "outlined"}
                  onClick={() => setFilter(btn.id)}
                  startIcon={btn.icon}
                >
                  {btn.label}
                </Button>
              ))}
            </ButtonGroup>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={
                  <FilterListIcon fontSize="small" sx={{ mr: 1 }} />
                }
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {editingTodo ? (
          <TodoForm todoToEdit={editingTodo} onCancel={handleCancelEdit} />
        ) : (
          <>
            {sortedTodos.length > 0 ? (
              <AnimatePresence initial={false}>
                <Stack spacing={2}>
                  {sortedTodos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TodoItem todo={todo} onEdit={handleEdit} />
                    </motion.div>
                  ))}
                </Stack>
              </AnimatePresence>
            ) : (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Alert
                  severity="info"
                  sx={{ maxWidth: 400, mx: "auto", mb: 2 }}
                >
                  No tasks found
                </Alert>
                <Typography variant="body2" color="text.secondary">
                  {filter !== "all"
                    ? `Try switching to "All" to see all your tasks.`
                    : "Add a new task to get started!"}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
