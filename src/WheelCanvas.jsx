import React, { useRef, useEffect, forwardRef } from "react";

const WheelCanvas = forwardRef(
  ({ segments, labels, wheelState, colors, announceWinner }, ref) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const images = useRef({}); // Cache for loaded images

    // Preload images
    useEffect(() => {
      labels.forEach((label) => {
        if (label.img && !images.current[label.img]) {
          const img = new Image();
          img.src = label.img;
          img.onload = () => {
            images.current[label.img] = img;
            draw();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${label.img}`);
          };
        }
      });
    }, [labels]);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const radius = Math.min(W, H) * 0.45;

      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // Draw wheel segments with festive patterns
      const segAngle = (Math.PI * 2) / segments;
      for (let i = 0; i < segments; i++) {
        const a0 = wheelState.current.angle + i * segAngle;
        const a1 = a0 + segAngle;

        // Segment background with alternating colors
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, a0, a1);
        ctx.closePath();
        ctx.fillStyle = colors[i % 2 === 0 ? 0 : 1];
        ctx.fill();

        // Segment border with festive glow
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FFD700";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Segment labels and images
        ctx.save();
        ctx.translate(cx, cy);
        const mid = a0 + segAngle / 2;
        ctx.rotate(mid);

        // Draw player image
        const imgSize = 50;
        if (labels[i]?.img && images.current[labels[i].img]) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(radius * 0.65, 0, imgSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            images.current[labels[i].img],
            radius * 0.65 - imgSize / 2,
            -imgSize / 2,
            imgSize,
            imgSize
          );
          ctx.restore();
        }

        // Draw player name with festive font
        ctx.fillStyle = colors[3];
        ctx.font = "700 20px 'Mountains of Christmas', cursive";
        ctx.textAlign = "center";
        ctx.fillText(labels[i]?.name || "", radius * 0.65, imgSize / 2 + 25);

        // Add festive icons (e.g., candy cane or ornament)
        ctx.font = "24px 'Christmas Bell'";
        ctx.fillText(i % 2 === 0 ? "🍬" : "🎄", radius * 0.85, 10);
        ctx.restore();
      }

      // Center circle with festive gradient
      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        radius * 0.3
      );
      gradient.addColorStop(0, colors[2]);
      gradient.addColorStop(1, "#C0C0C0");
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner circle with Christmas tree emoji
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fillStyle = colors[1];
      ctx.fill();
      ctx.font = "30px 'Christmas Bell'";
      ctx.fillStyle = colors[3];
      ctx.textAlign = "center";
      ctx.fillText("🎄", cx, cy + 10);

      // Outer ring with glowing lights effect
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.8)";
      ctx.lineWidth = 8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#FFD700";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Add decorative Christmas lights
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const x = cx + radius * 1.05 * Math.cos(angle);
        const y = cy + radius * 1.05 * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = ["#FF0000", "#00FF00", "#FFFF00", "#FFD700"][i % 4];
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = Math.min(800, Math.floor(window.innerWidth * 0.85));
      canvas.width = W;
      canvas.height = W;
      draw();
    };

    const getAngleForEvent = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      return Math.atan2(
        clientY - rect.top - canvas.height / 2,
        clientX - rect.left - canvas.width / 2
      );
    };

    const handlePointerDown = (ev) => {
      const canvas = canvasRef.current;
      canvas.setPointerCapture(ev.pointerId);
      wheelState.current.isDragging = true;
      wheelState.current.recent = [];
      wheelState.current.lastPointerAngle = getAngleForEvent(ev);
      const audio = new Audio(
        "https://www.myinstants.com/media/sounds/jingle-bells.mp3"
      );
      audio.play();
    };

    const handlePointerMove = (ev) => {
      if (!wheelState.current.isDragging) return;
      const a = getAngleForEvent(ev);
      let delta = a - wheelState.current.lastPointerAngle;
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;
      wheelState.current.angle += delta;
      wheelState.current.lastPointerAngle = a;
      wheelState.current.recent.push({ t: performance.now(), delta });
      if (wheelState.current.recent.length > 8)
        wheelState.current.recent.shift();
      draw();
    };

    const handlePointerUp = (ev) => {
      const canvas = canvasRef.current;
      canvas.releasePointerCapture(ev.pointerId);
      if (!wheelState.current.isDragging) return;
      wheelState.current.isDragging = false;
      if (wheelState.current.recent.length >= 1) {
        let total = 0;
        for (let i = 0; i < wheelState.current.recent.length; i++)
          total += wheelState.current.recent[i].delta;
        const avgDelta = total / Math.max(1, wheelState.current.recent.length);
        wheelState.current.angularVelocity = avgDelta / (16 / 1000);
        const max = 60;
        if (wheelState.current.angularVelocity > max)
          wheelState.current.angularVelocity = max;
        if (wheelState.current.angularVelocity < -max)
          wheelState.current.angularVelocity = -max;
      }
    };

    const update = () => {
      const now = performance.now();
      const dt = Math.min(40, now - wheelState.current.lastTime) / 1000;
      wheelState.current.lastTime = now;

      if (!wheelState.current.isDragging) {
        if (Math.abs(wheelState.current.angularVelocity) > 0.0005) {
          wheelState.current.stopped = false;
          const sign = wheelState.current.angularVelocity > 0 ? 1 : -1;
          const DECEL = 1.8;
          const SLOW_THRESHOLD = 4;
          const SLOW_DECEL = 0.3;
          const MIN_SLOW_DURATION = 2000;
          const WOBBLE_INTENSITY = 0.05;

          let currentDecel =
            Math.abs(wheelState.current.angularVelocity) > SLOW_THRESHOLD
              ? DECEL
              : SLOW_DECEL;

          if (
            Math.abs(wheelState.current.angularVelocity) <= SLOW_THRESHOLD &&
            wheelState.current.slowStartTime === null
          ) {
            wheelState.current.slowStartTime = now;
          }

          if (
            Math.abs(wheelState.current.angularVelocity) <= SLOW_THRESHOLD &&
            now - wheelState.current.slowStartTime < MIN_SLOW_DURATION
          ) {
            currentDecel =
              SLOW_DECEL *
              (1 -
                (now - wheelState.current.slowStartTime) / MIN_SLOW_DURATION);
          }

          wheelState.current.angularVelocity -= sign * currentDecel * dt;

          if (sign === 1 && wheelState.current.angularVelocity < 0)
            wheelState.current.angularVelocity = 0;
          if (sign === -1 && wheelState.current.angularVelocity > 0)
            wheelState.current.angularVelocity = 0;

          if (
            Math.abs(wheelState.current.angularVelocity) < SLOW_THRESHOLD &&
            Math.abs(wheelState.current.angularVelocity) > 0
          ) {
            wheelState.current.angularVelocity +=
              (Math.random() - 0.5) * WOBBLE_INTENSITY;
          }

          wheelState.current.angle += wheelState.current.angularVelocity * dt;
        } else {
          if (!wheelState.current.stopped) {
            wheelState.current.stopped = true;
            wheelState.current.angularVelocity = 0;
            wheelState.current.slowStartTime = null;
            announceWinner();
            const audio = new Audio(
              "https://www.myinstants.com/media/sounds/jingle-bells.mp3"
            );
            audio.play();
          }
        }
      }

      draw();
      animationFrameRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
      wheelState.current.lastTime = performance.now();
      window.addEventListener("resize", resize);
      canvasRef.current.addEventListener("dragstart", (e) =>
        e.preventDefault()
      );
      animationFrameRef.current = requestAnimationFrame(update);

      return () => {
        window.removeEventListener("resize", resize);
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      };
    }, [segments, labels]);

    return (
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
        className="rounded-full shadow-2xl"
        style={{
          background: `radial-gradient(circle, ${colors[3]} 0%, ${colors[1]} 70%, #000000 100%)`,
          border: "6px solid #FFD700",
          boxShadow: "0 0 30px rgba(255, 215, 0, 0.7)",
        }}
        aria-label="Christmas Party Spinner Wheel"
        role="img"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    );
  }
);

export default WheelCanvas;
