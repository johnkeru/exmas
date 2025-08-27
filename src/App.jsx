import React, { useRef, useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import {
  FaTree,
  FaArrowDown,
  FaGift,
  FaSnowflake,
  FaStar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ColorWheel = () => {
  const canvasRef = useRef(null);
  const [winner, setWinner] = useState(null);
  const [winnerData, setWinnerData] = useState(null);

  const players = [
    { name: "Alice", img: "https://i.pravatar.cc/150?img=1" },
    { name: "Bob", img: "https://i.pravatar.cc/150?img=2" },
    { name: "Charlie", img: "https://i.pravatar.cc/150?img=3" },
    { name: "Diana", img: "https://i.pravatar.cc/150?img=4" },
    { name: "Eve", img: "https://i.pravatar.cc/150?img=5" },
    { name: "Frank", img: "https://i.pravatar.cc/150?img=6" },
    { name: "Grace", img: "https://i.pravatar.cc/150?img=7" },
    { name: "Hank", img: "https://i.pravatar.cc/150?img=8" },
    { name: "Ivy", img: "https://i.pravatar.cc/150?img=9" },
    { name: "Jack", img: "https://i.pravatar.cc/150?img=10" },
    { name: "Karen", img: "https://i.pravatar.cc/150?img=11" },
    { name: "Leo", img: "https://i.pravatar.cc/150?img=12" },
  ];

  const segments = players.length;
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const spinningRef = useRef(false);
  const spinStartTimeRef = useRef(0);
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
        "#264524",
        "#3b6b36",
        "#c0392b",
        "#e1b12c",
        "#ffffff",
      ];

      for (let i = 0; i < segments; i++) {
        const start = (i * 2 * Math.PI) / segments;
        const end = ((i + 1) * 2 * Math.PI) / segments;

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, start, end);
        ctx.fillStyle = holidayColors[i % holidayColors.length];
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate((start + end) / 2);

        const img = imagesRef.current[i];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(radius - 80, 0, 25, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, radius - 105, -25, 50, 50);
          ctx.restore();
        }

        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "right";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.strokeText(players[i].name, radius - 120, 8);
        ctx.fillStyle = "white";
        ctx.fillText(players[i].name, radius - 120, 8);

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

    const animate = (timestamp) => {
      if (!isDraggingRef.current && spinningRef.current) {
        const momentum = Math.abs(velocityRef.current);
        const friction = 0.998 - Math.min(momentum * 0.0002, 0.005);
        velocityRef.current *= friction;
        angleRef.current += velocityRef.current;

        const elapsedTime = (timestamp - spinStartTimeRef.current) / 1000;
        const minSpinTime = Math.min(momentum * 0.5, 5);

        if (
          Math.abs(velocityRef.current) < 0.0005 &&
          elapsedTime > minSpinTime
        ) {
          velocityRef.current = 0;
          spinningRef.current = false;
          showWinner();
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

      const selected = players[segmentIndex];
      setWinnerData(selected);
      setWinner(selected.name);
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      spinningRef.current = false;
      velocityRef.current = 0;
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

        const now = Date.now();
        const dt = (now - lastTimeRef.current) / 1000;
        if (dt > 0) {
          velocityRef.current = delta / dt;
        }
        lastAngleRef.current = newAngle;
        lastTimeRef.current = now;
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        const momentum = Math.abs(velocityRef.current);
        if (momentum > 0.1) {
          velocityRef.current *= Math.min(2 + momentum * 0.2, 4);
          if (momentum < 0.5) {
            velocityRef.current = Math.sign(velocityRef.current) * 0.5;
          }
          spinningRef.current = true;
          spinStartTimeRef.current = performance.now();
        }
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    render();
    requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [segments, players]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#2c4a2e] via-[#4a7043] to-[#d9534f] overflow-hidden">
      <Snowfall snowflakeCount={150} style={{ pointerEvents: "none" }} />

      <h1 className="absolute top-8 text-4xl font-extrabold text-white drop-shadow-lg">
        🎄 Holiday Spin Wheel 🎅
      </h1>

      <div
        className="absolute w-[650px] h-[650px] rounded-full animate-pulse 
        bg-[radial-gradient(circle,rgba(255,255,255,0.6)_3px,transparent_4px)] 
        bg-[length:40px_40px] pointer-events-none"
      ></div>

      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
        <FaTree className="text-[#264524] w-12 h-12 drop-shadow-lg" />
        <FaArrowDown className="text-red-600 w-10 h-10 drop-shadow-lg" />
      </div>

      <motion.div
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <FaGift className="text-[#c0392b] w-10 h-10 absolute top-0 left-[-340px] drop-shadow-lg" />
        <FaSnowflake className="text-[#ffffff] w-10 h-10 absolute top-0 right-[-340px] drop-shadow-lg" />
        <FaStar className="text-[#e1b12c] w-10 h-10 absolute bottom-[-340px] left-0 drop-shadow-lg" />
        <FaGift className="text-[#264524] w-10 h-10 absolute bottom-[-340px] right-0 drop-shadow-lg" />
      </motion.div>

      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="cursor-grab active:cursor-grabbing rounded-full shadow-[0_0_50px_rgba(255,255,255,1)] border-10 border-[#264524]"
      />

      <AnimatePresence>
        {winner && winnerData && (
          <motion.div
            key="winner-popup"
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          >
            <motion.div
              className="bg-white rounded-2xl p-10 flex flex-col items-center gap-5 shadow-2xl"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src={winnerData.img}
                alt={winnerData.name}
                className="w-32 h-32 rounded-full border-4 border-[#e1b12c] shadow-lg"
              />
              <h2 className="text-4xl font-extrabold text-[#264524]">
                🎉 Winner: {winnerData.name} 🎄
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWinner(null)}
                className="mt-5 bg-[#c0392b] text-white px-8 py-3 rounded-xl shadow-md font-bold"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorWheel;
