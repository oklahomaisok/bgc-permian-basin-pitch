'use client';

import type { CTASlide } from '@/types/slide';

interface CTACardProps {
  slide: CTASlide;
}

export function CTACard({ slide }: CTACardProps) {
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

  const hasImage = !!content.imageUrl;

  if (hasImage) {
    return (
      <div className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative h-2/5">
          <img
            src={content.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1D2350]" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl text-white uppercase tracking-tight leading-none font-bold mb-4 animate-fadeIn">
            {renderHeadline()}
          </h2>

          {/* Body */}
          {content.body && (
            <p className="text-sm text-neutral-300 mb-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {content.body}
            </p>
          )}

          {/* List Items */}
          {content.listItems && content.listItems.length > 0 && (
            <div className="space-y-2 mb-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              {content.listItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-neutral-200">
                  <span className="text-[var(--color-accent)] font-bold">✓</span>
                  {item.text}
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          {(content.primaryButton || content.secondaryButton) && (
            <div className="flex flex-col gap-2 mt-auto animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              {content.primaryButton && (
                <a
                  href={content.primaryButton.url}
                  className="w-full py-3 px-6 bg-[var(--color-accent)] text-[#1D2350] text-center rounded-full font-bold text-sm uppercase tracking-wide hover:brightness-110 transition-all"
                >
                  {content.primaryButton.text}
                </a>
              )}
              {content.secondaryButton && (
                <a
                  href={content.secondaryButton.url}
                  className="w-full py-3 px-6 bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] text-center rounded-full font-bold text-sm uppercase tracking-wide hover:bg-[var(--color-accent)]/10 transition-all"
                >
                  {content.secondaryButton.text}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Centered layout without image
  return (
    <>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 195, 3, 0.1) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="flex flex-col z-10 p-6 md:p-8 relative h-full justify-center text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl text-white uppercase tracking-tight leading-none font-bold mb-4 animate-fadeIn">
          {renderHeadline()}
        </h2>

        {/* Body */}
        {content.body && (
          <p className="text-base text-neutral-300 mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {content.body}
          </p>
        )}

        {/* CTA Buttons */}
        {(content.primaryButton || content.secondaryButton) && (
          <div className="flex flex-col gap-3 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {content.primaryButton && (
              <a
                href={content.primaryButton.url}
                className="w-full py-4 px-8 bg-[var(--color-accent)] text-[#1D2350] text-center rounded-full font-bold uppercase tracking-wide hover:brightness-110 transition-all shadow-lg"
              >
                {content.primaryButton.text}
              </a>
            )}
            {content.secondaryButton && (
              <a
                href={content.secondaryButton.url}
                className="w-full py-4 px-8 bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] text-center rounded-full font-bold uppercase tracking-wide hover:bg-[var(--color-accent)]/10 transition-all"
              >
                {content.secondaryButton.text}
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
