'use client';

import { motion } from 'framer-motion';
import type { CTASlide as CTASlideType } from '@/types/slide';
import { containerVariants, itemVariants, imageVariants } from './animations';
import { Headline, AmbientGlow } from './shared';

interface CTASlideProps {
  slide: CTASlideType;
}

export function CTASlide({ slide }: CTASlideProps) {
  const { content } = slide;
  const imagePosition = content.imagePosition || 'left';
  const hasImage = !!content.imageUrl;

  if (hasImage) {
    return (
      <div className={`split-slide grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1300px] w-full items-center`}>
        {/* Image */}
        <motion.div
          className={imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={content.imageUrl}
            alt=""
            className="w-full h-[500px] rounded-3xl object-cover shadow-2xl"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          className={`relative ${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AmbientGlow opacity={0.4} />

          {/* Headline */}
          <motion.h2
            className="text-5xl leading-[0.95] mb-6 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)] relative z-10"
            variants={itemVariants}
          >
            <Headline text={content.headline} highlightedText={content.highlightedText} />
          </motion.h2>

          {/* Body */}
          {content.body && (
            <motion.p
              className="text-xl opacity-80 mb-6 leading-relaxed relative z-10"
              variants={itemVariants}
            >
              {content.body}
            </motion.p>
          )}

          {/* Next Steps Box */}
          {content.listItems && content.listItems.length > 0 && (
            <motion.div
              className="bg-white p-8 rounded-3xl relative z-10"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold mb-4 uppercase">Next Steps:</h3>
              <ul className="list-none m-0 p-0 space-y-2">
                {content.listItems.map((item, index) => (
                  <li key={index} className="py-2 pl-7 relative text-base leading-relaxed">
                    <span className="absolute left-0 text-[var(--color-accent)] font-bold text-lg">
                      {item.icon === 'check' ? '✓' : item.icon === 'arrow' ? '→' : '•'}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* CTA Buttons */}
          {(content.primaryButton || content.secondaryButton) && (
            <motion.div
              className="flex gap-4 mt-8 relative z-10"
              variants={itemVariants}
            >
              {content.primaryButton && (
                <a
                  href={content.primaryButton.url}
                  className="cta-button inline-block py-5 px-12 bg-[var(--color-accent)] text-white no-underline rounded-full font-bold text-lg transition-all uppercase tracking-wide shadow-lg hover:brightness-110 hover:-translate-y-1 hover:shadow-xl"
                >
                  {content.primaryButton.text}
                </a>
              )}
              {content.secondaryButton && (
                <a
                  href={content.secondaryButton.url}
                  className="cta-button-secondary inline-block py-5 px-12 bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] no-underline rounded-full font-bold text-lg transition-all uppercase tracking-wide hover:bg-[var(--color-accent)]/10"
                >
                  {content.secondaryButton.text}
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Centered layout without image
  return (
    <motion.div
      className="text-center max-w-[800px] relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AmbientGlow />

      {/* Headline */}
      <motion.h2
        className="text-5xl leading-[0.95] mb-6 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)] relative z-10"
        variants={itemVariants}
      >
        <Headline text={content.headline} highlightedText={content.highlightedText} />
      </motion.h2>

      {/* Body */}
      {content.body && (
        <motion.p
          className="text-xl opacity-80 mb-8 leading-relaxed relative z-10"
          variants={itemVariants}
        >
          {content.body}
        </motion.p>
      )}

      {/* CTA Buttons */}
      {(content.primaryButton || content.secondaryButton) && (
        <motion.div
          className="flex gap-4 justify-center mt-8 relative z-10"
          variants={itemVariants}
        >
          {content.primaryButton && (
            <a
              href={content.primaryButton.url}
              className="cta-button inline-block py-5 px-12 bg-[var(--color-accent)] text-white no-underline rounded-full font-bold text-lg transition-all uppercase tracking-wide shadow-lg hover:brightness-110 hover:-translate-y-1 hover:shadow-xl"
            >
              {content.primaryButton.text}
            </a>
          )}
          {content.secondaryButton && (
            <a
              href={content.secondaryButton.url}
              className="cta-button-secondary inline-block py-5 px-12 bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] no-underline rounded-full font-bold text-lg transition-all uppercase tracking-wide hover:bg-[var(--color-accent)]/10"
            >
              {content.secondaryButton.text}
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
