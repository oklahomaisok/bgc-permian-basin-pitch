'use client';

import { motion } from 'framer-motion';
import type { TextSlide as TextSlideType } from '@/types/slide';
import { containerVariants, itemVariants } from './animations';
import { Headline } from './shared';

interface TextSlideProps {
  slide: TextSlideType;
}

export function TextSlide({ slide }: TextSlideProps) {
  const { content } = slide;
  const alignment = content.alignment || 'center';

  return (
    <>
      {/* Background Image */}
      {content.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${content.backgroundImage})`,
            filter: content.backgroundOverlay === 'light' ? 'grayscale(100%)' : 'none',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: content.backgroundOverlay === 'dark'
                ? 'rgba(0,0,0,0.5)'
                : content.backgroundOverlay === 'light'
                ? 'rgba(255,255,255,0.3)'
                : 'transparent'
            }}
          />
        </div>
      )}

      {/* Content */}
      <motion.div
        className={`relative z-10 max-w-[900px] w-full ${
          alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        {content.headline && (
          <motion.h2
            className="text-5xl leading-[0.95] mb-6 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)]"
            variants={itemVariants}
          >
            <Headline text={content.headline} highlightedText={content.highlightedText} />
          </motion.h2>
        )}

        {/* Quote */}
        {content.quote && (
          <motion.blockquote
            className="text-2xl leading-relaxed font-serif italic text-[var(--color-accent)] mb-8"
            variants={itemVariants}
          >
            &ldquo;{content.quote}&rdquo;
          </motion.blockquote>
        )}

        {/* Body */}
        {content.body && (
          <motion.p
            className="text-xl leading-relaxed opacity-80"
            variants={itemVariants}
          >
            {content.body}
          </motion.p>
        )}

        {/* Attribution */}
        {content.attribution && (
          <motion.p
            className="text-base mt-6 opacity-60 font-medium"
            variants={itemVariants}
          >
            — {content.attribution}
          </motion.p>
        )}
      </motion.div>
    </>
  );
}
