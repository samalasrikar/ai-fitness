import { useState, useEffect, useRef } from 'react';

export function useRestTimer(isOpen, defaultSeconds = 60, onTimerComplete) {
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [initialSeconds, setInitialSeconds] = useState(defaultSeconds);
  
  const onTimerCompleteRef = useRef(onTimerComplete);

  useEffect(() => {
    onTimerCompleteRef.current = onTimerComplete;
  }, [onTimerComplete]);

  // Reset timer when modal transitions to open state
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(defaultSeconds);
      setInitialSeconds(defaultSeconds);
    }
  }, [isOpen]);

  // Active countdown interval
  useEffect(() => {
    if (!isOpen) return;

    if (secondsLeft <= 0) {
      if (onTimerCompleteRef.current) {
        onTimerCompleteRef.current();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, secondsLeft]);

  const add30Seconds = () => {
    setSecondsLeft((prev) => prev + 30);
    setInitialSeconds((prev) => prev + 30);
  };

  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 100;

  return {
    secondsLeft,
    initialSeconds,
    progressPercent,
    add30Seconds,
  };
}
