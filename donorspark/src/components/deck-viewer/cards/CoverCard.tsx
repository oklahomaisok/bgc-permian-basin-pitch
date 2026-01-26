'use client';

import type { CoverSlide } from '@/types/slide';

interface CoverCardProps {
  slide: CoverSlide;
}

export function CoverCard({ slide }: CoverCardProps) {
  const { content } = slide;

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

  return (
    <>
      {/* Background Image */}
      {content.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={content.backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D2350] via-[#1D2350]/30 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-between">
        {/* Badge */}
        {content.badge && (
          <div className="flex animate-fadeIn">
            <span className="text-[10px] md:text-xs text-[var(--color-accent)] uppercase tracking-widest font-bold border border-[var(--color-accent)]/30 px-2 py-1 rounded bg-[#1D2350]/80 backdrop-blur-md">
              {content.badge}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-4">
          <h1 className="leading-[0.9] text-5xl md:text-6xl tracking-wide uppercase text-white mb-6 drop-shadow-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {renderHeadline()}
          </h1>

          {content.subtitle && (
            <p className="text-sm text-neutral-200 border-l-4 border-[var(--color-accent)] pl-4 drop-shadow-md max-w-[90%] animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              {content.subtitle}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
