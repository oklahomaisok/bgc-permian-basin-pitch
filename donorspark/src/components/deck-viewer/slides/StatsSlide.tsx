'use client';

import { motion } from 'framer-motion';
import type { StatsSlide as StatsSlideType } from '@/types/slide';
import { containerVariants, itemVariants } from './animations';
import { Headline } from './shared';
import { AnimatedStat } from './AnimatedStat';

interface StatsSlideProps {
  slide: StatsSlideType;
}

export function StatsSlide({ slide }: StatsSlideProps) {
  const { content } = slide;
  const layout = content.layout || 'grid';

  const layoutClasses = {
    grid: 'grid grid-cols-2 gap-6',
    row: 'flex flex-wrap justify-center gap-8',
    column: 'flex flex-col gap-6',
  };

  return (
    <motion.div
      className="max-w-[1000px] w-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Headline */}
      <motion.h2
        className="text-5xl leading-[0.95] mb-8 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)]"
        variants={itemVariants}
      >
        <Headline text={content.headline} highlightedText={content.highlightedText} />
      </motion.h2>

      {/* Stats */}
      <motion.div
        className={layoutClasses[layout]}
        variants={itemVariants}
      >
        {content.stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-box text-center p-8 bg-white rounded-3xl border border-black/5"
            variants={itemVariants}
          >
            <AnimatedStat
              value={stat.value}
              suffix={stat.suffix}
              animate={stat.animate}
            />
            <div className="stat-label text-base opacity-80 leading-snug">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Description */}
      {content.description && (
        <motion.p
          className="text-xl opacity-80 mt-8 leading-relaxed"
          variants={itemVariants}
        >
          {content.description}
        </motion.p>
      )}
    </motion.div>
  );
}
