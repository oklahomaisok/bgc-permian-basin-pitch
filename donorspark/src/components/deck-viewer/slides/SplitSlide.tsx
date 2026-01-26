'use client';

import { motion } from 'framer-motion';
import type { SplitSlide as SplitSlideType } from '@/types/slide';
import { containerVariants, itemVariants, imageVariants } from './animations';
import { Headline } from './shared';
import { AnimatedStat } from './AnimatedStat';

interface SplitSlideProps {
  slide: SplitSlideType;
}

export function SplitSlide({ slide }: SplitSlideProps) {
  const { content } = slide;
  const imagePosition = content.imagePosition || 'left';

  return (
    <div
      className={`split-slide grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1300px] w-full items-center ${
        imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
      }`}
    >
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
        className={imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h2
          className="text-5xl leading-[0.95] mb-6 font-display font-extrabold uppercase tracking-tight text-[var(--color-text)]"
          variants={itemVariants}
        >
          <Headline text={content.headline} highlightedText={content.highlightedText} />
        </motion.h2>

        {/* Stats Grid */}
        {content.stats && content.stats.length > 0 && (
          <motion.div
            className="stats-grid grid grid-cols-2 gap-6 my-8"
            variants={itemVariants}
          >
            {content.stats.map((stat, index) => (
              <div key={index} className="text-center p-8 bg-transparent">
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  animate={stat.animate}
                />
                <div className="text-base opacity-80 leading-snug">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Body text */}
        {content.body && (
          <motion.p
            className="text-xl opacity-80 mt-6 leading-relaxed"
            variants={itemVariants}
          >
            {content.body}
          </motion.p>
        )}

        {/* Challenge cards */}
        {content.challenges && content.challenges.length > 0 && (
          <motion.div className="space-y-4 mt-6" variants={itemVariants}>
            {content.challenges.map((challenge, index) => (
              <motion.div
                key={index}
                className="bg-white border-l-4 border-[var(--color-accent)] p-5 rounded-xl shadow-md"
                variants={itemVariants}
              >
                <h4 className="text-lg font-bold mb-2 text-[var(--color-accent)] uppercase">
                  {challenge.title}
                </h4>
                <p className="text-base opacity-80 leading-relaxed">{challenge.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* List items */}
        {content.listItems && content.listItems.length > 0 && (
          <motion.ul className="list-none mt-6 space-y-2" variants={itemVariants}>
            {content.listItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-base">
                <span className="text-[var(--color-accent)] font-bold">
                  {item.icon === 'check' ? '✓' : item.icon === 'arrow' ? '→' : '•'}
                </span>
                {item.text}
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
}
