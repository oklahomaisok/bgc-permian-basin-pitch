'use client';

import { useState } from 'react';
import type { TestimonialsSlide } from '@/types/slide';

interface TestimonialsCardProps {
  slide: TestimonialsSlide;
}

export function TestimonialsCard({ slide }: TestimonialsCardProps) {
  const { content } = slide;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse headline for highlighted text
  const renderHeadline = () => {
    if (!content.highlightedText) {
      return <span>{content.headline}</span>;
    }

    const parts = content.headline.split('{{highlight}}');
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <span className="text-[var(--color-accent)]">{content.highlightedText}</span>
          {parts[1]}
        </>
      );
    }
    return <span>{content.headline}</span>;
  };

  const handleCardClick = () => {
    setCurrentIndex((prev) => (prev + 1) % content.testimonials.length);
  };

  const currentTestimonial = content.testimonials[currentIndex];

  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1D2350]/80" />
      </div>

      {/* Content */}
      <div className="flex flex-col z-10 p-6 md:p-8 relative h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl text-white uppercase tracking-tight leading-none font-bold animate-fadeIn">
            {renderHeadline()}
          </h2>
          {content.testimonials.length > 1 && (
            <div className="text-[10px] font-mono text-[var(--color-accent)] flex items-center gap-1 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.6 13a4 4 0 0 1-7.7 2.3l-2.6-7.5a1.7 1.7 0 0 0-3.3 1L9 18.2a5.3 5.3 0 0 0 2.2 4.1l6.3 3.6c2.4 1.4 5.3-.2 5.5-2.9l.6-9.1a4 4 0 0 0-5-4.1z"/>
                <line x1="12" x2="12" y1="2" y2="6"/>
              </svg>
              TAP
            </div>
          )}
        </div>

        {/* Card Stack */}
        <div
          className="flex-1 relative cursor-pointer"
          onClick={handleCardClick}
        >
          {/* Stacked cards effect */}
          {content.testimonials.length > 1 && (
            <>
              <div className="absolute inset-x-2 top-2 bottom-0 bg-white rounded-xl opacity-40 -z-20 transform scale-95" />
              <div className="absolute inset-x-1 top-1 bottom-0 bg-white rounded-xl opacity-70 -z-10 transform scale-98" />
            </>
          )}

          {/* Current Card */}
          <div className="bg-white rounded-xl p-5 h-full flex flex-col overflow-hidden shadow-xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#1D2350] rounded-full overflow-hidden border-2 border-[var(--color-accent)] flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {currentTestimonial.clientName.charAt(0)}
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase text-neutral-400 text-right">
                {currentTestimonial.subtitle}
              </div>
            </div>

            {/* Name */}
            <h3 className="text-lg font-bold text-[#1D2350] uppercase mb-2">
              {currentTestimonial.clientName}
            </h3>

            {/* Stats */}
            <div className="flex gap-4 mb-3">
              {currentTestimonial.stats.map((stat, index) => (
                <div key={index} className="flex-1">
                  <div className="text-xl font-bold text-[var(--color-accent)]">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-neutral-500">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="flex-1 bg-[var(--color-accent)]/10 border-l-4 border-[var(--color-accent)] p-3 rounded-r-lg mt-auto">
              <p className="text-xs text-neutral-700 italic leading-relaxed line-clamp-4">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </p>
              <span className="text-[10px] text-neutral-500 mt-2 block">
                — {currentTestimonial.attribution}
              </span>
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        {content.testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {content.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
