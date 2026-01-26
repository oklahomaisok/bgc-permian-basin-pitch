'use client';

export function FilmGrain() {
  return (
    <div
      className="film-grain fixed inset-0 pointer-events-none z-[9999] mix-blend-overlay"
      style={{
        opacity: 'var(--film-grain-opacity, 0.12)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
