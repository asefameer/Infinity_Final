import { useEffect, useRef, useState } from "react";

const TILE_SIZE = 128;

/**
 * GrainOverlay — generates a small noise tile once, converts to a CSS
 * background-image, and uses a CSS animation to shift the position.
 * This eliminates per-frame JS entirely.
 */
const GrainOverlay = () => {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate tile once on mount
    const offscreen = document.createElement("canvas");
    offscreen.width = TILE_SIZE;
    offscreen.height = TILE_SIZE;
    const ctx = offscreen.getContext("2d")!;
    const tile = ctx.createImageData(TILE_SIZE, TILE_SIZE);
    const data = tile.data;
    const intensity = Math.round(0.018 * 255);
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = intensity;
    }
    ctx.putImageData(tile, 0, 0);
    setBgUrl(offscreen.toDataURL("image/png"));
  }, []);

  if (!bgUrl) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9990]"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        mixBlendMode: "overlay",
        animation: "grain-shift 0.3s steps(4) infinite",
      }}
    />
  );
};

export default GrainOverlay;
