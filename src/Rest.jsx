import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";

const Rest = ({ onFinish }) => {
  const [restCounter, setRestCounter] = useState(30);
  useEffect(() => {
    const timer = setInterval(() => {
      setRestCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(); // Call parent callback to go back
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

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
      <h1>Rest Time: {restCounter}s</h1>
    </Box>
  );
};

export default Rest;
