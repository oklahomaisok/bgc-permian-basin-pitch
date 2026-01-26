import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3DF]">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-extrabold text-[#020202] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#020202] mb-4 uppercase">
          Deck Not Found
        </h2>
        <p className="text-lg text-[#020202]/70 mb-8">
          The deck you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-8 bg-[#C54E32] text-white rounded-full font-bold uppercase tracking-wide hover:brightness-110 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
