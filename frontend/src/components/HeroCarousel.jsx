import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "../data/catalog.js";

const AUTOPLAY_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (step) => setIndex((i) => (i + step + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [go, paused]);

  const slide = HERO_SLIDES[index];

  return (
    <div
      className="relative h-56 overflow-hidden rounded-2xl shadow-card sm:h-72 lg:h-[26rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
            decoding="async"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.tint}`} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <motion.div
          key={`copy-${index}`}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-md p-5 text-white sm:p-8 lg:p-12"
        >
          <h1 className="text-2xl font-bold leading-tight drop-shadow sm:text-3xl lg:text-4xl">
            {slide.title}
          </h1>
          <p className="mt-2 text-sm text-white/85 sm:text-base">{slide.subtitle}</p>
          <Link
            to={slide.to}
            className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium
                       text-slate-900 transition-colors hover:bg-slate-100 sm:px-5"
          >
            {slide.cta}
          </Link>
        </motion.div>
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2
                   text-white backdrop-blur transition hover:bg-black/55 sm:left-4"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2
                   text-white backdrop-blur transition hover:bg-black/55 sm:right-4"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
