// SpinnerWheel.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import WheelCanvas from "./WheelCanvas";

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

const SpinnerWheel = () => {
  const segments = 8;
  const [labels, setLabels] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);
  const wheelState = useRef({
    angle: 0,
    angularVelocity: 0,
    isDragging: false,
    lastPointerAngle: 0,
    recent: [],
    stopped: true,
    slowStartTime: null,
  });

  const colors = [
    "#1A3C34", // Deep Forest Green
    "#9B1B30", // Rich Christmas Red
    "#FFD700", // Sparkling Gold
    "#E6E7E8", // Frosty White
    "#3B5998", // Winter Blue
  ];

  const pickLabels = () => {
    // Shuffle players array and take up to 8 players
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, segments);
  };

  const randomize = () => {
    setLabels(pickLabels());
    setWinner(null);
    setShowConfetti(false);
  };

  const announceWinner = () => {
    const segAngle = (Math.PI * 2) / segments;
    const needleAngle = Math.PI / 2;
    const effective = -needleAngle - wheelState.current.angle;
    let normalized = effective % (Math.PI * 2);
    if (normalized < 0) normalized += Math.PI * 2;
    const idx = Math.floor(normalized / segAngle) % segments;
    const label = labels[idx]?.name || "Unknown"; // Use name for winner announcement
    setWinner(label);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setTimeout(() => setWinner(null), 500);
    }, 6000);
  };

  const handleReset = () => {
    randomize();
    wheelState.current.angle = 0;
    wheelState.current.angularVelocity = 0;
    wheelState.current.slowStartTime = null;
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Christmas+Bell:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    randomize();
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors[4]} 0%, ${colors[0]} 100%)`,
        backgroundImage: `url('https://www.transparenttextures.com/patterns/snow.png')`,
      }}
    >
      {/* Falling snow effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10%",
            }}
            animate={{
              y: window.innerHeight + 10,
              opacity: [0, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ❄️
          </motion.div>
        ))}
      </div>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={colors}
          numberOfPieces={200}
          confettiSource={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          drawShape={(ctx) => {
            const shapes = [
              () => {
                // Christmas tree
                ctx.beginPath();
                ctx.moveTo(0, -12);
                ctx.lineTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.lineTo(0, 12);
                ctx.closePath();
                ctx.fill();
              },
              () => {
                // Star
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                  ctx.lineTo(
                    10 * Math.cos((Math.PI * 2 * i) / 5 + Math.PI / 10),
                    10 * Math.sin((Math.PI * 2 * i) / 5 + Math.PI / 10)
                  );
                  ctx.lineTo(
                    5 * Math.cos((Math.PI * (2 * i + 1)) / 5 + Math.PI / 10),
                    5 * Math.sin((Math.PI * (2 * i + 1)) / 5 + Math.PI / 10)
                  );
                }
                ctx.closePath();
                ctx.fill();
              },
              () => {
                // Present
                ctx.beginPath();
                ctx.rect(-6, -6, 12, 12);
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.moveTo(0, -6);
                ctx.lineTo(0, 6);
                ctx.stroke();
              },
              () => {
                ctx.font = "16px Arial";
                ctx.fillText("🎁", -6, 4);
              },
            ];
            shapes[Math.floor(Math.random() * shapes.length)]();
          }}
        />
      )}

      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full border-4 border-[#FFD700]"
              style={{ fontFamily: "'Christmas Bell', cursive" }}
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 10 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <h2 className="text-4xl font-bold text-[#1A3C34] mb-4 flex items-center gap-3">
                <i className="fas fa-star text-[#FFD700]"></i> Holiday Cheers!
              </h2>
              <p className="text-2xl text-[#9B1B30] mb-6">
                Winner:{" "}
                <span className="font-bold text-[#1A3C34]">{winner}</span>
              </p>
              <motion.button
                onClick={handleReset}
                className="bg-[#9B1B30] text-white font-bold py-3 px-6 rounded-lg flex items-center gap-3 hover:bg-[#7A1626] transition mx-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-sleigh"></i> Spin Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-[900px] w-full border-4 border-[#FFD700]"
        style={{ fontFamily: "'Christmas Bell', cursive" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-[#1A3C34] flex items-center gap-3 mb-4">
            <i className="fas fa-tree text-[#9B1B30]"></i> Christmas Party Wheel
          </h1>
          <p className="text-[#3B5998] text-xl mb-6 text-center max-w-md">
            Give it a festive flick to pick a winner! Spin with holiday spirit!
          </p>
          <div className="relative">
            <WheelCanvas
              ref={canvasRef}
              segments={segments}
              labels={labels}
              wheelState={wheelState}
              colors={colors}
              announceWinner={announceWinner}
            />
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <div
                className="w-4 h-10 bg-red-600 rounded"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}
              />
              <div
                className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-yellow-400"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}
              />
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    left: `calc(50% + ${
                      Math.cos((i * Math.PI * 2) / 8) * 360
                    }px)`,
                    top: `calc(50% + ${
                      Math.sin((i * Math.PI * 2) / 8) * 360
                    }px)`,
                    background: ["#FF0000", "#00FF00", "#FFFF00", "#0000FF"][
                      i % 4
                    ],
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 + i * 0.2 }}
                />
              ))}
            </div>
          </div>
          <motion.button
            onClick={handleReset}
            className="bg-[#9B1B30] text-white font-bold py-3 px-6 rounded-lg flex items-center gap-3 hover:bg-[#7A1626] transition mt-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-gift"></i> Reset & Spin
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SpinnerWheel;
