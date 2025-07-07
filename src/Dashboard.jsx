import React from "react";
import { Box, Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleSquat = () => {
    navigate("/squat");
  };
  const handleJump = () => {
    navigate("/jump");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        width: "100vw",

        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{ width: "100%", maxWidth: "600px", padding: "20px", boxShadow: 3 }}
      >
        <h1>Welcome to the Posture Check Dashboard</h1>
        <p>This is your central hub for posture tracking and analysis.</p>
        {/* Additional content can be added here */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            gap: "10px",
          }}
        >
          <Button variant="contained" onClick={handleSquat}>
            Squat
          </Button>
          <Button variant="contained" onClick={handleJump}>
            Jump
          </Button>
          <Button variant="contained">Plank</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;
