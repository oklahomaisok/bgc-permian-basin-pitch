'use client';

import { useEffect, useState } from 'react';
import type { StatsSlide } from '@/types/slide';

interface StatsCardProps {
  slide: StatsSlide;
}

export function StatsCard({ slide }: StatsCardProps) {
  const { content } = slide;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

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

  const isGridLayout = content.layout === 'grid' || content.stats.length > 2;
  const isBarChart = content.layout === 'row' && content.stats.length > 3;

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
      <div className="flex flex-col z-10 p-6 md:p-8 relative h-full">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl text-white uppercase tracking-tight leading-none font-bold mb-6 animate-fadeIn">
          {renderHeadline()}
        </h2>

        {/* Stats */}
        <div className="flex-1 flex flex-col justify-center">
          {isBarChart ? (
            // Bar Chart Layout
            <div className="w-full flex items-end gap-2 h-48 mb-4 border-b border-white/20">
              {content.stats.map((stat, index) => {
                const numValue = typeof stat.value === 'number' ? stat.value : parseInt(String(stat.value)) || 50;
                const maxValue = Math.max(...content.stats.map(s => typeof s.value === 'number' ? s.value : parseInt(String(s.value)) || 50));
                const height = (numValue / maxValue) * 100;

                return (
                  <div key={index} className="flex flex-col items-center justify-end flex-1 group h-full">
                    <span className="text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-accent)]">
                      {stat.value}{stat.suffix}
                    </span>
                    <div
                      className="w-full bg-[var(--color-accent)] rounded-t-sm transition-all duration-1000"
                      style={{
                        height: isVisible ? `${height}%` : '0%',
                        transitionDelay: `${index * 0.2}s`,
                      }}
                    />
                    <span className="text-[8px] md:text-[10px] uppercase font-bold mt-2 text-center text-neutral-400">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : isGridLayout ? (
            // Grid Layout
            <div className="grid grid-cols-2 gap-3">
              {content.stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 text-center animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-neutral-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : (
            // Row Layout
            <div className="flex justify-center gap-6">
              {content.stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 text-center flex-1 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-neutral-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {content.description && (
          <div className="bg-white/5 p-4 rounded-lg border-l-2 border-[var(--color-accent)] mt-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs md:text-sm text-neutral-200">
              {content.description}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
