import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./spinwheel.css";
import sound from "../../assets/Sound/Wheelsound.wav";
import img1 from "../../assets/GlobeIMG/lota.png";
import img2 from "../../assets/GlobeIMG/1.png";
import img3 from "../../assets/GlobeIMG/2.png";
import img4 from "../../assets/GlobeIMG/3.png";
import img5 from "../../assets/GlobeIMG/4.png";
import { useAuth } from "../../store/auth";



const socket = io("http://localhost:8000");

const SpinWheel = ({ onSpinComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [timerValue, setTimerValue] = useState(60);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedStopImage, setSelectedStopImage] = useState(null);
  const [setMode, setSetMode] = useState(1);
  const images = [img1, img2, img3, img4, img5];
  const totalSegments = 20;
  const segmentAngle = 360 / totalSegments;
  const numbers = Array.from({ length: totalSegments / 2 }, (_, i) => i);
  const {mode} = useAuth();

  const playSound = () => {
    new Audio(sound).play();
  };

  // Fetch timer value from server
  const fetchTimerValue = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/timer");
      const data = await response.json();
      setTimerValue(data.timeLeft);
    } catch (error) {
      console.error("Error fetching timer value:", error);
    }
  };

  // Poll for timer updates
  useEffect(() => {
    const interval = setInterval(fetchTimerValue, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle socket updates for spin state
  useEffect(() => {
    socket.on("stateUpdate", ({ rotation, isSpinning, activeImageIndex }) => {
      setRotation(rotation);
      setIsSpinning(isSpinning);

      if (!isSpinning) {
        // Normalize rotation to [0, 360)
        setActiveImageIndex(activeImageIndex);
        const normalizedRotation = ((rotation % 360) + 360) % 360;

        // Calculate the angle per segment
        const segmentAngle = 360 / totalSegments;

        // Find the segment index
        let sectionIndex = Math.floor(normalizedRotation / segmentAngle);

        // Ensure the pin always points to a yellow section (odd sections)
        if (sectionIndex % 2 !== 0) {
          // Adjust to the nearest yellow section
          sectionIndex = (sectionIndex + 1) % totalSegments;
        }

        // Calculate the corrected rotation to center the pin
        const adjustedRotation =
          sectionIndex * segmentAngle + segmentAngle / 2 - 18;

        // Apply the adjustment
        setRotation(adjustedRotation);

        // Calculate the final result value
        let resultValue = (totalSegments - sectionIndex) / 2;
        if (resultValue === 10) {
          resultValue = 0;
        }
        setResult(resultValue);
        console.log(resultValue);
        // Trigger callback
        if (onSpinComplete) {
          onSpinComplete(resultValue);
        }
      }
    });

    return () => socket.off("stateUpdate");
  }, [onSpinComplete]);

  // Trigger spin when timer reaches 59 seconds
  useEffect(() => {
    if (timerValue === 59 && !isSpinning) {
      playSound();
      socket.emit("startSpin");
    }
  }, [timerValue, isSpinning]);
  
  useEffect(() => {
    if (timerValue === 59 && !isSpinning) {
      playSound();
    }
  });

  // Manage spinning animation
  useEffect(() => {
    let animationFrameId;
    let startTime;

    if (isSpinning) {
      startTime = Date.now();

      const spinAnimation = () => {
        const elapsedTime = Date.now() - startTime;
        const currentRotation = (elapsedTime * 20 * 360) / 1000;
        setRotation(currentRotation % 360);

        if (elapsedTime < 9000) {
          animationFrameId = requestAnimationFrame(spinAnimation);
        } else {
          // Adjust to stop on a gold section
          const normalizedRotation = ((currentRotation % 360) + 360) % 360;
          let finalSectionIndex = Math.floor(normalizedRotation / segmentAngle);
          if (finalSectionIndex % 2 !== 0) {
            finalSectionIndex = (finalSectionIndex + 1) % totalSegments; // Snap to gold section
          }
          const finalRotation = finalSectionIndex * segmentAngle;
          console.log(finalRotation);
          setRotation(finalRotation);
          setIsSpinning(false);
        }
      };

      animationFrameId = requestAnimationFrame(spinAnimation);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpinning]);

  
  // Manage image slideshow during spinning
  useEffect(() => {
    if (isSpinning) {
      const slideshowInterval = setInterval(() => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 100);

      return () => clearInterval(slideshowInterval);
    }
    
  }, [isSpinning, activeImageIndex]);

  // Manage image slideshow during spinning with synchronized rotation
useEffect(() => {
  if (isSpinning) {
    const slideshowRotation = rotation; // Sync slideshow rotation with wheel
    const slideshowElement = document.querySelector(".slideshow");

    slideshowElement.style.transform = `rotateY(${slideshowRotation}deg)`;

    const slideshowInterval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 100);

    return () => clearInterval(slideshowInterval);
  } else {
    // Ensure the image at the stopping point is centered
    const slideshowElement = document.querySelector(".slideshow");
    const stopAngle = (activeImageIndex * (360 / images.length)) % 360;
    slideshowElement.style.transform = `rotateY(${-stopAngle}deg)`;
  }
}, [isSpinning, rotation]);

useEffect(() => {
  const images = document.querySelectorAll(".slideshow img");
  const angleStep = 360 / images.length;
  images.forEach((img, index) => {
    const angle = index * angleStep;
    img.style.transform = `rotateY(${angle}deg) translateZ(100px)`;
    img.style.backfaceVisibility = "hidden";
  });
}, []);


  return (
    <div className="wheelcontainer ">
      <div className="spin-wheel-container">
        <div className="pin"></div>
        <div
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {[...Array(totalSegments)].map((_, i) => (
            <div
              key={i}
              className="segment"
              style={{
                "--i": i,
                backgroundColor: i % 2 === 0 ? "#720000" : "#ffffff",
              }}
            >
            </div>
          ))}
          <div className="number">
            {[...Array(totalSegments)].map((_, i) => (
              <b key={i} style={{ "--i": i }}>
                {i % 2 === 0 ? numbers[i / 2] : ""}
              </b>
            ))}
          </div>
        </div>

        <div className="center-circle">
          <div className="slideshow">
            {images.map((src, index) => (
              <img key={index} src={src} alt={`Slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
