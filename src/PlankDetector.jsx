import { Box, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import Rest from "./Rest";

const PlankDetector = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("🧍 Waiting...");
  const [counter, setCounter] = useState(0);
  const [setCounters, setSetCounters] = useState(1);
  const [showRest, setShowRest] = useState(false);

  const handleRestFinish = () => {
    setShowRest(false);
    setCounter(0);
    setSetCounters((prev) => prev + 1);
  };

  const evaluatePlank = (landmarks) => {
    // Using right-side landmarks for example
    const shoulder = landmarks[12];
    const hip = landmarks[24];
    const ankle = landmarks[28];

    if (!shoulder || !hip || !ankle) return false;

    const dx1 = hip.x - shoulder.x;
    const dy1 = hip.y - shoulder.y;

    const dx2 = ankle.x - hip.x;
    const dy2 = ankle.y - hip.y;

    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);

    const angleDiff = Math.abs(angle1 - angle2);
    const threshold = 0.2; // radians ~11.5 degrees

    return angleDiff < threshold;
  };

  useEffect(() => {
    const videoElement = webcamRef.current?.video;
    if (!videoElement) return;

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
      if (!results.poseLandmarks) return;

      const isPlankGood = evaluatePlank(results.poseLandmarks);
      if (isPlankGood) {
        setStatus("✅ Good Plank!");
        if (counter < 10) {
          const newCount = counter + 1;
          setCounter(newCount);
          if (newCount === 10 && setCounters < 3) {
            setStatus("🎉 Set Complete! Take a Rest");
            setShowRest(true);
          }
        }
      } else {
        setStatus("⚠️ Adjust Your Posture");
      }
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 840,
      height: 580,
    });

    camera.start();
  }, [counter, setCounters]);

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
          gap: 2,
        }}
      >
        <h1>Plank Posture</h1>
        <Button variant="contained" onClick={() => setShowRest(true)}>
          Rest
        </Button>
        <span style={{ color: "#008000" }}>
          Set: {setCounters} | Seconds: {counter}/10
        </span>
        <span>{status}</span>
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

export default PlankDetector;
