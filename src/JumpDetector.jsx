import React, { useEffect, useState, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import Webcam from "react-webcam";
import { Box, Button } from "@mui/material";
import Rest from "./Rest";

const JumpDetector = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("🧍 Waiting...");
  const [counter, setCounter] = useState(0);
  const [setCounters, setSetCounters] = useState(1);
  const [showRest, setShowRest] = useState(false);
  const [lastY, setLastY] = useState(null);
  const [jumping, setJumping] = useState(false); // Prevent multiple counts per jump

  const JUMP_THRESHOLD = 0.08; // sensitivity

  const handleRestFinish = () => {
    setShowRest(false);
    setCounter(0);
    setSetCounters((prev) => prev + 1);
  };

  const detectJump = (landmarks) => {
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    if (leftAnkle && rightAnkle) {
      const currentY = (leftAnkle.y + rightAnkle.y) / 2;

      if (lastY !== null) {
        const velocity = lastY - currentY;

        if (velocity > JUMP_THRESHOLD && !jumping) {
          setJumping(true);
          setStatus("🦘 Jump Detected!");

          if (counter < 10) {
            const newCount = counter + 1;
            setCounter(newCount);

            if (newCount === 10 && setSetCounters < 3) {
              setStatus("🎉 Set Complete! Take a Rest");
              setShowRest(true);
            }
          }
        }

        // When the person lands
        if (velocity < 0 && jumping) {
          setJumping(false);
        }
      }

      setLastY(currentY);
    }
  };

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (results.poseLandmarks) {
        detectJump(results.poseLandmarks);
      }
    });

    if (webcamRef.current && webcamRef.current.video) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "10vh",
          backgroundColor: "#f0f0f0",
          width: "100vw",
          position: "fixed",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1>Jump Tracker</h1>
        <Button variant="contained" onClick={() => setShowRest(true)}>
          Rest
        </Button>
        <p style={{ color: "#008000", margin: "0 20px" }}>
          Set: {setCounters} | Jumps: {counter}/10
        </p>
        <p>{status}</p>
      </Box>
      <Box sx={{ mt: "12vh", display: "flex", justifyContent: "center" }}>
        {showRest ? (
          <Rest onFinish={handleRestFinish} />
        ) : (
          <Webcam
            ref={webcamRef}
            mirrored
            audio={false}
            width={840}
            height={580}
            style={{ borderRadius: "10px", border: "2px solid #ccc" }}
          />
        )}
      </Box>
    </div>
  );
};

export default JumpDetector;
