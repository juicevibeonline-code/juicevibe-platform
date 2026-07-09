"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-light-bg"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30"
          >
            <Leaf className="h-10 w-10 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <h2 className="font-heading text-2xl font-extrabold text-dark-green">
              Juice <span className="text-primary">Vibe</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">Sip the Good Vibes</p>
          </motion.div>

          <div className="mt-8 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2.5 w-2.5 rounded-full bg-primary"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
