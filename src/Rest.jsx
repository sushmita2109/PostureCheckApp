import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";

const Rest = () => {
  const [restCounter, setRestCounter] = useState(30);
  useEffect(() => {
    if (restCounter === 0) return;

    const timer = setInterval(() => {
      setRestCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Clean up on unmount
  }, [restCounter]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "rgba(240, 240, 240, 0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <h1>{restCounter > 0 ? restCounter : "Let's Go!"}</h1>
    </Box>
  );
};

export default Rest;
