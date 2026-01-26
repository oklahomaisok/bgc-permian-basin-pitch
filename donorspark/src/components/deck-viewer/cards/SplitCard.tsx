'use client';

import type { SplitSlide } from '@/types/slide';

interface SplitCardProps {
  slide: SplitSlide;
}

export function SplitCard({ slide }: SplitCardProps) {
  const { content } = slide;
  const imagePosition = content.imagePosition || 'left';

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
    <div className="flex flex-col h-full">
      {/* Image Section - Top half on mobile, varies on desktop */}
      <div
        className={`relative h-2/5 md:h-1/2 ${
          imagePosition === 'right' ? 'order-2' : 'order-1'
        }`}
      >
        <img
          src={content.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1D2350]/80" />
      </div>

      {/* Content Section */}
      <div
        className={`flex-1 p-6 md:p-8 flex flex-col justify-center ${
          imagePosition === 'right' ? 'order-1' : 'order-2'
        }`}
      >
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl text-white uppercase tracking-tight leading-none font-bold mb-4 animate-fadeIn">
          {renderHeadline()}
        </h2>

        {/* Stats Grid */}
        {content.stats && content.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {content.stats.map((stat, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs text-neutral-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        {content.body && (
          <p className="text-sm text-neutral-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {content.body}
          </p>
        )}

        {/* Challenges */}
        {content.challenges && content.challenges.length > 0 && (
          <div className="space-y-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {content.challenges.map((challenge, index) => (
              <div
                key={index}
                className="bg-white/5 border-l-2 border-[var(--color-accent)] p-3 rounded-r-lg"
              >
                <h4 className="text-sm font-bold text-[var(--color-accent)] uppercase mb-1">
                  {challenge.title}
                </h4>
                <p className="text-xs text-neutral-300">{challenge.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* List Items */}
        {content.listItems && content.listItems.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {content.listItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/10 p-2 rounded text-center backdrop-blur-sm"
              >
                <div className="text-[var(--color-accent)] font-bold uppercase text-xs tracking-wider">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
