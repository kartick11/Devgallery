import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { projectApi } from "../api/project.api";
import utils from "../utils";

const calculateEAR = (eyeLandmarks) => {
  const v1 = Math.hypot(eyeLandmarks[1].x - eyeLandmarks[5].x, eyeLandmarks[1].y - eyeLandmarks[5].y);
  const v2 = Math.hypot(eyeLandmarks[2].x - eyeLandmarks[4].x, eyeLandmarks[2].y - eyeLandmarks[4].y);
  const h = Math.hypot(eyeLandmarks[0].x - eyeLandmarks[3].x, eyeLandmarks[0].y - eyeLandmarks[3].y);
  return (v1 + v2) / (2.0 * h);
};

export const useVoteVerification = (projectId) => {
  // Authentication / Role Check
  const [currentUserRole] = useState(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "string" ? parsed : parsed?.role;
    } catch {
      return raw;
    }
  });

  const isBlockedRole = currentUserRole === "admin" || currentUserRole === "organizer";

  // Refs for UI mounting and interval tracking
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Local Component State
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [facialPattern, setFacialPattern] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [livenessMsg, setLivenessMsg] = useState("");
  const [verificationProgress, setVerificationProgress] = useState(0);

  const stopCamera = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setVideoReady(false);
    setCameraStarted(false);
  };

  useEffect(() => {
    if (isBlockedRole) return;
    let cancelled = false;

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        if (!cancelled) setModelsLoaded(true);
      } catch {
        if (!cancelled) setErrorMsg("Failed to load face detection models. Check your /models folder.");
      }
    };

    loadModels();
    return () => { cancelled = true; stopCamera(); };
  }, [isBlockedRole]);

  useEffect(() => {
    const video = videoRef.current;
    if (!cameraStarted || !video || !streamRef.current) return;

    video.srcObject = streamRef.current;
    const startPlayback = async () => {
      try {
        await video.play();
        setVideoReady(true);
      } catch {
        setErrorMsg("Browser blocked video playback. Try clicking 'Open Camera' again.");
      }
    };

    if (video.readyState >= 1) startPlayback();
    else video.onloadedmetadata = startPlayback;

    return () => { video.onloadedmetadata = null; };
  }, [cameraStarted]);

  const startCamera = async () => {
    setErrorMsg(""); setLivenessMsg(""); setImage(null); setFacialPattern(null);
    setVideoReady(false); setVerificationProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      const track = stream.getVideoTracks()[0];
      if (!track || track.readyState === "ended") {
        setErrorMsg("Camera is in use by another application. Close it and try again.");
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      setCameraStarted(true);
    } catch (error) {
      if (error?.name === "NotAllowedError") setErrorMsg("Camera permission denied. Allow access and try again.");
      else if (error?.name === "NotFoundError") setErrorMsg("No camera found on this device.");
      else setErrorMsg("Camera access failed. Please try again.");
    }
  };

  const startLivenessCheck = () => {
    setErrorMsg(""); setLivenessMsg("Blink and slowly turn your head slightly left and right...");
    setVerificationProgress(10);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return setErrorMsg("Video element not found.");
    if (!video.videoWidth || !video.videoHeight) return setErrorMsg("Camera is still starting. Wait a moment and try again.");

    setIsDetecting(true);
    let blinkState = 0;
    let isProcessing = false;

    detectionIntervalRef.current = setInterval(async () => {
      if (!video || video.paused || video.ended) {
        clearInterval(detectionIntervalRef.current);
        return;
      }
      if (isProcessing) return;
      isProcessing = true;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const result = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        if (result) {
          if (blinkState === 0) setVerificationProgress(40);

          const leftEye = result.landmarks.getLeftEye();
          const rightEye = result.landmarks.getRightEye();
          const avgEAR = (calculateEAR(leftEye) + calculateEAR(rightEye)) / 2;

          if (avgEAR > 0.27 && blinkState === 0) {
            // Waiting
          } else if (avgEAR < 0.24 && blinkState === 0) {
            blinkState = 1; setVerificationProgress(75);
          } else if (avgEAR > 0.27 && blinkState === 1) {
            blinkState = 2;
            clearInterval(detectionIntervalRef.current);
            setLivenessMsg("Blink detected! Finalizing...");
            setVerificationProgress(90);

            const finalResult = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (finalResult) {
              setVerificationProgress(100);
              setLivenessMsg("Real person verified!");
              setFacialPattern(Array.from(finalResult.descriptor));

              setTimeout(() => {
                setImage(canvas.toDataURL("image/png"));
                stopCamera();
                setIsDetecting(false);
              }, 500);
            } else {
              setErrorMsg("Failed to capture final face pattern. Please try again.");
              setVerificationProgress(0); setIsDetecting(false);
            }
          }
        } else {
          if (blinkState === 0) setVerificationProgress(10);
        }
      } catch (error) {
        console.error("Detection error:", error);
      } finally {
        isProcessing = false;
      }
    }, 150);
  };

  const retakePhoto = () => {
    setImage(null); setFacialPattern(null); setLivenessMsg(""); setVerificationProgress(0);
    startCamera();
  };

  const submitVote = async () => {
    if (isBlockedRole) return utils.handleError("Admins and organizers are not allowed to submit votes.");
    if (!facialPattern) return utils.handleError("Please capture your face before submitting.");

    try {
      const { ok, data } = await projectApi.submitVote(projectId, name, facialPattern);
      if (!ok) {
        utils.handleError(data.message || "An error occurred submitting your vote.");
      } else {
        utils.handleSuccess("Vote Submitted Successfully!");
      }
    } catch {
      utils.handleError("Server error. Please try again later.");
    }
  };

  return {
    // Auth & Status
    isBlockedRole, currentUserRole, modelsLoaded, errorMsg,
    // Refs to attach to UI
    videoRef, canvasRef,
    // Form & UI State
    name, setName, image, cameraStarted, videoReady, isDetecting, livenessMsg, verificationProgress,
    // Actions
    startCamera, startLivenessCheck, retakePhoto, submitVote
  };
};