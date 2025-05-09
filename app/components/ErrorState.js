"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ErrorState({
  message = "Something went wrong",
  onRetry = null,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Alert
        severity="error"
        variant="outlined"
        sx={{
          width: "100%",
          mb: 2,
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
      </Alert>

      {onRetry && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mt: 1 }}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );
}
