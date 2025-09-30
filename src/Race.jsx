import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const initialPlayers = [
  {
    name: "Baby JOSH",
    img: "https://scontent.fmnl10-1.fna.fbcdn.net/v/t39.30808-1/554085623_31754215090859350_623684616158047593_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHZi57JFTCstRRCwvKg-4eIDcdP85gXY2YNx0_zmBdjZnahoMcOSnHKSkoAgaGQPRknTy3akernaKF3bCzRzTY2&_nc_ohc=viqf0rhST5QQ7kNvwEtM_gF&_nc_oc=AdlPJ1jgok5BiSVD2naOgAp23G3X8FGs2B12j0LQ9wwA4xeG2dXdA57vQsDKhYHAUcQ&_nc_zt=24&_nc_ht=scontent.fmnl10-1.fna&_nc_gid=1n5I-pr-hNyPoHB3QXqoLw&oh=00_Afavfs0F-xAU6xLqCKlgpBneliePHAHF73Yx07Rn2sYXvA&oe=68E12D40",
  },
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

export default function RacingGame() {
  const [positions, setPositions] = useState(initialPlayers.map(() => 0));
  const [winner, setWinner] = useState(null);
  const [isRacing, setIsRacing] = useState(false);

  useEffect(() => {
    let interval;
    if (isRacing && !winner) {
      interval = setInterval(() => {
        setPositions((prev) => {
          const updated = prev.map((pos) => pos + Math.random() * 4);

          updated.forEach((pos, i) => {
            if (pos >= 90 && !winner) {
              setWinner(initialPlayers[i]);
              setIsRacing(false);
            }
          });

          return updated;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isRacing, winner]);

  const startRace = () => {
    setPositions(initialPlayers.map(() => 0));
    setWinner(null);
    setIsRacing(true);
  };

  return (
    <div className="p-6 bg-green-900 min-h-screen flex flex-col items-center text-white">
      <h1 className="text-2xl font-bold mb-6">🏁 Racing Game</h1>

      <div className="relative w-full max-w-4xl">
        {/* Finish Line */}
        <div className="absolute top-0 right-0 h-full w-4 bg-white bg-[repeating-linear-gradient(0deg,white,white_10px,black_10px,black_20px)]"></div>

        {initialPlayers.map((player, index) => (
          <div key={player.name} className="mb-8">
            <div className="relative h-16 bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-500">
              {/* Track background */}
              <img
                src="https://i.imgur.com/d6b9p1u.png"
                alt="track"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />

              {/* Racer */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-2"
                animate={{ x: `${positions[index]}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              >
                <img
                  src={player.img}
                  alt={player.name}
                  className="w-10 h-10 rounded-full border-2 border-yellow-400"
                />
                <span className="text-sm font-semibold">{player.name}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={startRace}
        disabled={isRacing}
        className="px-6 py-2 mt-4 bg-yellow-400 text-black font-bold rounded-xl disabled:opacity-50"
      >
        {isRacing ? "Racing..." : "Start Race"}
      </button>

      {winner && (
        <div className="mt-6 p-4 bg-white text-black rounded-2xl shadow-lg">
          🎉 Winner: <span className="font-bold">{winner.name}</span>
        </div>
      )}
    </div>
  );
}
