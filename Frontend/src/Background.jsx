import { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min.js";
import * as THREE from "three";

export default function Background() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const effect = NET({
      el: vantaRef.current,
      THREE: THREE,
      color: 0x722F37,          // WINE COLOR 🍷🔥
      backgroundColor: 0x000000,
      points: 13.0,
      maxDistance: 22.0,
      spacing: 17.0
    });

    return () => effect?.destroy();
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1
      }}
    />
  );
}
