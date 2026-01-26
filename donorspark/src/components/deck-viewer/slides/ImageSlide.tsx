'use client';

import { motion } from 'framer-motion';
import type { ImageSlide as ImageSlideType } from '@/types/slide';
import { containerVariants, itemVariants } from './animations';
import { Headline } from './shared';

interface ImageSlideProps {
  slide: ImageSlideType;
}

export function ImageSlide({ slide }: ImageSlideProps) {
  const { content } = slide;
  const overlayPosition = content.overlayPosition || 'center';
  const overlayAlignment = content.overlayAlignment || 'center';

  const positionClasses = {
    top: 'items-start pt-20',
    center: 'items-center',
    bottom: 'items-end pb-20',
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${content.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Overlay */}
      <motion.div
        className={`relative z-10 flex flex-col justify-center ${positionClasses[overlayPosition]} w-full h-full px-16`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={`max-w-[800px] ${alignmentClasses[overlayAlignment]} ${overlayAlignment === 'center' ? 'mx-auto' : overlayAlignment === 'right' ? 'ml-auto' : ''}`}>
          {/* Headline */}
          {content.headline && (
            <motion.h2
              className="text-5xl leading-[0.95] mb-6 font-display font-extrabold uppercase tracking-tight text-white"
              variants={itemVariants}
            >
              <Headline text={content.headline} highlightedText={content.highlightedText} />
            </motion.h2>
          )}

          {/* Quote */}
          {content.quote && (
            <motion.blockquote
              className="text-2xl leading-relaxed font-serif italic text-white/90 mb-6"
              variants={itemVariants}
            >
              &ldquo;{content.quote}&rdquo;
            </motion.blockquote>
          )}

          {/* Attribution */}
          {content.attribution && (
            <motion.p
              className="text-base text-white/70 font-medium"
              variants={itemVariants}
            >
              — {content.attribution}
            </motion.p>
          )}

          {/* Stats */}
          {content.stats && content.stats.length > 0 && (
            <motion.div
              className="flex gap-8 mt-8"
              variants={itemVariants}
            >
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-extrabold text-white">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
