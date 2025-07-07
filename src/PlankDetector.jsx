import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

const PlankDetector = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("🧍 Waiting...");
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
      if (!results.poseLandmarks) {
        console.log("No pose landmarks detected");
        return;
      }
      const isPlankGood = evaluatePlank(results.poseLandmarks);
      if (isPlankGood) {
        setStatus("✅ Good Plank!");
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
  }, [webcamRef, counter, setSetCounters]);

  const evaluatePlank = (landmarks) => {
    // Implement your plank evaluation logic here
    // For simplicity, let's assume the plank is good if the body is straight
    const spineBase = landmarks[11]; // Example landmark index for spine base
    const spineMid = landmarks[12]; // Example landmark index for spine mid
    const spineShoulder = landmarks[13]; // Example landmark index for spine shoulder

    // Check if the spine is relatively straight
    const spineAngle =
      Math.abs(spineBase.y - spineMid.y) +
      Math.abs(spineMid.y - spineShoulder.y);

    // Define a threshold for a good plank posture
    const plankThreshold = 0.05; // Adjust this value based on your requirements

    return spineAngle < plankThreshold;
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
      if (!results.poseLandmarks) {
        console.log("No pose landmarks detected");
        return;
      }
      const isPlankGood = evaluatePlank(results.poseLandmarks);
      if (isPlankGood) {
        setStatus("✅ Good Plank!");
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
  }, [webcamRef, counter, setSetCounters]);

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
      if (!results.poseLandmarks) {
        console.log("No pose landmarks detected");
        return;
      }
      const isPlankGood = evaluatePlank(results.poseLandmarks);
      if (isPlankGood) {
        setStatus("✅ Good Plank!");
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
  }, [webcamRef, counter, setSetCounters]);

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

export default PlankDetector;
