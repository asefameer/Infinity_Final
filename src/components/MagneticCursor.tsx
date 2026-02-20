import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorState = "default" | "hover" | "cta" | "hidden";

const MagneticCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [cursorLabel, setCursorLabel] = useState("");
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const followerX = useMotionValue(0);
  const followerY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(followerX, springConfig);
  const smoothY = useSpring(followerY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    followerX.set(e.clientX);
    followerY.set(e.clientY);

    const target = (e.target as HTMLElement).closest("[data-magnetic]") as HTMLElement | null;
    if (target) {
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pullX = (e.clientX - centerX) * 0.3;
      const pullY = (e.clientY - centerY) * 0.3;
      target.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }
  }, [cursorX, cursorY, followerX, followerY]);

  useEffect(() => {
    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const magnetic = el.closest("[data-magnetic]");
      const interactive = el.closest("a, button, [data-cursor='cta']");
      const hoverEl = el.closest("[data-cursor='hover']");

      if (magnetic || el.closest("[data-cursor='cta']")) {
        setCursorState("cta");
        setCursorLabel(el.closest("[data-cursor-label]")?.getAttribute("data-cursor-label") || "");
      } else if (interactive) {
        setCursorState("hover");
        setCursorLabel("");
      } else if (hoverEl) {
        setCursorState("hover");
        setCursorLabel("");
      } else {
        setCursorState("default");
        setCursorLabel("");
      }
    };

    const handleOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const magnetic = el.closest("[data-magnetic]") as HTMLElement | null;
      if (magnetic) {
        magnetic.style.transform = "translate(0, 0)";
      }
      setCursorState("default");
      setCursorLabel("");
    };

    const handleLeave = () => setCursorState("hidden");
    const handleEnter = () => setCursorState("default");

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [handleMouseMove]);

  // Hide native cursor
  useEffect(() => {
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => {
      document.body.style.cursor = "";
      style.remove();
    };
  }, []);

  const isHidden = cursorState === "hidden";
  const isCta = cursorState === "cta";
  const isHover = cursorState === "hover";

  // Sizes
  const outerSize = isCta ? 80 : isHover ? 56 : 40;

  return (
    <>
      {/* ── Center diamond — direct cursor ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isHidden ? 0 : 1,
          scale: isCta ? 1.4 : isHover ? 0.8 : 1,
          rotate: isCta ? 45 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Diamond shape */}
        <div
          className="w-2 h-2 rotate-45"
          style={{
            background: "hsl(var(--infinity-cyan))",
            boxShadow: "0 0 8px hsl(var(--infinity-cyan) / 0.6), 0 0 20px hsl(var(--infinity-cyan) / 0.2)",
          }}
        />
      </motion.div>

      {/* ── Crosshair lines — direct cursor ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isHidden ? 0 : isCta ? 0 : 0.4,
          scale: isHover ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Four short crosshair lines with gaps */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2"
            style={{
              width: "1px",
              height: "10px",
              background: `linear-gradient(to bottom, transparent, hsl(var(--foreground) / 0.7))`,
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-8px)`,
            }}
          />
        ))}
      </motion.div>

      {/* ── Outer rotating ring — eased follower ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: outerSize,
          height: outerSize,
          opacity: isHidden ? 0 : isCta ? 0.9 : isHover ? 0.6 : 0.35,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="overflow-visible"
        >
          {/* Dashed rotating arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="hsl(var(--infinity-cyan))"
            strokeWidth={isCta ? 1.5 : 0.8}
            strokeDasharray={isCta ? "8 6" : "4 12"}
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          />
          {/* Counter-rotating partial arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth={0.6}
            strokeDasharray="16 84"
            strokeLinecap="round"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          />
          {/* Corner accents — small L-shaped brackets at cardinal points */}
          {!isCta && [0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 50 50)`}>
              <line x1="50" y1="2" x2="50" y2="8" stroke="hsl(var(--foreground) / 0.25)" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* ── Glow aura on CTA ── */}
      <AnimatePresence>
        {isCta && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
              width: outerSize * 1.4,
              height: outerSize * 1.4,
              background: "radial-gradient(circle, hsl(var(--infinity-cyan) / 0.08) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Label for CTA state */}
      <AnimatePresence>
        {isCta && cursorLabel && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[10px] font-display font-bold tracking-[0.2em] text-foreground uppercase whitespace-nowrap">
              {cursorLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MagneticCursor;
