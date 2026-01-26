'use client';

import { motion } from 'framer-motion';
import type { Slide } from '@/types/slide';
import { CoverSlide } from './CoverSlide';
import { TextSlide } from './TextSlide';
import { SplitSlide } from './SplitSlide';
import { StatsSlide } from './StatsSlide';
import { FunnelSlide } from './FunnelSlide';
import { TestimonialsSlide } from './TestimonialsSlide';
import { PricingSlide } from './PricingSlide';
import { RoadmapSlide } from './RoadmapSlide';
import { CTASlide } from './CTASlide';
import { ImageSlide } from './ImageSlide';

interface SlideRendererProps {
  slide: Slide;
  isActive: boolean;
  direction: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

export function SlideRenderer({ slide, isActive, direction }: SlideRendererProps) {
  const renderSlide = () => {
    switch (slide.type) {
      case 'cover':
        return <CoverSlide slide={slide} />;
      case 'text':
        return <TextSlide slide={slide} />;
      case 'image':
        return <ImageSlide slide={slide} />;
      case 'split':
        return <SplitSlide slide={slide} />;
      case 'stats':
        return <StatsSlide slide={slide} />;
      case 'funnel':
        return <FunnelSlide slide={slide} />;
      case 'testimonials':
        return <TestimonialsSlide slide={slide} />;
      case 'pricing':
        return <PricingSlide slide={slide} />;
      case 'roadmap':
        return <RoadmapSlide slide={slide} />;
      case 'cta':
        return <CTASlide slide={slide} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p>Unknown slide type</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="slide absolute inset-0 flex flex-col justify-center items-center px-15 py-30"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {renderSlide()}
    </motion.div>
  );
}
