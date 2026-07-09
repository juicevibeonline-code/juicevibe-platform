"use client";
import { useState, useEffect } from "react";

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
}

export function useScrollPosition(threshold = 50): ScrollPosition {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, isScrolled: scrollY > threshold };
}
