'use client';

import type { Slide } from '@/types/slide';
import { CoverCard } from './cards/CoverCard';
import { TextCard } from './cards/TextCard';
import { ImageCard } from './cards/ImageCard';
import { SplitCard } from './cards/SplitCard';
import { StatsCard } from './cards/StatsCard';
import { TestimonialsCard } from './cards/TestimonialsCard';
import { CTACard } from './cards/CTACard';

interface SlideCardProps {
  slide: Slide;
  isActive: boolean;
}

export function SlideCard({ slide, isActive }: SlideCardProps) {
  const renderContent = () => {
    switch (slide.type) {
      case 'cover':
        return <CoverCard slide={slide} />;
      case 'text':
        return <TextCard slide={slide} />;
      case 'image':
        return <ImageCard slide={slide} />;
      case 'split':
        return <SplitCard slide={slide} />;
      case 'stats':
        return <StatsCard slide={slide} />;
      case 'testimonials':
        return <TestimonialsCard slide={slide} />;
      case 'cta':
        return <CTACard slide={slide} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-white">
            <p>Slide type: {slide.type}</p>
          </div>
        );
    }
  };

  return (
    <section
      className={`slide-card flex-shrink-0 flex flex-col overflow-hidden snap-center bg-[#1D2350] border-white/10 border relative shadow-2xl rounded-xl transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-90'
      }`}
      style={{
        width: '90vw',
        height: '72vh',
        minWidth: 0,
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          .slide-card {
            width: 500px !important;
            height: auto !important;
            aspect-ratio: 3/4;
          }
        }
      `}</style>
      {renderContent()}
    </section>
  );
}
