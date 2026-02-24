import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; alpha: number }[];
}

const AMBIENT_COUNT = 45;
const MAX_SHOOTING = 2;

const GlobalSparkles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const animRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0, h = 0;

    const resize = () => {
      // Use half-resolution for performance
      const dpr = Math.min(window.devicePixelRatio, 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize ambient stars
    if (starsRef.current.length === 0) {
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        starsRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.08,
          size: Math.random() * 1.8 + 0.5,
          hue: Math.random() * 360,
          alpha: Math.random() * 0.5 + 0.15,
          twinkleSpeed: Math.random() * 2 + 1,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // Cap at 30fps

    const draw = (now: number) => {
      animRef.current = requestAnimationFrame(draw);

      // Throttle to 30fps
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      timeRef.current += 0.032; // ~30fps timestep
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      // ── Ambient sparkles — NO shadowBlur for performance ──
      for (const s of starsRef.current) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;

        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
        const alpha = s.alpha * twinkle;
        if (alpha < 0.03) continue;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${s.hue}, 80%, 75%)`;

        // Main dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow via larger, semi-transparent circle (replaces shadowBlur)
        ctx.globalAlpha = alpha * 0.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Cross rays
        ctx.globalAlpha = alpha * 0.6;
        const rayLen = s.size * 2 * twinkle;
        ctx.strokeStyle = `hsl(${s.hue}, 80%, 75%)`;
        ctx.lineWidth = s.size * 0.2;
        ctx.beginPath();
        ctx.moveTo(s.x - rayLen, s.y);
        ctx.lineTo(s.x + rayLen, s.y);
        ctx.moveTo(s.x, s.y - rayLen);
        ctx.lineTo(s.x, s.y + rayLen);
        ctx.stroke();
      }

      // ── Shooting stars — simplified, no shadowBlur ──
      if (shootingRef.current.length < MAX_SHOOTING && Math.random() < 0.002) {
        const startX = Math.random() * w;
        const startY = Math.random() * h * 0.3;
        const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
        const speed = Math.random() * 4 + 3;
        shootingRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1.5,
          hue: Math.random() * 360,
          life: 1,
          maxLife: 1,
          trail: [],
        });
      }

      shootingRef.current = shootingRef.current.filter((ss) => {
        ss.life -= 0.01;
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.vy += 0.03;

        ss.trail.push({ x: ss.x, y: ss.y, alpha: ss.life });
        if (ss.trail.length > 15) ss.trail.shift();

        for (let i = 0; i < ss.trail.length; i++) {
          const tp = ss.trail[i];
          const progress = i / ss.trail.length;
          ctx.globalAlpha = tp.alpha * progress * 0.5;
          ctx.fillStyle = `hsl(${ss.hue}, 85%, 75%)`;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, ss.size * progress, 0, Math.PI * 2);
          ctx.fill();
        }

        // Head glow via larger circle
        ctx.globalAlpha = ss.life;
        ctx.fillStyle = `hsl(${ss.hue}, 90%, 85%)`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = ss.life * 0.3;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 3, 0, Math.PI * 2);
        ctx.fill();

        return ss.life > 0 && ss.y < h + 50;
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default GlobalSparkles;
