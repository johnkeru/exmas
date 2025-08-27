import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { FaRedo, FaGift } from "react-icons/fa";
import WheelCanvas from "./WheelCanvas";

const SpinnerWheel = () => {
  const segments = 8;
  const [labels, setLabels] = useState([]);
  const [winner, setWinner] = useState(
    "Spin the wheel to pick a Christmas prize!"
  );
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
    hollyGreen: "#1A3C34",
    goldenBell: "#FFD700",
    candyRed: "#A10000",
    snowWhite: "#F5F6F5",
  };

  const pickLabels = () => {
    const base = [
      "🎁 Gift Card",
      "🎄 Xmas Tree",
      "❄️ Snow Globe",
      "🍪 Gingerbread",
      "🔔 Jingle Bell",
      "🧦 Stocking",
      "✨ Surprise",
      "☃️ Snowman",
    ];
    return base.slice(0, 8);
  };

  const randomize = () => {
    setLabels(pickLabels());
    setWinner("Spin the wheel to pick a Christmas prize!");
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
        <strong style={{ color: colors.candyRed }}>Merry Winner:</strong>{" "}
        <span style={{ fontWeight: 800, color: colors.hollyGreen }}>
          {label}
        </span>
      </>
    );
    setLastStop(label);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000); // Extended confetti duration
  };

  const handleReset = () => {
    randomize();
    wheelState.current.angle = 0;
    wheelState.current.angularVelocity = 0;
    wheelState.current.slowStartTime = null;
  };

  useEffect(() => {
    // Load festive font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    randomize();
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      className="container w-full max-w-[900px] grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5"
      style={{
        background: `url('https://www.transparenttextures.com/patterns/snow.png')`,
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={[
            colors.candyRed,
            colors.hollyGreen,
            colors.goldenBell,
            colors.snowWhite,
          ]}
          confettiSource={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          drawShape={(ctx) => {
            // Custom Christmas shapes (star, tree, snowflake)
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
                ctx.moveTo(0, -10);
                ctx.lineTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.lineTo(0, -10);
                ctx.lineTo(-6, 2);
                ctx.lineTo(6, 2);
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
      <motion.div
        className="card bg-gradient-to-b from-[rgba(245,246,245,0.95)] to-[rgba(255,255,255,0.8)] rounded-2xl p-5 shadow-lg border-2 border-[rgba(161,0,0,0.1)]"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#1A3C34] flex items-center gap-2">
          <FaGift className="text-[#A10000]" /> Christmas Party Wheel
        </h1>
        <p className="text-gray-600 text-lg">
          Flick the wheel to spin and win a festive prize! The harder you flick,
          the faster it spins!
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
            className="needle w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-[#FFD700] absolute left-1/2 top-0 -translate-x-1/2"
            style={{ filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" }}
            animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SpinnerWheel;
