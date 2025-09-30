import React, { useRef, useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import Confetti from "react-confetti";
import {
  FaTree,
  FaArrowDown,
  FaGift,
  FaSnowflake,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ColorWheel = () => {
  const canvasRef = useRef(null);
  const [winner, setWinner] = useState(null);
  const [winnerData, setWinnerData] = useState(null);

  const players = [
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

  const congratsMessages = [
    "Bow down to {name}, the ULTIMATE SPIN LEGEND! 🏆",
    "{name} just CRUSHED the holiday spin game! 🎉",
    "All hail {name}, the SPIN-TASTIC HOLIDAY HERO! 🌟",
    "{name}’s spin is the stuff of Christmas LEGENDS! 🎅",
    "Move over, Santa! {name}’s the new holiday STAR! ❄️",
  ];

  const congratsSubtexts = [
    "The North Pole is throwing a parade for you!",
    "Your spin’s got the elves working overtime!",
    "Rudolph’s blushing at your epic victory!",
    "You’ve earned a spot on the nice list FOREVER!",
    "The whole workshop’s buzzing about your win!",
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
        🎄 HOLY FUCKING Wheel 🎅
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
            key="memorial-popup"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
          >
            <motion.div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-12 flex flex-col items-center gap-6 shadow-[0_0_30px_rgba(255,255,255,0.3)] border-4 border-gray-300">
              <img
                src={winnerData.img}
                alt={winnerData.name}
                className="w-[510px] h-[510px] rounded-full border-4 border-gray-500 shadow-xl object-cover"
              />

              <h2 className="text-4xl font-bold text-white font-serif drop-shadow-md">
                In Loving Memory of {winnerData.name}
              </h2>

              <p className="text-lg text-gray-200 italic font-serif text-center">
                {winnerData.message || "Forever in our hearts"}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setWinner(null)}
                className="mt-6 bg-gray-800 text-white px-8 py-3 rounded-lg shadow-md font-semibold text-lg"
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
