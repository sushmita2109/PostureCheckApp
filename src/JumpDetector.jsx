import React, { useEffect, useState, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import Webcam from "react-webcam";

const JumpDetector = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("🧍 Waiting...");
  const [counter, setCounter] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [setCounters, setSetCounters] = useState(1);

  const [lastY, setLastY] = useState(null);

  const handleRestFinish = () => {
    setShowRest(false);
    setCounter(0); // Reset or continue counting after rest
    setSetCounters((prev) => prev + 1); // Increment the set counter
  };

  const detectJump = (landmarks) => {
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // Basic check: both ankles are detected
    if (leftAnkle && rightAnkle) {
      const currentY = (leftAnkle.y + rightAnkle.y) / 2;

      if (lastY !== null) {
        const jumpThreshold = 0.08;
        const velocity = lastY - currentY;

        if (velocity > jumpThreshold) {
          setStatus("🦘 Jump Detected!");
          return;
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

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
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

export default JumpDetector;
