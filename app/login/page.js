"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EmailIcon from "@mui/icons-material/Email";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  // Form data state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip redirect during server rendering or before component is mounted
    if (!mounted || status === "loading") return;

    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router, mounted]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/" }).catch(() => {
      setLoading(false);
    });
  };

  const handleGitHubSignIn = () => {
    setLoading(true);
    signIn("github", { callbackUrl: "/" }).catch(() => {
      setLoading(false);
    });
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Successful login will trigger the useEffect above and redirect
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate input
    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Registration successful - show success message and switch to login tab
      setSuccessMessage("Registration successful! You can now log in.");
      setShowSuccessMessage(true);
      setActiveTab(0); // Switch to login tab

      // Clear registration form
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");

      // Pre-fill login form with registered email
      setLoginEmail(registerEmail);
      setLoginPassword("");

      setLoading(false);
    } catch (error) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  // Show loading state while checking auth
  // Don't use status directly to prevent hydration mismatch
  if (!mounted || status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Box sx={{ visibility: mounted ? "visible" : "hidden" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <TaskAltIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="500" gutterBottom>
            Todo App
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access your tasks
          </Typography>
        </Box>

        {/* Tabs for Login/Register */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleCredentialsSignIn} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
              startIcon={<EmailIcon />}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In with Email"}
            </Button>
          </Box>
        )}

        {/* Registration Form */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handleRegister} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="registerEmail"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="registerPassword"
              label="Password"
              type="password"
              id="registerPassword"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              disabled={loading}
              helperText="At least 8 characters"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* OAuth Providers */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            Sign in with Google
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<GitHubIcon />}
            onClick={handleGitHubSignIn}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            Sign in with GitHub
          </Button>
        </Box>

        <Card variant="outlined" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="body1" paragraph>
              With this app you can:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Create and manage your tasks
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Use the Pomodoro timer for productivity
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Organize tasks by priority and category
              </Typography>
              <Typography component="li" variant="body2">
                Track completed and upcoming tasks
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
