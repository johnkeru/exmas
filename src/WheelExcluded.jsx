import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { FaRedo } from "react-icons/fa";
import WheelCanvas from "./WheelCanvas";

const SpinnerWheel = () => {
  const segments = 8; // Fixed to 8 segments
  const [labels, setLabels] = useState([]);
  const [winner, setWinner] = useState("Spin the wheel to pick a prize.");
  const [lastStop, setLastStop] = useState("—");
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

  const colors = {
    primary: "#264524",
    gold: "#D4AF37",
    red: "#C41E3A",
    white: "#FFFFFF",
  };

  const pickLabels = () => {
    const base = [
      "🎁 Gift",
      "🎄 Tree",
      "❄️ Snow",
      "🍪 Cookie",
      "🔔 Bell",
      "🧦 Stocking",
      "✨ Surprise",
      "☃️ Snowman",
    ];
    return base.slice(0, 8); // Fixed to 8 labels
  };

  const randomize = () => {
    setLabels(pickLabels());
    setWinner("Spin the wheel to pick a prize.");
    setLastStop("—");
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
    setWinner(
      <>
        <strong style={{ color: colors.red }}>Winner:</strong>{" "}
        <span style={{ fontWeight: 800, color: colors.primary }}>{label}</span>
      </>
    );
    setLastStop(label);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
  };

  const handleReset = () => {
    randomize();
    wheelState.current.angle = 0;
    wheelState.current.angularVelocity = 0;
    wheelState.current.slowStartTime = null;
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <div className="container w-full max-w-[900px] grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <motion.div
        className="card bg-gradient-to-b from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.75)] rounded-2xl p-5 shadow-lg border-2 border-[rgba(0,0,0,0.03)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-[#264524]">
          Christmas Spinner Wheel
        </h1>
        <p className="text-gray-600">
          Click / tap and drag (flick) the wheel to spin. Force determines speed
          and duration — the wheel slows with realistic friction.
        </p>
        <div className="wheel-wrap flex items-center justify-center p-3 relative">
          <WheelCanvas
            ref={canvasRef}
            segments={segments}
            labels={labels}
            wheelState={wheelState}
            colors={colors}
            announceWinner={announceWinner}
          />
          <motion.div
            className="needle w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-[#D4AF37] absolute left-1/2 top-0 -translate-x-1/2"
            style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        <div className="flex gap-3 items-center flex-wrap mt-3">
          <button
            onClick={handleReset}
            className="button bg-[#264524] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1e3a1c] transition"
          >
            <FaRedo /> Reset Wheel
          </button>
          <div className="muted text-[#556b5d] text-sm">
            Primary color:{" "}
            <strong style={{ color: colors.primary }}>#264524</strong>
          </div>
        </div>
        <motion.div
          className="winner mt-3 p-3 rounded-lg bg-gradient-to-r from-[rgba(212,175,55,0.08)] to-[rgba(196,30,58,0.03)] min-h-[48px] flex items-center gap-3"
          aria-live="polite"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {winner}
        </motion.div>
      </motion.div>
      <footer className="col-span-1 md:col-span-2 text-center mt-3 text-[#607a68]">
        Made with ❤️ — Festive accents: gold, red, and white.
      </footer>
    </div>
  );
};

export default SpinnerWheel;
