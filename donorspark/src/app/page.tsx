'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl">DonorSpark</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sea-cadets/thank-you-john" className="text-white/70 hover:text-white transition-colors text-sm font-medium hidden sm:block">
              See Example
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-sm font-medium mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Trusted by 50+ nonprofits
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Donations Into
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lasting Connections
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create personalized, mobile-first impact stories that show donors exactly how their gift made a difference. Build beautiful thank-you decks in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full text-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Create Your First Deck
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/sea-cadets/thank-you-john"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
            >
              See Example
            </Link>
          </div>
        </div>
      </section>

      {/* Phone Mockup Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-amber-400/20 blur-3xl opacity-50" />

            {/* Phone frame */}
            <div className="relative mx-auto w-72 md:w-80">
              <div className="bg-black rounded-[3rem] p-3 shadow-2xl border border-white/10">
                <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  {/* Mock deck preview */}
                  <div className="w-full h-full bg-[#1D2350] flex flex-col">
                    <div className="flex-1 relative">
                      <img
                        src="/images/sea-cadets/cadet-closeup.jpg"
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1D2350] via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold border border-amber-400/30 px-2 py-1 rounded bg-[#1D2350]/80">
                          Your Impact
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-3 leading-tight">
                          Sarah,<br/>You Just<br/>
                          <span className="text-amber-400">Changed a Life.</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Create Impact Stories in Minutes
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Our guided wizard helps you build personalized donor thank-you decks with your branding.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-amber-400 font-bold text-xl">1</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Enter Your Website</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We'll automatically detect your logo, brand colors, and fonts from your website.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-amber-400 font-bold text-xl">2</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Add Donor Details</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Personalize with donor name, gift amount, and the impact their donation made.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-amber-400 font-bold text-xl">3</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Share & Delight</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get a unique link to share via email, text, or social media. Track opens and engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2,500+</div>
              <div className="text-slate-400">Decks Created</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">94%</div>
              <div className="text-slate-400">Open Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">3.2x</div>
              <div className="text-slate-400">More Repeat Donors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Donor Experience?
          </h2>
          <p className="text-slate-400 mb-8">
            Join nonprofits who are building deeper connections with their donors.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full text-lg font-bold hover:opacity-90 transition-opacity"
          >
            Start Creating Free
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <span className="text-white/60 text-sm">DonorSpark</span>
          </div>
          <div className="text-white/40 text-sm">
            Made with care for nonprofits everywhere
          </div>
        </div>
      </footer>
    </div>
  );
}
