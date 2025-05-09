"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TodoProvider } from "@/app/context/TodoContext";
import { PomodoroProvider } from "@/app/context/PomodoroContext";
import Header from "@/app/components/Header";
import TodoList from "@/app/components/TodoList";
import TodoForm from "@/app/components/TodoForm";
import PomodoroTimer from "@/app/components/PomodoroTimer";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  // Handle notifications permission
  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000); // Ask after 5 seconds
    }
  }, []);

  // Show loading state while checking auth
  if (status === "loading" || isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your tasks...
        </Typography>
      </Box>
    );
  }

  // If session exists, render the Todo app
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <TodoProvider>
        <PomodoroProvider>
          <Header />
          <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <TodoForm />
                <TodoList />
              </Grid>
              <Grid item xs={12} lg={4}>
                <Box sx={{ position: { lg: "sticky" }, top: { lg: 88 } }}>
                  <PomodoroTimer />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </PomodoroProvider>
      </TodoProvider>
    </Box>
  );
}
