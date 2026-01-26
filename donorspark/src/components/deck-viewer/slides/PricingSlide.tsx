'use client';

import { motion } from 'framer-motion';
import type { PricingSlide as PricingSlideType } from '@/types/slide';
import { containerVariants, itemVariants, cardVariants } from './animations';
import { Headline } from './shared';

interface PricingSlideProps {
  slide: PricingSlideType;
}

export function PricingSlide({ slide }: PricingSlideProps) {
  const { content } = slide;

  return (
    <motion.div
      className="max-w-[1200px] w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Headline */}
      <motion.h2
        className="text-5xl leading-[0.95] mb-8 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)] text-center"
        variants={itemVariants}
      >
        <Headline text={content.headline} highlightedText={content.highlightedText} />
      </motion.h2>

      {/* Pricing Cards */}
      <motion.div
        className="pricing-comparison grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
        variants={containerVariants}
      >
        {content.packages.map((pkg, index) => (
          <motion.div
            key={index}
            className={`pricing-card bg-white rounded-3xl p-10 text-center border-2 transition-all relative overflow-hidden ${
              pkg.highlighted
                ? 'border-[var(--color-accent)] shadow-2xl'
                : 'border-black/5 hover:border-[var(--color-accent)] hover:-translate-y-2 hover:shadow-xl'
            }`}
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--color-accent)]" />

            {/* Package Name */}
            <h4 className="text-lg font-bold mb-3 uppercase">{pkg.name}</h4>

            {/* Price */}
            <div className="price text-5xl font-extrabold text-[var(--color-text)] my-4">
              {pkg.price}
            </div>

            {/* Price Detail */}
            {pkg.priceDetail && (
              <p className="price-detail text-sm text-[var(--color-text)]">{pkg.priceDetail}</p>
            )}

            {/* Price Note */}
            {pkg.priceNote && (
              <p className="text-sm opacity-60 mt-3">{pkg.priceNote}</p>
            )}

            {/* Features */}
            <ul className="text-left text-sm mt-6 opacity-80 list-none p-0 space-y-2">
              {pkg.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Footnote */}
            {pkg.footnote && (
              <p className="text-xs opacity-50 mt-6 pt-3 border-t border-black/10">
                {pkg.footnote}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Add-ons */}
      {content.addOns && content.addOns.length > 0 && (
        <motion.div
          className="flex gap-8 mt-8 justify-center flex-wrap"
          variants={itemVariants}
        >
          {content.addOns.map((addOn, index) => (
            <div
              key={index}
              className="bg-[var(--color-accent)]/10 py-5 px-6 rounded-xl text-center"
            >
              <p className="text-xs uppercase tracking-wider opacity-70 mb-2">
                {addOn.title}
              </p>
              <p className="font-bold text-lg">{addOn.description}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
