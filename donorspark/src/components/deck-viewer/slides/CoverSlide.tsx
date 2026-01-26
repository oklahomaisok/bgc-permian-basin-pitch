'use client';

import { motion } from 'framer-motion';
import type { CoverSlide as CoverSlideType } from '@/types/slide';
import { containerVariants, itemVariants } from './animations';
import { Headline, AmbientGlow, AuraBackground } from './shared';

interface CoverSlideProps {
  slide: CoverSlideType;
}

export function CoverSlide({ slide }: CoverSlideProps) {
  const { content } = slide;

  return (
    <>
      {/* Background Effects */}
      {content.showAuraBackground && <AuraBackground />}
      {content.showAmbientGlow && <AmbientGlow />}

      {/* Background Image */}
      {content.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-[1000px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        {content.logoUrl && (
          <motion.img
            src={content.logoUrl}
            alt="Organization Logo"
            className="max-w-[280px] mx-auto mb-8"
            variants={itemVariants}
          />
        )}

        {/* Badge */}
        {content.badge && (
          <motion.span
            className="inline-block bg-[var(--color-accent)] text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider mb-4"
            variants={itemVariants}
          >
            {content.badge}
          </motion.span>
        )}

        {/* Headline */}
        <motion.h1
          className="text-7xl leading-[0.95] mb-6 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)]"
          variants={itemVariants}
        >
          <Headline text={content.headline} highlightedText={content.highlightedText} />
        </motion.h1>

        {/* Subtitle */}
        {content.subtitle && (
          <motion.p
            className="text-2xl opacity-60 font-medium mb-12"
            variants={itemVariants}
          >
            {content.subtitle}
          </motion.p>
        )}
      </motion.div>
    </>
  );
}
