import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

import HeroCarousel from "../components/HeroCarousel.jsx";
import InfiniteMarquee from "../components/InfiniteMarquee.jsx";
import FeaturedCategories from "../components/FeaturedCategories.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { HERO_TILES } from "../data/catalog.js";
import { SITE } from "../data/site.js";

const PERKS = [
  { icon: Truck, title: "Nationwide delivery", text: "Inside Dhaka in 1–2 days" },
  { icon: ShieldCheck, title: "Authentic products", text: "Checked before dispatch" },
  { icon: RefreshCw, title: "Easy returns", text: "7-day return policy" },
  { icon: Headphones, title: "Hotline support", text: SITE.phones.join(" · ") },
];

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const trending = useMemo(() => items.filter((p) => p.isTrending), [items]);
  const marqueeItems = trending.length ? trending : items;
  const bestSellers = useMemo(() => items.filter((p) => p.isBestSeller), [items]);
  const newArrivals = useMemo(() => items.filter((p) => p.isNewArrival), [items]);
  const deals = useMemo(
    () =>
      items
        .filter((p) => p.oldPrice > 0)
        .slice()
        .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0)),
    [items]
  );

  return (
    <div className="pb-16">
      {/* 1. Hero + two promo tiles beside it */}
      <section className="container-app mt-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HeroCarousel />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:h-[26rem] lg:grid-cols-1 lg:grid-rows-2">
            {HERO_TILES.map((tile) => (
              <Link
                key={tile.label}
                to={tile.to}
                className="group relative h-40 overflow-hidden rounded-2xl shadow-card sm:h-48 lg:h-full"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <span className="absolute left-3 top-3 rounded bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                  AD
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-semibold drop-shadow">{tile.label}</p>
                  <p className="text-xs text-white/85">{tile.caption}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Why shop with us */}
      <section className="container-app mt-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card flex items-start gap-3 p-4"
            >
              <perk.icon size={20} className="mt-0.5 shrink-0 text-brand-600" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{perk.title}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{perk.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Category — nonstop carousel */}
      <FeaturedCategories />

      {/* 4. Trending — nonstop carousel */}
      {marqueeItems.length > 0 && (
        <section className="mt-6">
          <div className="container-app">
            <SectionHeader title="Trending now" subtitle="Moving fast this week" viewAllTo="/shop" />
          </div>
          <InfiniteMarquee className="px-4 sm:px-6 lg:px-8">
            {marqueeItems.map((p) => (
              <div key={p._id} className="w-40 shrink-0 sm:w-48">
                <ProductCard product={p} />
              </div>
            ))}
          </InfiniteMarquee>
        </section>
      )}


      {deals.length > 0 && (
        <section className="container-app mt-10">
          <SectionHeader
            title="Best deals"
            subtitle="Maximum savings, minimum price"
            viewAllTo="/shop?sort=price_asc"
          />
          <ProductGrid products={deals.slice(0, 5)} />
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="container-app mt-10">
          <SectionHeader
            title="Best sellers"
            subtitle="Our most popular products right now"
            viewAllTo="/shop?badge=best"
          />
          <ProductGrid products={bestSellers} />
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="container-app mt-10">
          <SectionHeader
            title="New arrivals"
            subtitle="Fresh additions to the collection"
            viewAllTo="/shop?badge=new"
          />
          <ProductGrid products={newArrivals} />
        </section>
      )}

      <section className="container-app mt-10">
        <SectionHeader
          title="Recommended for you"
          subtitle="Handpicked from every category"
          viewAllTo="/shop"
        />
        <ProductGrid products={items.slice(0, 10)} />
      </section>

      {loading && !items.length && (
        <p className="container-app mt-10 text-center text-sm text-slate-500">
          Loading products…
        </p>
      )}
    </div>
  );
}
