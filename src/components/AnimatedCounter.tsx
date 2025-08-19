"use client";

import { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const startValue = valueRef.current;
    const endValue = value;
    
    // If the value hasn't changed, do nothing.
    if (startValue === endValue) {
        setDisplayValue(endValue);
        return;
    }

    const duration = 500;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const newDisplayValue = Math.floor(startValue + (endValue - startValue) * progress);
      setDisplayValue(newDisplayValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        valueRef.current = endValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      valueRef.current = value;
    };
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export default AnimatedCounter;
