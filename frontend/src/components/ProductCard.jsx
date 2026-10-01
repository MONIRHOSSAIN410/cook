import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Heart, Star, Eye, Boxes } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice.js";
import { toggleWishlist } from "../redux/slices/wishlistSlice.js";
import { productImage, productSrcSet, productFallback } from "../data/catalog.js";
import { money } from "../data/site.js";

/**
 * Fades in as it scrolls into view; on hover the whole card scales up and
 * lifts above its neighbours, revealing the wishlist / quick-view buttons,
 * the stock pill and a full-width "Add" button.
 */
const cardMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.35, ease: "easeOut" },
  whileHover: { scale: 1.06, y: -6, zIndex: 20 },
  whileTap: { scale: 1.02 },
};

/** Small round action button that slides in from the right on hover. */
function IconAction({ label, onClick, active, children, delay }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{ transitionDelay: `${delay}ms` }}
      className={`translate-x-3 rounded-full p-1.5 opacity-0 shadow-md backdrop-blur
                  transition duration-200 group-hover:translate-x-0 group-hover:opacity-100
                  group-focus-within:translate-x-0 group-focus-within:opacity-100
                  ${
                    active
                      ? "bg-red-500 text-white"
                      : "bg-white/90 text-slate-600 hover:bg-white dark:bg-slate-900/90 dark:text-slate-200"
                  }`}
    >
      {children}
    </button>
  );
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector((s) => s.wishlist.ids);
  const inWishlist = wishlistIds.includes(product._id);

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAdd = (e) => {
    stop(e);
    dispatch(addToCart({ ...product, image: productImage(product, 800), qty: 1 }));
  };

  const handleWishlist = (e) => {
    stop(e);
    dispatch(toggleWishlist(product._id));
  };

  const handleQuickView = (e) => {
    stop(e);
    navigate(`/product/${product.slug}`);
  };

  // Never leave an empty grey box if a picture fails to load.
  const handleImgError = (e) => {
    const fallback = productFallback(product);
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.srcset = "";
      e.currentTarget.src = fallback;
    }
  };

  return (
    <motion.div
      {...cardMotion}
      className="card group relative overflow-hidden transition-shadow duration-300
                 hover:shadow-lift hover:ring-2 hover:ring-brand-500/50"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* zoom-img scales the picture on hover */}
        <div className="zoom-img relative aspect-[4/5] bg-slate-100 dark:bg-slate-800">
          {product.badge && (
            <span className="absolute left-2 top-2 z-10 rounded bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              {product.badge}
            </span>
          )}

          {/* Stock pill — fades in with the rest of the hover state */}
          {product.stock > 0 && (
            <span
              title={`${product.stock} in stock`}
              className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md
                         bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-medium text-white
                         opacity-0 backdrop-blur transition-opacity duration-200
                         group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <Boxes size={11} />
              {product.stock}
            </span>
          )}

          {/* Wishlist + quick view */}
          <div className="absolute right-2 top-10 z-10 flex flex-col gap-2">
            <IconAction
              label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              onClick={handleWishlist}
              active={inWishlist}
              delay={0}
            >
              <Heart size={14} className={inWishlist ? "fill-current" : ""} />
            </IconAction>

            <IconAction label="Quick view" onClick={handleQuickView} delay={60}>
              <Eye size={14} />
            </IconAction>
          </div>

          <img
            src={productImage(product, 800)}
            srcSet={productSrcSet(product)}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            onError={handleImgError}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Soft shade so the Add button stays readable over any picture */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t
                       from-slate-950/55 to-transparent opacity-0 transition-opacity duration-300
                       group-hover:opacity-100 group-focus-within:opacity-100"
          />
        </div>

        <div className="p-3">
          <h3 className="truncate text-sm font-medium">{product.name}</h3>

          {product.rating > 0 && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-amber-500">
              <Star size={12} className="fill-amber-500" />
              {product.rating.toFixed(1)}
            </div>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-x-2">
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {money(product.price)}
            </span>
            {product.oldPrice > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {money(product.oldPrice)}
                </span>
                <span className="text-xs text-red-500">-{product.discountPercent}%</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Collapsed to a "+" circle, grows into a wide "Add" pill on hover */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className="absolute bottom-3 right-3 z-10 flex items-center gap-1 overflow-hidden
                   rounded-full bg-brand-600 px-2 py-2 text-sm font-medium text-white shadow-md
                   transition-all duration-300 hover:bg-brand-700 group-hover:px-3.5
                   group-focus-within:px-3.5"
      >
        <Plus size={16} className="shrink-0" />
        <span
          className="max-w-0 whitespace-nowrap opacity-0 transition-all duration-300
                     group-hover:max-w-[4rem] group-hover:opacity-100
                     group-focus-within:max-w-[4rem] group-focus-within:opacity-100"
        >
          Add
        </span>
      </motion.button>
    </motion.div>
  );
}
