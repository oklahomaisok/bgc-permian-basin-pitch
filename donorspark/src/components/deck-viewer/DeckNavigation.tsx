'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeckNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide: (index: number) => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
}

export function DeckNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
  canGoNext = true,
  canGoPrev = true,
}: DeckNavigationProps) {
  return (
    <>
      {/* Navigation Arrows */}
      <div className="nav-arrows fixed bottom-1/2 translate-y-1/2 w-full flex justify-between px-8 z-[1000] pointer-events-none">
        <motion.button
          className={`nav-arrow w-12 h-12 rounded-full bg-white/90 border border-black/10 flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300 ${
            !canGoPrev || currentSlide === 0 ? 'opacity-30 pointer-events-none' : 'hover:bg-[var(--color-accent)] hover:text-white hover:scale-110'
          }`}
          onClick={onPrevious}
          disabled={!canGoPrev || currentSlide === 0}
          whileHover={canGoPrev && currentSlide > 0 ? { scale: 1.1 } : {}}
          whileTap={canGoPrev && currentSlide > 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          className={`nav-arrow w-12 h-12 rounded-full bg-white/90 border border-black/10 flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300 ${
            !canGoNext || currentSlide === totalSlides - 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-[var(--color-accent)] hover:text-white hover:scale-110'
          }`}
          onClick={onNext}
          disabled={!canGoNext || currentSlide === totalSlides - 1}
          whileHover={canGoNext && currentSlide < totalSlides - 1 ? { scale: 1.1 } : {}}
          whileTap={canGoNext && currentSlide < totalSlides - 1 ? { scale: 0.95 } : {}}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Navigation Dots */}
      <div className="nav-dots fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-[1000] bg-white/90 py-3 px-7 rounded-full border border-black/5">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            className={`dot w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[var(--color-accent)] scale-130'
                : 'bg-[var(--color-text)] opacity-20 hover:opacity-60 hover:scale-110'
            }`}
            onClick={() => onGoToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={index === currentSlide ? { scale: 1.3 } : { scale: 1 }}
          />
        ))}
      </div>
    </>
  );
}
