import { Box, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import Rest from "./Rest";

const CheckPosture = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Loading Pose Model...");
  const [counter, setCounter] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [setCounters, setSetCounters] = useState(1);

  const handleRestFinish = () => {
    setShowRest(false);
    setCounter(0); // Reset or continue counting after rest
    setSetCounters((prev) => prev + 1); // Increment the set counter
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
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults((results) => {
      console.log("Pose results", results);
      if (!results.poseLandmarks) {
        console.log("No pose landmarks detected");
        return;
      }
      const isSquatGood = evaluateSquat(results.poseLandmarks);
      if (isSquatGood) {
        setStatus("✅ Good Squat!");
        if (counter < 10) {
          const newCount = counter + 1;
          setCounter(newCount);
          if (newCount === 10 && setSetCounters < 3) {
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
  }, []);

  const evaluateSquat = (landmarks) => {
    const hip = landmarks[24]; // Right hip
    const knee = landmarks[26]; // Right knee
    const ankle = landmarks[28]; // Right ankle
    const shoulder = landmarks[12]; // Right shoulder

    const hipKnee = Math.abs(hip.y - knee.y);
    const kneeAnkle = Math.abs(knee.y - ankle.y);
    const backStraight = Math.abs(shoulder.x - hip.x) < 0.2;
    const hipsLow = hip.y > shoulder.y;
    const kneesBent = hipKnee < kneeAnkle * 0.8;

    return kneesBent && backStraight && hipsLow;
  };

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
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1>Check Posture</h1>
        <Button variant="contained" onClick={() => setShowRest(true)}>
          Rest
        </Button>
        <p sx={{ color: "#008000" }}>
          {" "}
          Set: {setCounters} | Reps: {counter}/10
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

export default CheckPosture;
