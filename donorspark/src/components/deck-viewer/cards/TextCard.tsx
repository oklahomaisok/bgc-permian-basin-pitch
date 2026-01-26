'use client';

import type { TextSlide } from '@/types/slide';

interface TextCardProps {
  slide: TextSlide;
}

export function TextCard({ slide }: TextCardProps) {
  const { content } = slide;

  // Parse headline for highlighted text
  const renderHeadline = () => {
    if (!content.headline) return null;
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

  return (
    <>
      {/* Background Image */}
      {content.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={content.backgroundImage}
            alt=""
            className={`w-full h-full object-cover ${
              content.backgroundOverlay === 'light' ? 'grayscale opacity-60' : 'opacity-80'
            }`}
          />
          <div
            className={`absolute inset-0 ${
              content.backgroundOverlay === 'dark'
                ? 'bg-gradient-to-b from-transparent to-[#1D2350]'
                : content.backgroundOverlay === 'light'
                ? 'bg-gradient-to-b from-transparent to-[#1D2350]'
                : ''
            }`}
          />
        </div>
      )}

      {/* Content */}
      <div className={`flex flex-col z-10 p-6 md:p-10 relative h-full ${
        content.alignment === 'center' ? 'justify-center items-center text-center' : 'justify-end'
      }`}>
        <div className="animate-fadeIn space-y-4" style={{ animationDelay: '0.3s' }}>
          {/* Gold accent bar */}
          {!content.headline && <div className="w-12 h-1 bg-[var(--color-accent)]" />}

          {/* Headline */}
          {content.headline && (
            <h2 className="text-3xl md:text-4xl text-white uppercase tracking-tight leading-none font-bold mb-4">
              {renderHeadline()}
            </h2>
          )}

          {/* Quote */}
          {content.quote && (
            <p className="text-xl md:text-2xl text-white leading-tight">
              {content.quote}
            </p>
          )}

          {/* Body */}
          {content.body && (
            <p className="text-base md:text-lg text-neutral-200 leading-relaxed">
              {content.body}
            </p>
          )}

          {/* Attribution */}
          {content.attribution && (
            <p className="text-sm text-neutral-400 mt-4">
              — {content.attribution}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
