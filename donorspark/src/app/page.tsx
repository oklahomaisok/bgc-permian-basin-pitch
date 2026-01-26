import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#15193b]">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-6xl font-extrabold text-white mb-4">
          Donor<span className="text-[#FFC303]">Spark</span>
        </h1>
        <p className="text-xl text-white/70 mb-8">
          Personalized donor impact decks that inspire giving
        </p>

        <div className="space-y-4 mb-8">
          <Link
            href="/sea-cadets/thank-you-john"
            className="inline-block w-full py-4 px-8 bg-[#FFC303] text-[#1D2350] rounded-full font-bold uppercase tracking-wide hover:brightness-110 transition-all shadow-lg"
          >
            View Thank You Deck
          </Link>
          <p className="text-sm text-white/50">
            Personalized donor thank you (Sea Cadets)
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/sea-cadets/impact-story"
            className="inline-block w-full py-4 px-8 bg-transparent border-2 border-[#FFC303] text-[#FFC303] rounded-full font-bold uppercase tracking-wide hover:bg-[#FFC303]/10 transition-all"
          >
            View Impact Story Deck
          </Link>
          <p className="text-sm text-white/50">
            Organization impact overview (Sea Cadets)
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <h2 className="text-lg font-bold uppercase mb-4 text-white">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-bold mb-1 text-[#FFC303]">Custom Themes</h3>
              <p className="text-white/70">Organization-specific branding</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold mb-1 text-[#FFC303]">Personalization</h3>
              <p className="text-white/70">Merge tags for donor names</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold mb-1 text-[#FFC303]">Impact Stories</h3>
              <p className="text-white/70">Animated stats and testimonials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
