'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function WaveformHero() {
  const bars = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < 40; i++) {
      result.push(0.2 + (Math.sin(i * 0.5) * 0.5 + 0.5) * 0.8);
    }
    return result;
  }, []);

  return (
    <div className="flex items-end justify-center gap-[3px] h-16 opacity-40">
      {bars.map((height: number, i: number) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          initial={{ scaleY: 0.3 }}
          animate={{
            scaleY: [0.3, height, 0.3],
          }}
          transition={{
            duration: 1.2 + (i % 5) * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
          style={{
            height: '100%',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}
