'use client';

import { useEffect, useRef, useState } from 'react';

interface OriginalDeckViewerProps {
  donorName?: string;
  orgName?: string;
  logoUrl?: string;
  isInsidePhone?: boolean;
}

export function OriginalDeckViewer({
  donorName = 'John',
  orgName = 'US Naval Sea Cadet Corps',
  logoUrl = '/images/sea-cadets/logo.png',
  isInsidePhone = false,
}: OriginalDeckViewerProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const totalSlides = 10;

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

  // Adjust sizing when inside phone frame
  const containerClass = isInsidePhone
    ? 'min-h-full flex flex-col items-center selection:bg-[#FFC303]/30'
    : 'min-h-screen flex flex-col items-center selection:bg-[#FFC303]/30';

  const navHeight = isInsidePhone ? 'h-14' : 'h-16';
  const sliderPadding = isInsidePhone
    ? 'pt-16 pb-4 px-2 gap-x-3'
    : 'pt-24 md:pt-28 pb-6 md:pb-10 px-4 md:px-10 gap-x-4 md:gap-x-12';

  return (
    <div className={containerClass} style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#15193b', color: 'white' }}>
      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-[#1D2350]/90 backdrop-blur-md border-b border-white/10 ${navHeight}`}>
        <div className="flex items-center gap-3 w-auto md:w-1/3">
          <img src={logoUrl} alt={`${orgName} Logo`} className="h-10 w-auto object-contain" />
        </div>

        {/* Pagination Dots - Desktop */}
        <div className="hidden sm:flex items-center justify-center gap-2 w-1/3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-[#FFC303] scale-125'
                  : 'bg-white/20 hover:bg-[#FFC303]'
              }`}
            />
          ))}
        </div>

        {/* Nav Buttons - Desktop */}
        <div className="hidden md:flex items-center justify-end gap-2 w-1/3">
          <button onClick={scrollPrev} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-[#FFC303] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={scrollNext} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-[#FFC303] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Swipe hint - Mobile */}
        <div className="md:hidden flex items-center justify-end w-auto text-[#FFC303] text-xs gap-1 opacity-80">
          <span className="font-bold tracking-widest uppercase" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>SWIPE</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
        </div>
      </nav>

      {/* Main Slider */}
      <main
        ref={sliderRef}
        className={`flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full scroll-smooth ${sliderPadding}`}
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
        }}
      >
        {/* SLIDE 1: THE HOOK */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/cadet-closeup.jpg" className="w-full h-full object-cover opacity-80" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2350] via-[#1D2350]/30 to-transparent" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-between">
            <div className="flex animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0s both' }}>
              <span className="text-[10px] md:text-xs text-[#FFC303] uppercase tracking-widest font-bold border border-[#FFC303]/30 px-2 py-1 rounded bg-[#1D2350]/80 backdrop-blur-md">Your Impact</span>
            </div>

            <div className="mb-4">
              <h1
                className="leading-[0.9] animate-on-scroll text-5xl md:text-6xl tracking-wide uppercase text-white mb-6 drop-shadow-lg"
                style={{ fontFamily: "'Liberator', 'Oswald', sans-serif", animation: 'animationIn 0.8s ease-out 0.2s both' }}
              >
                {donorName},<br />
                You Just<br />
                <span className="text-[#FFC303]">Changed a Life.</span>
              </h1>
            </div>
          </div>
        </section>

        {/* SLIDE 2: THE DESIRE */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/candidate-civilian.jpg" className="w-full h-full object-cover grayscale opacity-60" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1D2350]" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-end">
            <div className="animate-on-scroll space-y-4" style={{ animation: 'animationIn 0.8s ease-out 0.3s both' }}>
              <div className="w-12 h-1 bg-[#FFC303]" />
              <p className="text-xl md:text-2xl text-white leading-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>
                A young person had the heart of a leader, but lacked the gear to join the ranks.
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 3: THE OBSTACLE */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl rounded-xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />

          <div className="flex flex-col z-10 p-5 md:p-6 relative h-full">
            <div className="mb-3 animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0s both' }}>
              <span className="text-xs text-[#FFC303] font-bold tracking-widest uppercase">The Barrier</span>
            </div>

            <div className="flex-grow flex flex-col gap-3 min-h-0">
              {/* Sea Bag Card with Scrolling List */}
              <div className="bg-[#1D2350]/80 border border-white/10 rounded-lg relative backdrop-blur-md animate-on-scroll shadow-xl flex-grow flex flex-col overflow-hidden min-h-0" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
                <h3 className="text-[#FFC303] font-bold text-lg p-4 pb-3 border-b border-white/10 bg-[#1D2350] flex-shrink-0" style={{ fontFamily: "'Roboto Slab', serif" }}>Sea Bag Essentials</h3>

                <div className="scroll-container flex-grow relative min-h-0 overflow-hidden">
                  <div className="scrolling-list text-sm text-neutral-300 px-4 py-3">
                    {/* First set of items */}
                    <div className="space-y-3">
                      {[
                        ['Dress Uniform', '$120.00'],
                        ['Boots', '$85.00'],
                        ['Cover & Insignia', '$45.00'],
                        ['Toothbrush', '$3.00'],
                        ['Toothpaste', '$4.00'],
                        ['Shampoo', '$6.00'],
                        ['Body Wash/Soap', '$5.00'],
                        ['Deodorant', '$4.00'],
                        ['Bath Towels', '$15.00'],
                        ['Shower Shoes', '$8.00'],
                        ['Sunscreen', '$10.00'],
                        ['Shoe Shine Kit', '$12.00'],
                        ['Flashlight', '$15.00'],
                        ['Canteen', '$18.00'],
                        ['Laundry Bag', '$8.00'],
                        ['Insect Repellant', '$7.00'],
                      ].map(([item, price]) => (
                        <div key={item} className="flex justify-between items-center">
                          <span>{item}</span>
                          <span className="blur-[2px] opacity-60 bg-white/10 px-2 rounded text-xs">{price}</span>
                        </div>
                      ))}
                    </div>
                    {/* Duplicate for seamless loop */}
                    <div className="space-y-3 mt-3">
                      {[
                        ['Dress Uniform', '$120.00'],
                        ['Boots', '$85.00'],
                        ['Cover & Insignia', '$45.00'],
                        ['Toothbrush', '$3.00'],
                        ['Toothpaste', '$4.00'],
                        ['Shampoo', '$6.00'],
                        ['Body Wash/Soap', '$5.00'],
                        ['Deodorant', '$4.00'],
                        ['Bath Towels', '$15.00'],
                        ['Shower Shoes', '$8.00'],
                        ['Sunscreen', '$10.00'],
                        ['Shoe Shine Kit', '$12.00'],
                        ['Flashlight', '$15.00'],
                        ['Canteen', '$18.00'],
                        ['Laundry Bag', '$8.00'],
                        ['Insect Repellant', '$7.00'],
                      ].map(([item, price]) => (
                        <div key={`dup-${item}`} className="flex justify-between items-center">
                          <span>{item}</span>
                          <span className="blur-[2px] opacity-60 bg-white/10 px-2 rounded text-xs">{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-white/20 bg-[#1D2350] flex-shrink-0">
                  <div className="flex justify-between text-white font-bold text-base">
                    <span style={{ fontFamily: "'Roboto Slab', serif" }}>TOTAL</span>
                    <span className="text-[#FFC303] text-xl tracking-wide" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>$250.00</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-200 leading-relaxed animate-on-scroll flex-shrink-0" style={{ animation: 'animationIn 0.8s ease-out 0.4s both' }}>
                For one cadet, this cost was the only thing standing in the way of their dream.
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 4: THE TURNING POINT */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/seabag-gear.jpg" className="w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 bg-[#1D2350]/70 mix-blend-multiply" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center text-center">
            <div className="animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
              <h2 className="text-4xl md:text-5xl text-white mb-6 uppercase tracking-wide" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>Then You Stepped In.</h2>
              <div className="bg-[#FFC303] text-[#1D2350] font-bold p-4 rounded-sm inline-block shadow-lg mx-auto transform rotate-2">
                <span className="text-lg" style={{ fontFamily: "'Roboto Slab', serif" }}>Your gift provided their full Sea Bag.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: IMMEDIATE IMPACT (Split Screen) */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl rounded-xl">
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative border-r border-white/20 overflow-hidden">
              <img src="/images/sea-cadets/split-civilian.jpg" className="w-full h-full object-cover grayscale opacity-50" style={{ objectPosition: '30% center' }} alt="" />
              <div className="absolute inset-0 bg-[#1D2350]/40" />
            </div>
            <div className="w-1/2 h-full relative overflow-hidden">
              <img src="/images/sea-cadets/split-uniform.jpg" className="w-full h-full object-cover opacity-90" style={{ transform: 'rotate(-2deg) scale(1.05)', objectPosition: '70% center' }} alt="" />
              <div className="absolute inset-0 bg-[#1D2350]/20 mix-blend-overlay" />
            </div>
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-end">
            <div className="bg-[#1D2350]/80 backdrop-blur-md p-6 rounded-xl border border-white/10 animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.3s both' }}>
              <p className="text-xl leading-snug text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>
                Because of you, they&apos;re not just watching anymore—<br />
                <span className="text-[#FFC303] tracking-wide text-2xl uppercase" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>they&apos;re leading.</span>
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 6: HUMAN DETAIL */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/uniform-detail.jpg" className="w-full h-full object-cover opacity-80" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2350] via-transparent to-transparent" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-end">
            <div className="animate-on-scroll max-w-[95%]" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
              <p className="text-lg md:text-2xl text-white italic leading-relaxed" style={{ fontFamily: "'Roboto Slab', serif" }}>
                &ldquo;They straightened their cover and stood a little taller.&rdquo;
              </p>
              <p className="text-sm text-[#FFC303] mt-4 uppercase tracking-widest font-bold">
                That feeling was your gift.
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 7: SURPRISING COMPLIMENT */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl rounded-xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center items-center text-center">
            <div className="w-20 h-20 bg-[#FFC303]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFC303] animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.1s both' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFC303" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>

            <div className="animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.3s both' }}>
              <h2 className="text-3xl md:text-4xl text-white mb-4 uppercase" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>You Didn&apos;t Just Fund a Bag.</h2>
              <p className="text-base text-neutral-300 mb-6">
                You fueled a future. {donorName}, you are a true
              </p>
              <span className="text-[#FFC303] text-2xl md:text-3xl uppercase tracking-wider border-y border-[#FFC303]/30 py-2 block" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>
                Builder of Leaders
              </span>
            </div>
          </div>
        </section>

        {/* SLIDE 8: ORGANIZATIONAL IMPACT */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/squadron-drill.jpg" className="w-full h-full object-cover opacity-70" alt="" />
            <div className="absolute inset-0 bg-[#1D2350]/60 mix-blend-multiply" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center">
            <div className="animate-on-scroll text-center" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
              <h2 className="text-4xl md:text-5xl text-white uppercase tracking-wide mb-4" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>Nationwide Impact</h2>
              <p className="text-base text-neutral-200 leading-relaxed max-w-sm mx-auto">
                You&apos;re helping us build a generation of leaders across the country, one sea bag at a time.
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 9: THE VISION */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/cadet-horizon.jpg" className="w-full h-full object-cover opacity-80" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2350] to-transparent" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-end">
            <div className="animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.2s both' }}>
              <div className="bg-[#1D2350]/60 backdrop-blur-md p-5 rounded-lg border-l-4 border-[#FFC303]">
                <p className="text-base md:text-lg text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>
                  This is just Chapter One of their leadership story. Thank you for writing it with them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 10: THE HERO CLOSER */}
        <section className="slide-container flex-shrink-0 flex flex-col overflow-hidden snap-center group bg-[#1D2350] border-white/10 border relative shadow-2xl justify-between rounded-xl">
          <div className="absolute inset-0 z-0">
            <img src="/images/sea-cadets/group-salute.jpg" className="w-full h-full object-cover opacity-50" alt="" />
            <div className="absolute inset-0 bg-[#1D2350]/80" />
          </div>

          <div className="flex flex-col z-10 p-6 md:p-10 relative h-full justify-center items-center text-center">
            <div className="mb-8 animate-on-scroll" style={{ animation: 'animationIn 0.8s ease-out 0.1s both' }}>
              <img src={logoUrl} alt={`${orgName} Logo`} className="h-16 w-auto object-contain mx-auto mb-6 opacity-90" />
            </div>

            <h1
              className="text-5xl md:text-7xl text-white uppercase tracking-wide mb-4 animate-on-scroll"
              style={{ fontFamily: "'Liberator', 'Oswald', sans-serif", animation: 'animationIn 0.8s ease-out 0.3s both' }}
            >
              Thank You, <br /><span className="text-[#FFC303]">{donorName}.</span>
            </h1>

            <p className="text-neutral-300 text-lg italic mb-8 animate-on-scroll" style={{ fontFamily: "'Roboto Slab', serif", animation: 'animationIn 0.8s ease-out 0.5s both' }}>
              You are their hero.
            </p>

            <div className="animate-on-scroll flex flex-col sm:flex-row gap-3" style={{ animation: 'animationIn 0.8s ease-out 0.7s both' }}>
              <a href="https://www.seacadets.org/donate-now" className="px-6 py-3 bg-[#F2C75C] rounded-full text-xs font-bold uppercase tracking-widest text-[#001530] hover:bg-[#C69214] transition-colors">
                Make A Recurring Gift
              </a>
              <button onClick={() => setShareModalOpen(true)} className="px-6 py-3 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-[#001530] transition-colors">
                Share This Story
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Share Modal */}
      <div className={`share-modal fixed inset-0 z-[100] flex items-center justify-center p-4 ${shareModalOpen ? 'active' : ''}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShareModalOpen(false)} />
        <div className="share-modal-content bg-[#002654] border border-white/20 rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl uppercase tracking-wide" style={{ fontFamily: "'Liberator', 'Oswald', sans-serif" }}>Share This Story</h3>
            <button onClick={() => setShareModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Text/SMS */}
            <a href={`sms:?body=Check%20out%20how%20my%20gift%20to%20${encodeURIComponent(orgName)}%20made%20a%20difference!`} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Text</span>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/sharer/sharer.php?quote=I%20just%20helped%20a%20Sea%20Cadet%20get%20their%20gear!" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Facebook</span>
            </a>

            {/* Email */}
            <a href={`mailto:?subject=I%20Made%20a%20Difference%20for%20a%20Sea%20Cadet&body=I%20just%20helped%20a%20young%20person%20join%20${encodeURIComponent(orgName)}%20by%20providing%20their%20Sea%20Bag.%20Check%20out%20my%20impact!`} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#EA4335] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Email</span>
            </a>

            {/* Copy Link */}
            <button onClick={copyLink} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#F2C75C] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <span className="text-white text-sm font-medium">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
