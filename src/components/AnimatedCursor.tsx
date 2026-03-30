"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import styles from "./AnimatedCursor.module.css";

interface AnimatedCursorProps {
  type: string;
}

export default function AnimatedCursor({ type }: AnimatedCursorProps) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible || !type || type === "default") return null;

  // Animated Cursor Types
  const isAnimated = ["glow", "fluid", "cyber", "trail"].includes(type);
  if (!isAnimated) return null;

  return (
    <div className={styles.cursorWrapper}>
      {/* Glow Cursor */}
      {type === "glow" && (
        <>
          <motion.div 
            className={styles.glowMain}
            style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
          />
          <motion.div 
            className={styles.glowOuter}
            style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
          />
        </>
      )}

      {/* Fluid Cursor */}
      {type === "fluid" && (
        <motion.div 
          className={styles.fluid}
          style={{ 
            x: trailX, 
            y: trailY, 
            translateX: "-50%", 
            translateY: "-50%",
          }}
        />
      )}

      {/* Cyber Cursor */}
      {type === "cyber" && (
        <motion.div 
          className={styles.cyber}
          style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
        >
          <div className={styles.cyberCross} />
          <motion.div 
            className={styles.cyberRing}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Trail Cursor */}
      {type === "trail" && (
        <div className={styles.trailContainer}>
           {[0, 1, 2, 3, 4].map((i) => (
             <TrailNode key={i} index={i} x={mouseX} y={mouseY} />
           ))}
        </div>
      )}
    </div>
  );
}

function TrailNode({ index, x, y }: { index: number; x: any; y: any }) {
  const nodeX = useSpring(x, { damping: 15 + index * 5, stiffness: 200 - index * 20 });
  const nodeY = useSpring(y, { damping: 15 + index * 5, stiffness: 200 - index * 20 });

  return (
    <motion.div 
      className={styles.trailNode}
      style={{ 
        x: nodeX, 
        y: nodeY, 
        translateX: "-50%", 
        translateY: "-50%",
        opacity: 1 - index * 0.2,
        scale: 1 - index * 0.1
      }}
    />
  );
}
