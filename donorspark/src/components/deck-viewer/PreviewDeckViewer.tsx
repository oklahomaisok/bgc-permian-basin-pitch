'use client';

import { useEffect, useRef, useState } from 'react';

interface PreviewDeckViewerProps {
  orgName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  donorFirstName: string;
  donorLastName: string;
  giftAmount: string;
  impactHeadline: string;
  impactStory: string;
}

export function PreviewDeckViewer({
  orgName,
  logoUrl,
  primaryColor,
  secondaryColor,
  accentColor,
  donorFirstName,
  giftAmount,
  impactHeadline,
  impactStory,
}: PreviewDeckViewerProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const totalSlides = 6;

  // Initialize IntersectionObserver for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px -10% 0px -10%' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Track current slide for pagination
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide-container');
    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(slides).indexOf(entry.target as Element);
            if (index !== -1) {
              setCurrentSlide(index);
            }
          }
        });
      },
      { root: slider, threshold: 0.6 }
    );

    slides.forEach((slide) => slideObserver.observe(slide));
    return () => slideObserver.disconnect();
  }, []);

  const scrollToSlide = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const slides = slider.querySelectorAll('.slide-container');
    slides[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const scrollNext = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.85 : 548;
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollPrev = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.85 : 548;
    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') scrollNext();
      if (e.key === 'ArrowLeft') scrollPrev();
      if (e.key === 'Escape' && shareModalOpen) setShareModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shareModalOpen]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center selection:bg-[var(--accent)]/30"
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: primaryColor,
        color: 'white',
        // @ts-expect-error CSS custom properties
        '--primary': primaryColor,
        '--secondary': secondaryColor,
        '--accent': accentColor,
      }}
    >
      {/* Fixed Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 backdrop-blur-md border-b border-white/10 h-16"
        style={{ backgroundColor: `${primaryColor}e6` }}
      >
        <div className="flex items-center gap-3 w-auto md:w-1/3">
          {logoUrl ? (
            <img src={logoUrl} alt={`${orgName} Logo`} className="h-10 w-auto object-contain" />
          ) : (
            <span className="text-white font-bold text-lg">{orgName}</span>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="hidden sm:flex items-center justify-center gap-2 w-1/3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                backgroundColor: index === currentSlide ? accentColor : 'rgba(255,255,255,0.2)',
                transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Nav Buttons - Desktop */}
        <div className="hidden md:flex items-center justify-end gap-2 w-1/3">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 transition-colors"
            style={{ color: currentSlide > 0 ? accentColor : undefined }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 transition-colors"
            style={{ color: currentSlide < totalSlides - 1 ? accentColor : undefined }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Swipe hint - Mobile */}
        <div className="md:hidden flex items-center justify-end w-auto text-xs gap-1 opacity-80" style={{ color: accentColor }}>
          <span className="font-bold tracking-widest uppercase">SWIPE</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
        </div>
      </nav>

      {/* Main Slider */}
      <main
        ref={sliderRef}
        className="flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full pt-24 md:pt-28 pb-6 md:pb-10 px-4 md:px-10 gap-x-4 md:gap-x-12 scroll-smooth"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
        }}
      >
        {/* SLIDE 1: THE HOOK */}
        <section
          className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center border-white/10 border relative shadow-2xl justify-between rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-between">
            <div className="flex animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0s both' }}>
              <span
                className="text-[10px] md:text-xs uppercase tracking-widest font-bold border px-2 py-1 rounded backdrop-blur-md"
                style={{ color: accentColor, borderColor: `${accentColor}50`, backgroundColor: `${primaryColor}cc` }}
              >
                Your Impact
              </span>
            </div>

            <div className="mb-4">
              <h1
                className="leading-[0.9] animate-on-scroll text-5xl md:text-6xl tracking-wide uppercase text-white mb-6 drop-shadow-lg font-bold"
                style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}
              >
                {donorFirstName},<br />
                You Just<br />
                <span style={{ color: accentColor }}>{impactHeadline}.</span>
              </h1>
            </div>
          </div>
        </section>

        {/* SLIDE 2: THE STORY */}
        <section
          className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center border-white/10 border relative shadow-2xl justify-end rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-end">
            <div className="animate-on-scroll space-y-4" style={{ animation: 'animationIn 0.8s ease-out 0.3s both' }}>
              <div className="w-12 h-1" style={{ backgroundColor: accentColor }} />
              <p className="text-xl md:text-2xl text-white leading-tight font-medium">
                {impactStory}
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 3: THE GIFT */}
        <section
          className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center border-white/10 border relative shadow-2xl rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center items-center text-center">
            <div className="animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
              <span className="text-sm uppercase tracking-widest text-white/60 mb-4 block">Your Gift</span>
              {giftAmount && (
                <div
                  className="text-6xl md:text-7xl font-bold mb-4"
                  style={{ color: accentColor }}
                >
                  ${giftAmount}
                </div>
              )}
              <p className="text-lg text-white/80">
                Made this possible
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 4: THE COMPLIMENT */}
        <section
          className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center border-white/10 border relative shadow-2xl rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center items-center text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border animate-on-scroll"
              style={{ backgroundColor: `${accentColor}20`, borderColor: accentColor, animation: 'animationIn 0.8s ease-out 0.1s both' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>

            <div className="animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.3s both' }}>
              <h2 className="text-3xl md:text-4xl text-white mb-4 uppercase font-bold">
                You Made a Difference
              </h2>
              <p className="text-base text-neutral-300 mb-6">
                {donorFirstName}, because of your generosity
              </p>
              <span
                className="text-2xl md:text-3xl uppercase tracking-wider border-y py-2 block font-bold"
                style={{ color: accentColor, borderColor: `${accentColor}50` }}
              >
                Lives Are Changed
              </span>
            </div>
          </div>
        </section>

        {/* SLIDE 5: THE VISION */}
        <section
          className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center border-white/10 border relative shadow-2xl justify-end rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-end">
            <div className="animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
              <div
                className="backdrop-blur-md p-5 rounded-lg border-l-4"
                style={{ backgroundColor: `${primaryColor}99`, borderColor: accentColor }}
              >
                <p className="text-base md:text-lg text-white font-medium">
                  This is just the beginning. Thank you for being part of our mission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 6: THE CLOSER */}
        <section
          className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center border-white/10 border relative shadow-2xl justify-center rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0" style={{ backgroundColor: `${primaryColor}cc` }} />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center items-center text-center">
            <div className="mb-8 animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.1s both' }}>
              {logoUrl ? (
                <img src={logoUrl} alt={`${orgName} Logo`} className="h-16 w-auto object-contain mx-auto mb-6 opacity-90" />
              ) : (
                <div className="text-2xl font-bold text-white mb-6">{orgName}</div>
              )}
            </div>

            <h1
              className="text-5xl md:text-7xl text-white uppercase tracking-wide mb-4 animate-on-scroll font-bold"
              style={{ animation: 'animationIn 0.8s ease-out 0.3s both' }}
            >
              Thank You,<br />
              <span style={{ color: accentColor }}>{donorFirstName}.</span>
            </h1>

            <p className="text-neutral-300 text-lg italic mb-8 animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.5s both' }}>
              You are making a difference.
            </p>

            <div className="animate-on-scroll flex flex-col sm:flex-row gap-3" style={{ animation: 'animationIn 0.8s ease-out 0.7s both' }}>
              <button
                onClick={() => setShareModalOpen(true)}
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                style={{ backgroundColor: accentColor, color: primaryColor }}
              >
                Share This Story
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Share Modal */}
      <div className={`share-modal fixed inset-0 z-[100] flex items-center justify-center p-4 ${shareModalOpen ? 'active' : ''}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShareModalOpen(false)} />
        <div
          className="share-modal-content border border-white/20 rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl uppercase tracking-wide font-bold">Share This Story</h3>
            <button onClick={() => setShareModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`sms:?body=Check%20out%20how%20my%20gift%20to%20${encodeURIComponent(orgName)}%20made%20a%20difference!%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Text</span>
            </a>

            <a
              href={`mailto:?subject=See%20My%20Impact%20at%20${encodeURIComponent(orgName)}&body=Check%20out%20how%20my%20gift%20made%20a%20difference!%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Email</span>
            </a>

            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors col-span-2"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
