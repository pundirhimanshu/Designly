"use client";

import React from "react";
import styles from "./BrandingBadge.module.css";
import { motion } from "framer-motion";

export default function BrandingBadge() {
  return (
    <motion.div 
      className={styles.badgeWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -6, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: { duration: 0.5 }
      }}
      onClick={() => window.location.href = "/"}
    >
      <span className={styles.text}>MADE WITH</span>
      <img src="https://designly.co.in/Designly.png" alt="Designly" className={styles.logo} />
    </motion.div>
  );
}
