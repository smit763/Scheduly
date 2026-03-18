import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-paper">
      <Navbar />
      <Container maxWidth="sm">
        <Box
          className="flex flex-col items-center justify-center text-center"
          sx={{ minHeight: "70vh", gap: 3 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: { xs: "6rem", md: "9rem" },
              fontWeight: 400,
              color: "text.disabled",
              lineHeight: 1
            }}
          >
            404
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400 }}
          >
            This booking link doesn't exist
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The link may have expired, been deactivated, or never existed.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            size="large"
            sx={{ mt: 1 }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
