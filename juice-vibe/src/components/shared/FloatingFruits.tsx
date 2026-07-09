"use client";

import { motion } from "framer-motion";
import { Apple, Citrus, Cherry } from "lucide-react";

const fruits = [
  { Icon: Apple, color: "#22C55E", size: 32, x: "10%", y: "20%", delay: 0, duration: 6 },
  { Icon: Citrus, color: "#FB923C", size: 28, x: "85%", y: "30%", delay: 1, duration: 7 },
  { Icon: Cherry, color: "#F43F5E", size: 24, x: "20%", y: "70%", delay: 2, duration: 5 },
  { Icon: Apple, color: "#FBBF24", size: 26, x: "75%", y: "75%", delay: 0.5, duration: 8 },
  { Icon: Citrus, color: "#22C55E", size: 22, x: "50%", y: "15%", delay: 1.5, duration: 6.5 },
];

export function FloatingFruits() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {fruits.map((fruit, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: fruit.x, top: fruit.y }}
          animate={{
            y: [0, -30, 0, 20, 0],
            rotate: [0, 10, -10, 5, 0],
          }}
          transition={{
            duration: fruit.duration,
            delay: fruit.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <fruit.Icon size={fruit.size} color={fruit.color} opacity={0.3} />
        </motion.div>
      ))}
    </div>
  );
}
