'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FunnelSlide as FunnelSlideType } from '@/types/slide';
import { containerVariants, itemVariants } from './animations';
import { Headline } from './shared';

interface FunnelSlideProps {
  slide: FunnelSlideType;
}

export function FunnelSlide({ slide }: FunnelSlideProps) {
  const { content } = slide;
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const widths = ['85%', '70%', '55%'];

  return (
    <motion.div
      className="max-w-[900px] w-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Headline */}
      <motion.h2
        className="text-5xl leading-[0.95] mb-4 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)]"
        variants={itemVariants}
      >
        <Headline text={content.headline} highlightedText={content.highlightedText} />
      </motion.h2>

      {/* Description */}
      {content.description && (
        <motion.p
          className="text-xl opacity-80 mb-8"
          variants={itemVariants}
        >
          {content.description}
        </motion.p>
      )}

      {/* Funnel Visualization */}
      <motion.div
        className="funnel-visual relative my-8"
        variants={itemVariants}
      >
        <div className="funnel-wrapper flex items-stretch gap-8">
          {/* Funnel Stages */}
          <div className="funnel-stages flex-1 space-y-5">
            {content.stages.map((stage, index) => (
              <motion.div
                key={index}
                className="funnel-stage relative py-7 px-6 text-center text-white font-bold text-xl rounded-xl mx-auto cursor-pointer transition-all"
                style={{
                  width: widths[index],
                  background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}dd 100%)`,
                  clipPath: index === 0
                    ? 'polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%)'
                    : 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)',
                }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPackage(selectedPackage === index + 1 ? null : index + 1)}
              >
                <div>{stage.name}</div>
                <div className="funnel-label text-sm opacity-95 mt-2 font-medium leading-snug px-2">
                  {stage.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Package Brackets */}
          {content.packages && (
            <div className="package-brackets relative w-40 flex flex-col justify-start">
              <AnimatePresence>
                {selectedPackage && (
                  <motion.div
                    key={selectedPackage}
                    className="package-bracket absolute right-0 flex items-center"
                    style={{
                      top: 0,
                      height: selectedPackage === 1 ? '85px' : selectedPackage === 2 ? '195px' : '305px',
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="bracket-line w-8 border-2 border-[var(--color-accent)] border-l-0 rounded-r-xl"
                      style={{ height: '100%' }}
                    />
                    <span className="bracket-label bg-[var(--color-accent)] text-white py-2 px-4 rounded-lg font-bold text-sm whitespace-nowrap ml-3">
                      {content.packages[selectedPackage - 1]?.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        className="text-lg mt-8 opacity-80"
        variants={itemVariants}
      >
        Start where you need it most—or build the complete donor experience.
      </motion.p>
      <motion.p
        className="text-sm mt-4 opacity-50"
        variants={itemVariants}
      >
        Click funnel stages to see how packages map to each level →
      </motion.p>
    </motion.div>
  );
}
