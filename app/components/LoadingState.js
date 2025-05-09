"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function LoadingState({ message = "Loading..." }) {
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
      <CircularProgress size={40} color="primary" />
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Paper>
  );
}
