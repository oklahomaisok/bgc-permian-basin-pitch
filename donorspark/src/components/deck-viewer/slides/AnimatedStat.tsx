'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedStatProps {
  value: number | string;
  suffix?: string;
  animate?: boolean;
  duration?: number;
}

export function AnimatedStat({ value, suffix = '', animate = true, duration = 2000 }: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(animate && typeof value === 'number' ? 0 : value);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!animate || typeof value !== 'number' || !isInView) {
      setDisplayValue(value);
      return;
    }

    const target = value;
    const startTime = performance.now();

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * easeOutQuart);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, animate, duration, isInView]);

  const formattedValue = typeof displayValue === 'number'
    ? displayValue.toLocaleString()
    : displayValue;

  return (
    <motion.div
      ref={ref}
      className="stat-number text-6xl text-[var(--color-accent)] font-extrabold leading-none mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {formattedValue}{suffix}
    </motion.div>
  );
}
