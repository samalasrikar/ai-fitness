import { useState, useEffect } from 'react';

export function useCountUp(target, duration = 1200, decimals = 0, trigger = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp = null;
    let animId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * target;
      setValue(current);
      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      }
    };
    animId = window.requestAnimationFrame(step);

    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [target, duration, trigger]);

  if (decimals === 0) {
    return Math.floor(value).toLocaleString();
  }
  return value.toFixed(decimals);
}
