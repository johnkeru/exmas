import React, { useRef, useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import { FaTree, FaArrowDown } from "react-icons/fa";
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
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate((start + end) / 2);

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

    const animate = (timestamp) => {
      if (!isDraggingRef.current && spinningRef.current) {
        const momentum = Math.abs(velocityRef.current);
        const friction = 0.998 - Math.min(momentum * 0.0002, 0.005); // Slower decay for higher momentum
        velocityRef.current *= friction;
        angleRef.current += velocityRef.current;

        const elapsedTime = (timestamp - spinStartTimeRef.current) / 1000;
        const minSpinTime = Math.min(momentum * 0.5, 5); // Stronger spins last up to 5s

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
          // Only spin if there's enough momentum
          velocityRef.current *= Math.min(2 + momentum * 0.2, 4); // Scale momentum
          if (momentum < 0.5) {
            velocityRef.current = Math.sign(velocityRef.current) * 0.5; // Minimum spin
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#264524] via-[#3b6b36] to-[#c0392b] overflow-hidden">
      <Snowfall snowflakeCount={100} style={{ pointerEvents: "none" }} />

      <div
        className="absolute w-[480px] h-[480px] rounded-full animate-pulse 
        bg-[radial-gradient(circle,rgba(255,255,255,0.5)_2px,transparent_3px)] 
        bg-[length:30px_30px] pointer-events-none"
      ></div>

      <div className="absolute top-[110px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
        <FaTree className="text-[#264524] w-10 h-10 drop-shadow-lg" />
        <FaArrowDown className="text-red-500 w-8 h-8 drop-shadow-lg" />
      </div>

      <canvas
        ref={canvasRef}
        width={450}
        height={450}
        className="cursor-grab active:cursor-grabbing rounded-full shadow-[0_0_35px_rgba(255,255,255,0.9)] border-8 border-[#264524]"
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
              className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src={winnerData.img}
                alt={winnerData.name}
                className="w-28 h-28 rounded-full border-4 border-[#e1b12c] shadow-lg"
              />
              <h2 className="text-3xl font-extrabold text-[#264524]">
                🎉 Winner: {winnerData.name} 🎄
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWinner(null)}
                className="mt-4 bg-[#c0392b] text-white px-6 py-2 rounded-xl shadow-md font-bold"
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
