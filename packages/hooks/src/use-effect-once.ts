"use client";
import { useEffect, useRef } from "react";

export function useEffectOnce(callback: () => void | (() => void)): void {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
