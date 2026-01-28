'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Types for the collected data
interface OnboardingData {
  // Organization
  orgName: string;
  orgWebsite: string;
  orgMission: string;

  // Branding
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Donor
  donorFirstName: string;
  donorLastName: string;
  donorEmail: string;
  giftAmount: string;
  giftDate: string;

  // Impact Story
  impactHeadline: string;
  impactStory: string;
  impactStats: string;

  // Assets
  heroImageUrl: string;
  impactImageUrl: string;
  teamImageUrl: string;
}

const initialData: OnboardingData = {
  orgName: '',
  orgWebsite: '',
  orgMission: '',
  logoUrl: '',
  primaryColor: '#1D2350',
  secondaryColor: '#FFC303',
  accentColor: '#FFC303',
  donorFirstName: '',
  donorLastName: '',
  donorEmail: '',
  giftAmount: '',
  giftDate: '',
  impactHeadline: '',
  impactStory: '',
  impactStats: '',
  heroImageUrl: '',
  impactImageUrl: '',
  teamImageUrl: '',
};

const STEPS = [
  { id: 1, name: 'Welcome', description: 'Let\'s get started' },
  { id: 2, name: 'Organization', description: 'Tell us about you' },
  { id: 3, name: 'Branding', description: 'Your visual identity' },
  { id: 4, name: 'Donor', description: 'Who are we thanking?' },
  { id: 5, name: 'Story', description: 'The impact they made' },
  { id: 6, name: 'Assets', description: 'Photos & media' },
  { id: 7, name: 'Review', description: 'Ready to build' },
];

// Scraping status messages
const SCRAPING_MESSAGES = [
  { text: 'Connecting to website...', icon: '🌐' },
  { text: 'Rendering the page...', icon: '📸' },
  { text: 'Searching for your logo...', icon: '🔍' },
  { text: 'Analyzing visual colors...', icon: '🎨' },
  { text: 'Extracting color palette...', icon: '✨' },
  { text: 'Finding button colors...', icon: '🖌️' },
  { text: 'Reading your mission...', icon: '📖' },
  { text: 'Almost there...', icon: '🎯' },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingMessageIndex, setScrapingMessageIndex] = useState(0);
  const [scrapingComplete, setScrapingComplete] = useState(false);
  const [websiteInputTimer, setWebsiteInputTimer] = useState<NodeJS.Timeout | null>(null);
  const [colorsFound, setColorsFound] = useState<string[]>([]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || step === currentStep + 1) {
      setCurrentStep(step);
    }
  };

  // Rotate through scraping messages
  useEffect(() => {
    if (!isScraping) return;
    const interval = setInterval(() => {
      setScrapingMessageIndex((prev) => (prev + 1) % SCRAPING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isScraping]);

  // Auto-scrape when website URL is entered
  const handleScrapeBrand = useCallback(async (url: string) => {
    if (!url || url.length < 5) return;

    setIsScraping(true);
    setScrapingComplete(false);
    setScrapingMessageIndex(0);

    try {
      const response = await fetch('/api/scrape-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      updateData({
        logoUrl: result.logo || '',
        primaryColor: result.primaryColor || '#1D2350',
        secondaryColor: result.secondaryColor || '#FFC303',
        accentColor: result.accentColor || '#FFC303',
        orgName: data.orgName || result.orgName || '',
      });

      setColorsFound(result.colorsFound || []);
      setScrapingComplete(true);
    } catch (error) {
      console.error('Failed to scrape brand:', error);
    } finally {
      setIsScraping(false);
    }
  }, [data.orgName]);

  // Debounced website input handler
  const handleWebsiteChange = (value: string) => {
    updateData({ orgWebsite: value });

    if (websiteInputTimer) {
      clearTimeout(websiteInputTimer);
    }

    if (value.length > 5) {
      const timer = setTimeout(() => {
        handleScrapeBrand(value);
      }, 1000);
      setWebsiteInputTimer(timer);
    }
  };

  // Export data as JSON for Gemini
  const exportData = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.orgName.toLowerCase().replace(/\s+/g, '-') || 'deck'}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy data to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Scraping Overlay */}
      {isScraping && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md">
          <div className="text-center max-w-md px-6">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-400/30 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 rounded-full border-4 border-amber-400/40 animate-ping" style={{ animationDelay: '0.4s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">{SCRAPING_MESSAGES[scrapingMessageIndex].icon}</span>
              </div>
            </div>
            <div className="h-8 flex items-center justify-center">
              <p className="text-xl text-white font-medium animate-pulse">
                {SCRAPING_MESSAGES[scrapingMessageIndex].text}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {SCRAPING_MESSAGES.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i <= scrapingMessageIndex % 5 ? 'bg-amber-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/40 text-sm mt-6">Analyzing {data.orgWebsite}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl">DonorSpark</span>
          </Link>
          <div className="text-white/60 text-sm">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center space-y-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Let&apos;s create something<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">your donors will love</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-lg mx-auto">
                  We&apos;ll gather everything needed to build a personalized thank-you deck that shows donors the real impact of their generosity.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left max-w-md mx-auto">
                <h3 className="text-white font-semibold mb-4">What we&apos;ll collect:</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm">1</span>
                    Your organization details & branding
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm">2</span>
                    Donor information
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm">3</span>
                    Your impact story & stats
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm">4</span>
                    Photos & visual assets
                  </li>
                </ul>
              </div>

              <button
                onClick={nextStep}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {/* Step 2: Organization */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Tell us about your organization</h2>
                <p className="text-slate-400">We&apos;ll use this to personalize your deck.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={data.orgName}
                    onChange={(e) => updateData({ orgName: e.target.value })}
                    placeholder="e.g., Boys & Girls Club of the Permian Basin"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Website URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={data.orgWebsite}
                      onChange={(e) => handleWebsiteChange(e.target.value)}
                      placeholder="yournonprofit.org"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent pr-12"
                    />
                    {scrapingComplete && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    We&apos;ll automatically detect your logo and brand colors
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mission Statement</label>
                  <textarea
                    value={data.orgMission}
                    onChange={(e) => updateData({ orgMission: e.target.value })}
                    placeholder="What is your organization's mission? What change do you seek to create?"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="px-6 py-3 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.orgName}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Your brand identity</h2>
                <p className="text-slate-400">These colors and logo will be used throughout your deck.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Logo URL</label>
                  <div className="flex items-center gap-4">
                    {data.logoUrl && (
                      <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                        <img src={data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <input
                      type="url"
                      value={data.logoUrl}
                      onChange={(e) => updateData({ logoUrl: e.target.value })}
                      placeholder="https://yoursite.com/logo.png"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.primaryColor}
                        onChange={(e) => updateData({ primaryColor: e.target.value })}
                        className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent"
                      />
                      <input
                        type="text"
                        value={data.primaryColor}
                        onChange={(e) => updateData({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.secondaryColor}
                        onChange={(e) => updateData({ secondaryColor: e.target.value })}
                        className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent"
                      />
                      <input
                        type="text"
                        value={data.secondaryColor}
                        onChange={(e) => updateData({ secondaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.accentColor}
                        onChange={(e) => updateData({ accentColor: e.target.value })}
                        className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent"
                      />
                      <input
                        type="text"
                        value={data.accentColor}
                        onChange={(e) => updateData({ accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Detected Colors */}
                {colorsFound.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-3">Detected from your website (click to apply):</p>
                    <div className="flex flex-wrap gap-2">
                      {colorsFound.map((colorInfo, index) => {
                        const hex = colorInfo.split(' ')[0];
                        const label = colorInfo.includes('(') ? colorInfo.match(/\(([^)]+)\)/)?.[1] : '';
                        return (
                          <div key={index} className="group relative">
                            <div
                              className="w-10 h-10 rounded-lg shadow-inner border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: hex }}
                              onClick={() => updateData({ primaryColor: hex })}
                              title={`${hex} - ${label}`}
                            />
                            <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => updateData({ primaryColor: hex })}
                                className="text-[8px] bg-white/30 hover:bg-white/50 px-1 rounded text-white"
                              >
                                P
                              </button>
                              <button
                                onClick={() => updateData({ secondaryColor: hex })}
                                className="text-[8px] bg-white/30 hover:bg-white/50 px-1 rounded text-white"
                              >
                                S
                              </button>
                              <button
                                onClick={() => updateData({ accentColor: hex })}
                                className="text-[8px] bg-white/30 hover:bg-white/50 px-1 rounded text-white"
                              >
                                A
                              </button>
                            </div>
                            {label && (
                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-white/40 whitespace-nowrap">
                                {label}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="px-6 py-3 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Donor */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Who are we thanking?</h2>
                <p className="text-slate-400">Tell us about the donor who made this impact possible.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">First Name *</label>
                    <input
                      type="text"
                      value={data.donorFirstName}
                      onChange={(e) => updateData({ donorFirstName: e.target.value })}
                      placeholder="Sarah"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      value={data.donorLastName}
                      onChange={(e) => updateData({ donorLastName: e.target.value })}
                      placeholder="Johnson"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email (optional)</label>
                  <input
                    type="email"
                    value={data.donorEmail}
                    onChange={(e) => updateData({ donorEmail: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Gift Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                      <input
                        type="text"
                        value={data.giftAmount}
                        onChange={(e) => updateData({ giftAmount: e.target.value })}
                        placeholder="250"
                        className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Gift Date</label>
                    <input
                      type="date"
                      value={data.giftDate}
                      onChange={(e) => updateData({ giftDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="px-6 py-3 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.donorFirstName}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Story */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Tell the impact story</h2>
                <p className="text-slate-400">How did this donation make a difference?</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Impact Headline *</label>
                  <input
                    type="text"
                    value={data.impactHeadline}
                    onChange={(e) => updateData({ impactHeadline: e.target.value })}
                    placeholder="e.g., Gave a child a safe place to learn"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-2">This appears after &quot;{data.donorFirstName || 'Donor'}, you just...&quot;</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Impact Story</label>
                  <textarea
                    value={data.impactStory}
                    onChange={(e) => updateData({ impactStory: e.target.value })}
                    placeholder="Describe the specific impact their donation made. Be specific and emotional - paint a picture of the change they created."
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Key Stats (optional)</label>
                  <textarea
                    value={data.impactStats}
                    onChange={(e) => updateData({ impactStats: e.target.value })}
                    placeholder="e.g., 150 meals served, 12 children tutored, 500 hours of mentorship provided"
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">Numbers and specific outcomes help make impact tangible</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="px-6 py-3 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.impactHeadline}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Assets */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Add visual assets</h2>
                <p className="text-slate-400">Photos make your story come alive. Add URLs to images you&apos;d like to include.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Hero Image</label>
                  <p className="text-xs text-slate-500 mb-2">A striking image for the opening slide (ideally showing your mission in action)</p>
                  <div className="flex items-center gap-4">
                    {data.heroImageUrl && (
                      <div className="w-24 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={data.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="url"
                      value={data.heroImageUrl}
                      onChange={(e) => updateData({ heroImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Impact Image</label>
                  <p className="text-xs text-slate-500 mb-2">A photo showing the direct impact of donations (beneficiaries, programs, etc.)</p>
                  <div className="flex items-center gap-4">
                    {data.impactImageUrl && (
                      <div className="w-24 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={data.impactImageUrl} alt="Impact" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="url"
                      value={data.impactImageUrl}
                      onChange={(e) => updateData({ impactImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Team/Community Image (optional)</label>
                  <p className="text-xs text-slate-500 mb-2">A photo of your team, volunteers, or community</p>
                  <div className="flex items-center gap-4">
                    {data.teamImageUrl && (
                      <div className="w-24 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={data.teamImageUrl} alt="Team" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="url"
                      value={data.teamImageUrl}
                      onChange={(e) => updateData({ teamImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="px-6 py-3 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Review
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Ready to build!</h2>
                <p className="text-slate-400">Here&apos;s everything we&apos;ve collected for your deck.</p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                {/* Organization */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-xs">1</span>
                      Organization
                    </h3>
                    <button onClick={() => goToStep(2)} className="text-amber-400 text-sm hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/40">Name:</span>
                      <span className="text-white ml-2">{data.orgName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Website:</span>
                      <span className="text-white ml-2">{data.orgWebsite || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-xs">2</span>
                      Branding
                    </h3>
                    <button onClick={() => goToStep(3)} className="text-amber-400 text-sm hover:underline">Edit</button>
                  </div>
                  <div className="flex items-center gap-4">
                    {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-10 w-auto object-contain bg-white/10 rounded p-1" />}
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg border border-white/20" style={{ backgroundColor: data.primaryColor }} title={data.primaryColor} />
                      <div className="w-8 h-8 rounded-lg border border-white/20" style={{ backgroundColor: data.secondaryColor }} title={data.secondaryColor} />
                      <div className="w-8 h-8 rounded-lg border border-white/20" style={{ backgroundColor: data.accentColor }} title={data.accentColor} />
                    </div>
                  </div>
                </div>

                {/* Donor */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-xs">3</span>
                      Donor
                    </h3>
                    <button onClick={() => goToStep(4)} className="text-amber-400 text-sm hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/40">Name:</span>
                      <span className="text-white ml-2">{data.donorFirstName} {data.donorLastName}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Gift:</span>
                      <span className="text-white ml-2">{data.giftAmount ? `$${data.giftAmount}` : '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-xs">4</span>
                      Impact Story
                    </h3>
                    <button onClick={() => goToStep(5)} className="text-amber-400 text-sm hover:underline">Edit</button>
                  </div>
                  <div className="text-sm">
                    <p className="text-white">&quot;{data.donorFirstName}, you just {data.impactHeadline || '...'}&quot;</p>
                    {data.impactStory && <p className="text-white/60 mt-2 line-clamp-2">{data.impactStory}</p>}
                  </div>
                </div>

                {/* Assets */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-xs">5</span>
                      Assets
                    </h3>
                    <button onClick={() => goToStep(6)} className="text-amber-400 text-sm hover:underline">Edit</button>
                  </div>
                  <div className="flex gap-2">
                    {data.heroImageUrl && (
                      <div className="w-16 h-12 bg-white/10 rounded overflow-hidden">
                        <img src={data.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {data.impactImageUrl && (
                      <div className="w-16 h-12 bg-white/10 rounded overflow-hidden">
                        <img src={data.impactImageUrl} alt="Impact" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {data.teamImageUrl && (
                      <div className="w-16 h-12 bg-white/10 rounded overflow-hidden">
                        <img src={data.teamImageUrl} alt="Team" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {!data.heroImageUrl && !data.impactImageUrl && !data.teamImageUrl && (
                      <span className="text-white/40 text-sm">No images added</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Export Actions */}
              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                  Copy Data to Clipboard
                </button>

                <button
                  onClick={exportData}
                  className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                  Download as JSON
                </button>
              </div>

              {/* JSON Preview */}
              <div className="bg-slate-950 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Data for Gemini</span>
                </div>
                <pre className="text-xs text-slate-400 overflow-auto max-h-48 font-mono">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="px-6 py-3 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Step Navigation Dots (Mobile) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-2 md:hidden">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => goToStep(step.id)}
            disabled={step.id > currentStep + 1}
            className={`w-2 h-2 rounded-full transition-all ${
              step.id === currentStep
                ? 'w-6 bg-amber-400'
                : step.id < currentStep
                ? 'bg-amber-400/50'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
