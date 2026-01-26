'use client';

import type { ImageSlide } from '@/types/slide';

interface ImageCardProps {
  slide: ImageSlide;
}

export function ImageCard({ slide }: ImageCardProps) {
  const { content } = slide;
  const position = content.overlayPosition || 'bottom';

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

  const positionClass = {
    top: 'justify-start pt-6',
    center: 'justify-center',
    bottom: 'justify-end pb-6',
  }[position];

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[content.overlayAlignment || 'left'];

  return (
    <>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2350] via-[#1D2350]/50 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className={`flex flex-col z-10 p-6 md:p-10 relative h-full ${positionClass} ${alignmentClass}`}>
        <div className="animate-fadeIn space-y-3 max-w-full" style={{ animationDelay: '0.3s' }}>
          {/* Headline */}
          {content.headline && (
            <h2 className="text-2xl md:text-3xl text-white uppercase tracking-tight leading-none font-bold">
              {renderHeadline()}
            </h2>
          )}

          {/* Quote */}
          {content.quote && (
            <p className="text-base md:text-lg text-white/90 leading-relaxed italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}

          {/* Attribution */}
          {content.attribution && (
            <p className="text-sm text-white/60">
              — {content.attribution}
            </p>
          )}

          {/* Stats */}
          {content.stats && content.stats.length > 0 && (
            <div className="flex gap-6 mt-4">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
