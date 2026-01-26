'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Slide } from '@/types/slide';
import type { Theme } from '@/types/theme';
import { ThemeProvider } from './ThemeProvider';
import { SlideCard } from './SlideCard';

interface DeckViewerProps {
  slides: Slide[];
  theme: Theme;
  logoUrl?: string;
  onSlideChange?: (slideIndex: number) => void;
}

export function DeckViewer({ slides, theme, logoUrl, onSlideChange }: DeckViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Update current slide based on scroll position
  const handleScroll = useCallback(() => {
    if (!sliderRef.current || isScrolling.current) return;

    const slider = sliderRef.current;
    const scrollLeft = slider.scrollLeft;
    const cardWidth = slider.querySelector('.slide-card')?.clientWidth || 500;
    const gap = 48; // gap-x-12 = 3rem = 48px
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));

    if (newIndex !== currentSlide && newIndex >= 0 && newIndex < slides.length) {
      setCurrentSlide(newIndex);
      onSlideChange?.(newIndex);
    }
  }, [currentSlide, slides.length, onSlideChange]);

  // Scroll to specific slide
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const cards = slider.querySelectorAll('.slide-card');
    if (cards[index]) {
      isScrolling.current = true;
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCurrentSlide(index);
      onSlideChange?.(index);

      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  }, [onSlideChange]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  }, [currentSlide, scrollToSlide]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      scrollToSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length, scrollToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="deck-viewer min-h-screen flex flex-col"
        style={{ backgroundColor: '#15193b' }}
      >
        {/* Fixed Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-[#1D2350]/90 backdrop-blur-md border-b border-white/10 h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 w-auto md:w-1/3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            )}
          </div>

          {/* Pagination Dots */}
          <div className="hidden sm:flex items-center justify-center gap-2 w-1/3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  index === currentSlide
                    ? 'bg-[var(--color-accent)] scale-125'
                    : 'bg-white/20 hover:bg-[var(--color-accent)]'
                }`}
              />
            ))}
          </div>

          {/* Nav Buttons (Desktop) */}
          <div className="hidden md:flex items-center justify-end gap-2 w-1/3">
            <button
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Swipe Hint (Mobile) */}
          <div className="md:hidden flex items-center justify-end w-auto text-[var(--color-accent)] text-xs gap-1 opacity-80">
            <span className="font-bold tracking-widest uppercase">SWIPE</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 2l4 4-4 4"/>
              <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
              <path d="M7 22l-4-4 4-4"/>
              <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
            </svg>
          </div>
        </nav>

        {/* Horizontal Card Slider */}
        <main
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full pt-24 md:pt-28 pb-6 md:pb-10 px-4 md:px-10 gap-x-4 md:gap-x-12 scroll-smooth items-center flex-1"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          }}
        >
          {slides.map((slide, index) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              isActive={index === currentSlide}
            />
          ))}
        </main>
      </div>
    </ThemeProvider>
  );
}
