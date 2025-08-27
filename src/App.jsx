// src/components/ColorWheel.jsx
import React, { useRef, useEffect, useState } from "react";
import Snowfall from "react-snowfall"; // snowfall effect
import { FaTree, FaGift, FaSnowflake, FaArrowDown } from "react-icons/fa";

const ColorWheel = () => {
  const canvasRef = useRef(null);
  const [winner, setWinner] = useState("🎅 Spin the Christmas Wheel!");

  // Names with dummy profile pictures
  const players = [
    { name: "Alice", img: "https://i.pravatar.cc/50?img=1" },
    { name: "Bob", img: "https://i.pravatar.cc/50?img=2" },
    { name: "Charlie", img: "https://i.pravatar.cc/50?img=3" },
    { name: "Diana", img: "https://i.pravatar.cc/50?img=4" },
    { name: "Eve", img: "https://i.pravatar.cc/50?img=5" },
    { name: "Frank", img: "https://i.pravatar.cc/50?img=6" },
    { name: "Grace", img: "https://i.pravatar.cc/50?img=7" },
    { name: "Hank", img: "https://i.pravatar.cc/50?img=8" },
    { name: "Ivy", img: "https://i.pravatar.cc/50?img=9" },
    { name: "Jack", img: "https://i.pravatar.cc/50?img=10" },
    { name: "Karen", img: "https://i.pravatar.cc/50?img=11" },
    { name: "Leo", img: "https://i.pravatar.cc/50?img=12" },
  ];

  const segments = players.length;

  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const spinningRef = useRef(true);

  // Preload profile images
  const imagesRef = useRef([]);

  useEffect(() => {
    imagesRef.current = players.map((p) => {
      const img = new Image();
      img.src = p.img;
      return img;
    });
  }, [players]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const radius = canvas.width / 2;

    const drawWheel = () => {
      const holidayColors = [
        "#E63946",
        "#2A9D8F",
        "#F4A261",
        "#264653",
        "#F1FAEE",
        "#A8DADC",
      ];

      for (let i = 0; i < segments; i++) {
        const start = (i * 2 * Math.PI) / segments;
        const end = ((i + 1) * 2 * Math.PI) / segments;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, start, end);
        ctx.fillStyle = holidayColors[i % holidayColors.length];
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw name + image
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate((start + end) / 2);

        // Profile image
        const img = imagesRef.current[i];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(radius - 60, 0, 20, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, radius - 80, -20, 40, 40);
          ctx.restore();
        }

        // Name (bigger + stroked for readability)
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "right";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.strokeText(players[i].name, radius - 100, 6);
        ctx.fillStyle = "white";
        ctx.fillText(players[i].name, radius - 100, 6);

        ctx.restore();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angleRef.current);
      ctx.translate(-radius, -radius);
      drawWheel();
      ctx.restore();
    };

    const animate = () => {
      if (!isDraggingRef.current) {
        angleRef.current += velocityRef.current;
        velocityRef.current *= 0.98;
        if (Math.abs(velocityRef.current) < 0.001) {
          velocityRef.current = 0;
          if (spinningRef.current) {
            spinningRef.current = false;
            showWinner();
          }
        } else {
          spinningRef.current = true;
        }
      }
      render();
      requestAnimationFrame(animate);
    };

    const getMouseAngle = (x, y) => {
      const dx = x - radius;
      const dy = y - radius;
      return Math.atan2(dy, dx);
    };

    const showWinner = () => {
      let normalized =
        ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      let pointerAngle =
        ((3 * Math.PI) / 2 - normalized + 2 * Math.PI) % (2 * Math.PI);
      let segmentIndex = Math.floor((pointerAngle / (2 * Math.PI)) * segments);
      setWinner(`🎁 Winner: ${players[segmentIndex].name} 🎄`);
    };

    // Mouse events
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      lastAngleRef.current = getMouseAngle(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
      lastTimeRef.current = Date.now();
    };

    const handleMouseMove = (e) => {
      if (isDraggingRef.current) {
        const rect = canvas.getBoundingClientRect();
        const newAngle = getMouseAngle(
          e.clientX - rect.left,
          e.clientY - rect.top
        );
        const delta = newAngle - lastAngleRef.current;
        angleRef.current += delta;
        lastAngleRef.current = newAngle;
        const now = Date.now();
        const dt = (now - lastTimeRef.current) / 1000;
        velocityRef.current = delta / dt;
        lastTimeRef.current = now;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    render();
    animate();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [segments, players]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 via-red-800 to-yellow-700 overflow-hidden">
      {/* Falling snow effect */}
      <Snowfall snowflakeCount={100} style={{ pointerEvents: "none" }} />

      {/* Sparkling lights around wheel */}
      <div
        className="absolute w-[480px] h-[480px] rounded-full animate-pulse 
        bg-[radial-gradient(circle,rgba(255,255,255,0.5)_2px,transparent_3px)] 
        bg-[length:30px_30px] pointer-events-none"
      ></div>

      {/* Pointer with tree + arrow */}
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
        <FaTree className="text-green-400 w-10 h-10 drop-shadow-lg" />
        <FaArrowDown className="text-red-500 w-8 h-8 drop-shadow-lg" />
      </div>

      {/* Wheel */}
      <canvas
        ref={canvasRef}
        width={450}
        height={450}
        className="cursor-grab active:cursor-grabbing rounded-full shadow-[0_0_35px_rgba(255,255,255,0.9)] border-8 border-red-500"
      />

      {/* Winner display */}
      <p className="text-yellow-200 mt-6 text-2xl font-extrabold flex items-center gap-3 drop-shadow-lg animate-pulse">
        <FaGift className="text-green-300 w-7 h-7" />
        {winner}
        <FaSnowflake className="text-blue-200 w-7 h-7" />
      </p>
    </div>
  );
};

export default ColorWheel;
