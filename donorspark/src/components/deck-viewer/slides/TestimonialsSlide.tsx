'use client';

import { motion } from 'framer-motion';
import type { TestimonialsSlide as TestimonialsSlideType } from '@/types/slide';
import { containerVariants, itemVariants, cardVariants } from './animations';
import { Headline } from './shared';

interface TestimonialsSlideProps {
  slide: TestimonialsSlideType;
}

export function TestimonialsSlide({ slide }: TestimonialsSlideProps) {
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

      {/* Testimonial Cards Grid */}
      <motion.div
        className="client-results grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {content.testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="client-card bg-white rounded-3xl p-10 shadow-lg border border-black/5"
            variants={cardVariants}
          >
            {/* Client Name */}
            <h3 className="text-2xl font-bold mb-1 text-[var(--color-accent)] uppercase">
              {testimonial.clientName}
            </h3>

            {/* Subtitle */}
            {testimonial.subtitle && (
              <p className="text-base font-serif italic opacity-70 mb-5">
                {testimonial.subtitle}
              </p>
            )}

            {/* Stats Row */}
            <div className="stats-row flex gap-6 mb-5">
              {testimonial.stats.map((stat, statIndex) => (
                <div key={statIndex} className="stat-item flex-1">
                  <div className="stat-highlight text-3xl font-extrabold text-[var(--color-accent)] leading-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="stat-description text-sm opacity-80 leading-snug">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="client-quote bg-[var(--color-accent)]/5 border-l-4 border-[var(--color-accent)] p-6 rounded-r-xl mt-6">
              <p className="font-serif italic text-base leading-relaxed mb-3">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <span className="attribution font-sans not-italic text-sm font-semibold opacity-70">
                — {testimonial.attribution}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
