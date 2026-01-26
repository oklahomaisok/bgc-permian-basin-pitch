'use client';

import { motion } from 'framer-motion';
import type { RoadmapSlide as RoadmapSlideType } from '@/types/slide';
import { containerVariants, itemVariants, cardVariants } from './animations';
import { Headline } from './shared';

interface RoadmapSlideProps {
  slide: RoadmapSlideType;
}

export function RoadmapSlide({ slide }: RoadmapSlideProps) {
  const { content } = slide;

  return (
    <>
      {/* Headline */}
      <motion.h2
        className="text-5xl leading-[0.95] mb-8 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)] text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Headline text={content.headline} highlightedText={content.highlightedText} />
      </motion.h2>

      {/* Roadmap Phases */}
      <motion.div
        className="roadmap flex flex-col lg:flex-row gap-6 max-w-[1200px] w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {content.phases.map((phase, index) => (
          <motion.div
            key={index}
            className="roadmap-phase flex-1 bg-white rounded-3xl p-8 shadow-lg border border-black/5 relative overflow-hidden"
            variants={cardVariants}
          >
            {/* Top color bar */}
            <div
              className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
              style={{ backgroundColor: phase.color || 'var(--color-accent)' }}
            />

            {/* Phase Label */}
            <div className="phase-label text-xs uppercase tracking-wider opacity-60 mb-2">
              {phase.label}
            </div>

            {/* Phase Title */}
            <h3 className="text-xl font-bold mb-4 uppercase">{phase.title}</h3>

            {/* Phase Items */}
            <ul className="list-none m-0 p-0 space-y-2">
              {phase.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-sm leading-relaxed pl-6 relative"
                >
                  <span
                    className="absolute left-0 font-bold"
                    style={{ color: phase.color || 'var(--color-accent)' }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Footnote */}
      {content.footnote && (
        <motion.p
          className="text-center mt-8 font-serif italic opacity-80 text-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {content.footnote}
        </motion.p>
      )}
    </>
  );
}
