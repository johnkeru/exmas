import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import WheelCanvas from "./WheelCanvas";

const initialPlayers = [
  {
    name: "Baby JOSH",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t39.30808-1/554085623_31754215090859350_623684616158047593_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHZi57JFTCstRRCwvKg-4eIDcdP85gXY2YNx0_zmBdjZnahoMcOSnHKSkoAgaGQPRknTy3akernaKF3bCzRzTY2&_nc_ohc=viqf0rhST5QQ7kNvwEtM_gF&_nc_oc=AdlPJ1jgok5BiSVD2naOgAp23G3X8FGs2B12j0LQ9wwA4xeG2dXdA57vQsDKhYHAUcQ&_nc_zt=24&_nc_ht=scontent.fmnl10-1.fna&_nc_gid=1n5I-pr-hNyPoHB3QXqoLw&oh=00_Afavfs0F-xAU6xLqCKlgpBneliePHAHF73Yx07Rn2sYXvA&oe=68E12D40",
  },
  {
    name: "YUNELE",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.6435-1/74395481_3118341288181280_2341519258137133056_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHEuXSdHH8Ojt-oh9SWRUQfVnJYhoj_jspWcliGiP-Oyv07PXwJRWKt29uvlOZGo8ouZxfB5J_cZQv7GMQGViVd&_nc_ohc=Ba7WHMIKi1AQ7kNvwFXtgWw&_nc_oc=Adl54VHFgBAaWhK7jqFP_r6X0Jjba5fIk4K0lmxQwqY0u0MVfKk5jEp4yttI3NOEv54&_nc_zt=24&_nc_ht=scontent.fmnl10-1.fna&_nc_gid=LZ3nklWyu3Re_AQVLI1YUA&oh=00_AfZAbYLGk4P-4FGeim2Pxp3Vw0xjQ_4rxff-Pby713SyAg&oe=6902CBEC",
  },
  {
    name: "Onion EDRA 🧅",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.15752-9/553489168_683943051382442_2497790801776818444_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeENbhq0spVXr2eXhzFWviCa9NDymChrsYz00PKYKGuxjNmbIQhIeBHPuin0kqEJfpJv92To4jguwu-QhRNGkLMT&_nc_ohc=dyGctOqe_AEQ7kNvwE31xYB&_nc_oc=Adle3CILFME3mdmpXvaLkN0Y1k4eQIlZQq2DSsGM5hnIpbPLmpTBB2m11Uuoi9DvmvU&_nc_zt=23&_nc_ht=scontent.fmnl10-1.fna&oh=03_Q7cD3QGzpy-Hf04qBlJ6hV9SkfQXOw3KI6Lyqsny7EVULYiixw&oe=6902D5BD",
  },
  {
    name: "EDRA 😠",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.15752-9/552828593_1151072656898068_5039045652517267154_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEKVgViMQ4iihB7-DxTkH0HtSEEnvFjBvi1IQSe8WMG-OqUNZLXzOrIFPHIlc5pLnnjht0OF6ACBeFmIRVXxSvp&_nc_ohc=8a5iDEkxNj4Q7kNvwEGeCxe&_nc_oc=AdkBAR69dg2m61okes4wQVuywXlWVNxoEnAxtQ7JsvPug-LRz-CXu8nfxtG8SFmZdk0&_nc_zt=23&_nc_ht=scontent.fmnl10-1.fna&oh=03_Q7cD3QFzg4KiX9XMp0nXbFq1PSI1_bWqu9ssWMdpBQ5jDX7GEQ&oe=6902D90B",
  },
  {
    name: "EDRA TIGAS",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.15752-9/545716411_1483708335993934_3485407590343765649_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEJwfQojNAIku37FUR4fXZhnJeKvSOymVqcl4q9I7KZWhd4-xvYeK9Z2t30YOjSd-x8qxewV8MT8EgrM9dpHUQL&_nc_ohc=NiqM5u9NJFYQ7kNvwFCshQm&_nc_oc=AdmLYuvMIqmjjjrlxs8N3oVDQ1UEWEjqnma13eHkfVVVHmwmQ2e6cL273uc4c2yA8HU&_nc_zt=23&_nc_ht=scontent.fmnl10-1.fna&oh=03_Q7cD3QGynPYhN4smvoCGdi2-4Q84uDwVNj4sXinJfeBLf_nWmA&oe=6902CD67",
  },
  {
    name: "EDRA",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.15752-9/535852453_1486254975886884_7987964586178762070_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeG9D6bU9J9PeT-8nVxRdEephpKnMbIAUwuGkqcxsgBTCwRNxaTsG3p7yCGCGL2ymCZOs5MSR1QygWdcI8zMz4zM&_nc_ohc=kM5XQ3lOgCAQ7kNvwGGtxNH&_nc_oc=AdlmAls7uSzV8S2risd60VelWssasFeNYBzqvzA0Vq-21jlwJzTMwi08shxFgOimbXE&_nc_zt=23&_nc_ht=scontent.fmnl10-1.fna&oh=03_Q7cD3QEnLNXGsMaMCseUW1AMDOZHDH1cOjnVuPWcfd9hKk2gTg&oe=6902C9FD",
  },
  {
    name: "MEOWNG",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.15752-9/528974807_1225300592682513_7789263775756234938_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFSgn_1Of4rK5vL2eC4zYP-eWnc-qitb5Z5adz6qK1vlgoCS765XGaDanSKbRL5-GhtE9pt54j4FDUYw-JcxmD5&_nc_ohc=VVWgpViiv6UQ7kNvwGaVzEq&_nc_oc=Adk9mvtWAdeSnDneOPZfzL3JsMo_TYxNR4SDCwnQQFjcsfPG8oHsOkpgt_5udap-Zww&_nc_zt=23&_nc_ht=scontent.fmnl10-1.fna&oh=03_Q7cD3QFWYEaygA3fnMBSAIjXKW4JQlgNW0JVbJgb2NnPjMflmQ&oe=6902F525",
  },
  {
    name: "MEETING",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t1.15752-9/551342917_1322303979622967_2664223213913926710_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEYhaxGf0kR6ce30fGWespJffcLsKeheSJ99wuwp6F5IgzP6vzAUGNLLoqNmLTmrwZo6OGy6iAX9g2efuXIAPcR&_nc_ohc=wY7VGHzOC6sQ7kNvwGcMIds&_nc_oc=AdkuPDOa57sw4zaSKJPxABm_C1QEcFxxrSSAQWa7Tc_O6_AAgE_n6wGqCw5f7PegQI4&_nc_zt=23&_nc_ht=scontent.fmnl10-1.fna&oh=03_Q7cD3QHxyX73siLbgFfZVyNDvCcpDB-dQVwBgFyTSRpx7xElfg&oe=6902D8C7",
  },
];

const SpinnerWheel = () => {
  const [segments, setSegments] = useState(8);
  const [availablePlayers, setAvailablePlayers] = useState(initialPlayers);
  const [winners, setWinners] = useState([]);
  const [labels, setLabels] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wheelStopped, setWheelStopped] = useState(true);
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
      "https://www.myinstants.com/media/sounds/jingle-bells.mp3"
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

  useEffect(() => {
    const checkStopped = () => {
      setWheelStopped(wheelState.current.stopped);
    };
    const interval = setInterval(checkStopped, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, #1A3C34, #0F2A22)`,
      }}
    >
      {/* Sidebar for winners, shown only when there is at least one winner */}
      <AnimatePresence>
        {winners.length > 0 && (
          <motion.div
            className="w-64 p-4 bg-[#FEF9E6] rounded-xl mr-4 flex flex-col relative"
            style={{
              fontFamily: "'Christmas Bell', cursive",
              zIndex: 10,
              background: `linear-gradient(145deg, #FEF9E6 0%, #FFF0BA 100%)`,
              border: "4px double #A3080C",
              boxShadow: "0 4px 16px rgba(163, 8, 12, 0.3)",
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <style>
              {`
                @keyframes sparkle {
                  0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                  50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
                  100% { transform: scale(1) rotate(360deg); opacity: 0.6; }
                }
              `}
            </style>
            <div className="winners-gallery">
              <h2 className="text-2xl font-bold text-[#A3080C] mb-4 flex items-center gap-2">
                <i className="fas fa-crown text-[#FFD700]"></i> Winners' Gallery
              </h2>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {winners.map((player, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-[#F5F6F5] rounded-lg border-2 border-[#FFD700] shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <img
                      src={player.img}
                      alt={player.name}
                      className="w-10 h-10 rounded-full border-2 border-[#A3080C]"
                    />
                    <span className="text-[#1A3C34] font-semibold">
                      {player.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area with centered wheel */}
      <div className="flex-1 flex items-center justify-center">
        {/* Falling snow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white text-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
              }}
              animate={{
                y: window.innerHeight + 10,
                opacity: [0, 0.8, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                delay: Math.random() * 1.5,
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
                  ctx.lineTo(0, 12);
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
              style={{ zIndex: 50, background: "rgba(0, 0, 0, 0.75)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-12 shadow-2xl  w-[50vw]"
                style={{
                  fontFamily: "'Mountains of Christmas', cursive",
                  background: `linear-gradient(145deg, #FEF9E6 0%, #FFF0BA 100%)`,
                  boxShadow: "0 8px 32px rgba(163, 8, 12, 0.3)",
                  border: "6px double #A3080C",
                  position: "relative",
                  overflow: "hidden",
                }}
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <style>
                  {`
                .popup-decor::before {
                  content: '✨';
                  position: absolute;
                  top: 10px;
                  left: 20px;
                  font-size: 2rem;
                  animation: sparkle 2s infinite;
                }
                .popup-decor::after {
                  content: '❄️';
                  position: absolute;
                  bottom: 10px;
                  right: 20px;
                  font-size: 2rem;
                  animation: sparkle 2s infinite;
                }
                @keyframes sparkle {
                  0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                  50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
                  100% { transform: scale(1) rotate(360deg); opacity: 0.6; }
                }
              `}
                </style>
                <div className="popup-decor">
                  <h2 className="text-5xl font-bold text-[#A3080C] mb-8 flex items-center gap-4 justify-center">
                    <i className="fas fa-crown text-[#FFD700]"></i> Christmas
                    Champion! 🎉
                  </h2>
                  <div className="relative flex justify-center mb-10">
                    <motion.img
                      src={winner.img}
                      alt={winner.name}
                      className="w-[600px] h-[600px] rounded-full border-6 border-[#FFD700] shadow-lg"
                      animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 15px rgba(255, 215, 0, 0.4)",
                          "0 0 25px rgba(255, 215, 0, 0.7)",
                          "0 0 15px rgba(255, 215, 0, 0.4)",
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -top-12"
                      animate={{ rotate: [-10, 10, -10], y: [0, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <img
                        src="https://www.pngarc.com/wp-content/uploads/2023/06/Red-Christmas-hat-background-png-image-1-min.png"
                        alt="Santa Hat"
                        className="w-32 h-32"
                        style={{ transform: "translateX(-40px)" }}
                      />
                    </motion.div>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-4 h-4 rounded-full bg-[#A3080C]"
                        style={{
                          left: `${Math.random() * 80 + 10}%`,
                          top: `${Math.random() * 80 + 10}%`,
                        }}
                        animate={{
                          scale: [0, 1.8, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: Math.random() * 0.7,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-4xl text-[#1A3C34] mb-10 text-center">
                    🎅 Ho Ho Ho!{" "}
                    <span className="font-bold text-[#A3080C]">
                      {winner.name}
                    </span>{" "}
                    lights up Christmas! 🎄
                  </p>
                  <div className="flex justify-center gap-6">
                    <motion.button
                      onClick={handleExclude}
                      className="bg-[#A3080C] text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 hover:bg-[#7A1626] transition shadow-md"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Exclude winner from future spins"
                    >
                      <i className="fas fa-ban"></i> Exclude
                    </motion.button>
                    <motion.button
                      onClick={handleClose}
                      className="bg-[#1A3C34] text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 hover:bg-[#0F2A22] transition shadow-md"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close winner popup"
                    >
                      <i className="fas fa-times"></i> Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{ fontFamily: "'Christmas Bell', cursive", zIndex: 10 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-lime-500 flex items-center gap-3 mb-4">
              Jungle-in moko
            </h1>
            <p className="text-[#4B7043] text-xl mb-6 text-center max-w-md">
              WEFSEFEWSFAWEFAW EFAWEFAWESDAWDAS
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
                animate={
                  wheelStopped
                    ? { rotate: 0, scale: 1 }
                    : { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }
                }
                transition={
                  wheelStopped
                    ? { duration: 0.5, ease: "easeOut" }
                    : { repeat: Infinity, duration: 1.2 }
                }
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SpinnerWheel;
