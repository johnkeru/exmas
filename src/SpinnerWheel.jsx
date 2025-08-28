import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import WheelCanvas from "./WheelCanvas";

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
    "#2A4D3E", // Forest Green
    "#A71D31", // Deep Red
    "#FFD700", // Warm Gold
    "#F5F6F5", // Snow White
    "#4682B4", // Icy Blue
  ];

  const pickLabels = () => {
    const base = [
      "🎁 Gift Card",
      "🎄 Xmas Ornament",
      "❄️ Snow Globe",
      "🍪 Cookies",
      "🔔 Jingle Bell",
      "🧦 Stocking",
      "✨ Surprise Gift",
      "☃️ Snowman",
    ];
    return base.slice(0, 8);
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
    const label = labels[idx];
    setWinner(label);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setTimeout(() => setWinner(null), 500); // Close popup after confetti
    }, 5000);
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
      "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    randomize();
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F5] flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={colors}
          confettiSource={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          drawShape={(ctx) => {
            const shapes = [
              () => {
                ctx.beginPath();
                ctx.moveTo(0, -10);
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
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(-6, 0);
                ctx.lineTo(6, 0);
                ctx.closePath();
                ctx.fill();
              },
              () => {
                ctx.font = "12px Arial";
                ctx.fillText("❄", -6, 4);
              },
            ];
            shapes[Math.floor(Math.random() * shapes.length)]();
          }}
        />
      )}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full border border-[#A71D31]/30"
              style={{ fontFamily: "'Mountains of Christmas', cursive" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-[#2A4D3E] mb-4 flex items-center gap-2">
                <i className="fas fa-gift text-[#A71D31]"></i> Merry Winner!
              </h2>
              <p className="text-xl text-[#A71D31] mb-4">
                You won:{" "}
                <span className="font-bold text-[#2A4D3E]">{winner}</span>
              </p>
              <motion.button
                onClick={handleReset}
                className="bg-[#A71D31] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-[#8B1A28] transition mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-redo"></i> Spin Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-xl max-w-[900px] w-full border border-[#A71D31]/20"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#2A4D3E] flex items-center gap-2 mb-4">
            <i className="fas fa-gift text-[#A71D31]"></i> Christmas Prize Wheel
          </h1>
          <p className="text-gray-600 text-lg mb-4 text-center">
            Spin the wheel to win a festive Christmas prize! Flick harder for a
            merrier spin!
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
              className="absolute w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#FFD700] left-1/2 top-0 -translate-x-1/2"
              style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" }}
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          </div>
          <motion.button
            onClick={handleReset}
            className="bg-[#A71D31] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-[#8B1A28] transition mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-redo"></i> Reset
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SpinnerWheel;
