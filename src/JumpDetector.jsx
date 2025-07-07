import React, { useEffect, useState, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import Webcam from "react-webcam";

const JumpDetector = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("🧍 Waiting...");

  const [lastY, setLastY] = useState(null);

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
      <h2 style={{ textAlign: "center" }}>{status}</h2>
      <Webcam ref={webcamRef} width={640} height={480} mirrored />
    </div>
  );
};

export default JumpDetector;
