import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import WheelCanvas from "./WheelCanvas";

const initialPlayers = [
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
  const [segments, setSegments] = useState(8);
  const [availablePlayers, setAvailablePlayers] = useState(initialPlayers);
  const [winners, setWinners] = useState([]);
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
    "#A3080C", // Holly Red
    "#1A3C34", // Evergreen
    "#FFD700", // Gold
    "#F5F6F5", // Snow White
    "#4B7043", // Pine Green
  ];

  const pickLabels = () => {
    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(segments, availablePlayers.length));
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
    const winnerData = labels[idx] || { name: "Unknown", img: "" };
    setWinner(winnerData);
    setShowConfetti(true);
    const audio = new Audio(
      "https://www.myinstants.com/media/sounds/jingle-bells.mp3" // Jingle bell sound
    );
    audio.play();
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  const handleExclude = () => {
    if (winner) {
      setAvailablePlayers((prev) =>
        prev.filter((player) => player.name !== winner.name)
      );
      setWinners((prev) => [...prev, winner]);
      setSegments((prev) =>
        Math.max(2, Math.min(prev - 1, availablePlayers.length - 1))
      );
      randomize();
      wheelState.current.angle = 0;
      wheelState.current.angularVelocity = 0;
      wheelState.current.slowStartTime = null;
      setWinner(null);
    }
  };

  const handleClose = () => {
    setWinner(null);
    setShowConfetti(false);
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
      "https://fonts.googleapis.com/css2?family=Christmas+Bell:wght@400;700&family=Mountains+of+Christmas:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    randomize();
    return () => document.head.removeChild(link);
  }, [availablePlayers, segments]);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 relative overflow-hidden gap-8"
      style={{
        background: `linear-gradient(135deg, ${colors[4]} 0%, ${colors[1]} 100%), url('https://www.transparenttextures.com/patterns/snow.png'), url('https://images.unsplash.com/photo-1542319630-55fb7f7c944a?auto=format&fit=crop&w=1920&q=80')`,
        backgroundBlendMode: "overlay, multiply, normal",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Falling snow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
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
          numberOfPieces={300}
          confettiSource={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          style={{ zIndex: 20 }}
          drawShape={(ctx) => {
            const shapes = [
              () => {
                ctx.beginPath();
                ctx.moveTo(0, -12);
                ctx.lineTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.lineTo(0, 12);
                ctx.closePath();
                ctx.fill();
              },
              () => {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                  ctx.lineTo(
                    10 * Math.cos((Math.PI * 2 * i) / 6),
                    10 * Math.sin((Math.PI * 2 * i) / 6)
                  );
                }
                ctx.closePath();
                ctx.fill();
              },
              () => {
                ctx.font = "20px 'Christmas Bell'";
                ctx.fillText("🎄", -8, 6);
              },
              () => {
                ctx.font = "20px 'Christmas Bell'";
                ctx.fillText("🎁", -8, 6);
              },
            ];
            shapes[Math.floor(Math.random() * shapes.length)]();
          }}
        />
      )}

      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 50, background: "rgba(0, 0, 0, 0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full border-4 border-[#FFD700]"
              style={{
                fontFamily: "'Christmas Bell', cursive",
                background: `linear-gradient(135deg, ${colors[3]} 0%, ${colors[4]} 100%)`,
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.7)",
              }}
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 10 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <h2 className="text-4xl font-bold text-[#1A3C34] mb-4 flex items-center gap-3 justify-center">
                <i className="fas fa-star text-[#FFD700]"></i> Christmas
                Champion!
              </h2>
              <div className="relative flex justify-center mb-6">
                <motion.img
                  src={winner.img}
                  alt={winner.name}
                  className="w-32 h-32 rounded-full border-4 border-[#A3080C]"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -top-4"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <img
                    src="https://www.pngarc.com/wp-content/uploads/2023/06/Red-Christmas-hat-background-png-image-1-min.png"
                    alt="Santa Hat"
                    className="w-20 h-20"
                    style={{ transform: "translateX(-25px)" }}
                  />
                </motion.div>
              </div>
              <p className="text-2xl text-[#A3080C] mb-6 text-center">
                Jingle All the Way!{" "}
                <span className="font-bold text-[#1A3C34]">{winner.name}</span>{" "}
                is the Holiday Hero!
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handleExclude}
                  className="bg-[#1A3C34] text-white font-bold py-3 px-6 rounded-lg flex items-center gap-3 hover:bg-[#0F2A22] transition"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Exclude winner from future spins"
                >
                  <i className="fas fa-ban"></i> Exclude
                </motion.button>
                <motion.button
                  onClick={handleClose}
                  className="bg-[#A3080C] text-white font-bold py-3 px-6 rounded-lg flex items-center gap-3 hover:bg-[#7A1626] transition"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close winner popup"
                >
                  <i className="fas fa-times"></i> Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl w-full">
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-[900px] w-full border-4 border-[#FFD700]"
          style={{ fontFamily: "'Christmas Bell', cursive", zIndex: 10 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-[#1A3C34] flex items-center gap-3 mb-4">
              <i className="fas fa-tree text-[#A3080C]"></i> Jingle Spin Wheel
            </h1>
            <p className="text-[#4B7043] text-xl mb-6 text-center max-w-md">
              Spin the wheel to light up the Christmas party! Who’s the next
              holiday star?
            </p>
            <div className="relative" style={{ zIndex: 10 }}>
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
                  className="w-4 h-10 bg-[#A3080C] rounded"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}
                />
                <div
                  className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#FFD700]"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}
                />
              </motion.div>

              <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 15 }}
              >
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
                      background: ["#FF0000", "#00FF00", "#FFFF00", "#FFD700"][
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
              className="bg-[#A3080C] text-white font-bold py-3 px-6 rounded-lg flex items-center gap-3 hover:bg-[#7A1626] transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{
                scale: availablePlayers.length > 0 ? 1.1 : 1,
                boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
              }}
              whileTap={{ scale: availablePlayers.length > 0 ? 0.9 : 1 }}
              disabled={availablePlayers.length === 0}
            >
              <i className="fas fa-gift"></i> Spin the Holiday Wheel!
            </motion.button>
          </div>
        </motion.div>

        <div
          className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border-4 border-[#FFD700] max-h-[600px] overflow-y-auto"
          style={{ fontFamily: "'Christmas Bell', cursive", zIndex: 10 }}
        >
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-4 flex items-center gap-3">
            <i className="fas fa-trophy text-[#FFD700]"></i> Holiday Hall of
            Fame
          </h2>
          {winners.length === 0 ? (
            <p className="text-[#4B7043] text-lg text-center">
              No stars yet! Spin to crown the first Christmas champion!
            </p>
          ) : (
            <ul className="space-y-4">
              {winners.map((winner, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 p-3 bg-[#F5F6F5]/30 rounded-lg"
                >
                  <img
                    src={winner.img}
                    alt={winner.name}
                    className="w-12 h-12 rounded-full border-2 border-[#A3080C]"
                  />
                  <span className="text-xl text-[#1A3C34] font-bold">
                    {winner.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinnerWheel;
