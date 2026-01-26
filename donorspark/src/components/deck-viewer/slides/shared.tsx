'use client';

import type { ReactNode } from 'react';

interface HeadlineProps {
  text: string;
  highlightedText?: string;
  className?: string;
}

export function Headline({ text, highlightedText, className = '' }: HeadlineProps) {
  if (!highlightedText) {
    return <span className={className}>{text}</span>;
  }

  // Replace {{highlight}} placeholder with actual highlighted text
  const parts = text.split('{{highlight}}');
  if (parts.length === 2) {
    return (
      <span className={className}>
        {parts[0]}
        <span className="impact-text font-serif italic text-[var(--color-accent)] font-normal">
          {highlightedText}
        </span>
        {parts[1]}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
}

interface AmbientGlowProps {
  className?: string;
  opacity?: number;
}

export function AmbientGlow({ className = '', opacity = 0.8 }: AmbientGlowProps) {
  return (
    <div
      className={`absolute w-[1200px] h-[1200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none ${className}`}
      style={{
        background: 'radial-gradient(closest-side, var(--ambient-glow-color, #EACBB5) 30%, transparent 100%)',
        opacity,
      }}
    />
  );
}

interface AuraBackgroundProps {
  className?: string;
}

export function AuraBackground({ className = '' }: AuraBackgroundProps) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden opacity-60 ${className}`}>
      <div
        className="aura-blob-1 absolute w-[800px] h-[800px] rounded-full -top-[200px] -left-[200px] animate-auraFloat1"
        style={{
          background: 'radial-gradient(circle, var(--color-accent) 0%, #5a9567 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.5,
        }}
      />
      <div
        className="aura-blob-2 absolute w-[800px] h-[800px] rounded-full -bottom-[200px] -right-[200px] animate-auraFloat2"
        style={{
          background: 'radial-gradient(circle, #077caa 0%, var(--color-accent) 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.5,
          animationDelay: '-10s',
        }}
      />
    </div>
  );
}

interface ContentBoxProps {
  children: ReactNode;
  className?: string;
}

export function ContentBox({ children, className = '' }: ContentBoxProps) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-[1300px] w-full border border-black/5 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

interface CheckListProps {
  items: string[];
  icon?: 'check' | 'bullet' | 'arrow';
  className?: string;
}

export function CheckList({ items, icon = 'check', className = '' }: CheckListProps) {
  const iconMap = {
    check: '✓',
    bullet: '•',
    arrow: '→',
  };

  return (
    <ul className={`list-none m-0 p-0 ${className}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className="py-2 pl-7 relative text-base leading-relaxed"
        >
          <span
            className="absolute left-0 text-[var(--color-accent)] font-bold text-lg"
            style={{ top: icon === 'bullet' ? '0.3rem' : undefined }}
          >
            {iconMap[icon]}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
