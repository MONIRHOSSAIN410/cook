/**
 * Nonstop carousel: the track holds two copies of the children and slides
 * exactly half its width, so the loop is seamless and never stops.
 * Hovering pauses it; users who ask for reduced motion get a normal scroller.
 */
export default function InfiniteMarquee({ children, className = "" }) {
  return (
    <div className={`marquee-pause relative overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max gap-3 sm:gap-4 motion-reduce:animate-none">
        <div className="flex gap-3 sm:gap-4">{children}</div>
        <div className="flex gap-3 sm:gap-4" aria-hidden="true">
          {children}
        </div>
      </div>

      {/* soft fade at both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" />
    </div>
  );
}
