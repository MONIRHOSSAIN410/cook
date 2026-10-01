import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Star, Minus, Plus, Truck, ShieldCheck, Phone } from "lucide-react";

import ProductGrid from "../components/ProductGrid.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { fetchProductDetail } from "../redux/slices/productSlice.js";
import { addToCart } from "../redux/slices/cartSlice.js";
import { productImage, productSrcSet, productFallback } from "../data/catalog.js";
import { SITE, money } from "../data/site.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const { current: product, related, detailLoading, error } = useSelector((s) => s.products);

  useEffect(() => {
    setQty(1);
    dispatch(fetchProductDetail(slug));
  }, [dispatch, slug]);

  if (detailLoading && !product) {
    return <p className="container-app py-20 text-center text-sm text-slate-500">Loading…</p>;
  }

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <p className="mb-4 text-slate-500">{error || "Product not found."}</p>
        <Link to="/shop" className="btn-primary inline-block">Back to shop</Link>
      </div>
    );
  }

  const add = () => dispatch(addToCart({ ...product, image: productImage(product, 800), qty }));
  const buyNow = () => {
    add();
    navigate("/checkout");
  };

  return (
    <div className="container-app py-6">
      <p className="mb-4 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link to={`/category/${product.category?.slug}`} className="capitalize hover:text-brand-600">
          {product.category?.name || product.category?.slug}
        </Link>{" "}
        / {product.name}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="zoom-img card aspect-square overflow-hidden"
        >
          <img
            src={productImage(product, 1600)}
            srcSet={productSrcSet(product)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            onError={(e) => {
              e.currentTarget.srcset = "";
              e.currentTarget.src = productFallback(product);
            }}
            alt={product.name}
            className="h-full w-full object-cover"
            decoding="async"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3 text-sm">
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star size={14} className="fill-amber-500" /> {product.rating.toFixed(1)}
              </span>
            )}
            <span className="text-slate-400">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
              {money(product.price)}
            </span>
            {product.oldPrice > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {money(product.oldPrice)}
                </span>
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                  −{product.discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-slate-500">
              Total <strong className="text-slate-800 dark:text-slate-100">
                {money(product.price * qty)}
              </strong>
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button onClick={buyNow} className="btn-primary flex-1 py-3">Buy now</button>
            <button onClick={add} className="btn-ghost flex-1 py-3">Add to cart</button>
          </div>

          <div className="card mt-6 space-y-3 p-4 text-sm">
            <p className="flex items-center gap-2">
              <Truck size={16} className="text-brand-600" />
              {SITE.delivery.inside.label} {money(SITE.delivery.inside.charge)} ·{" "}
              {SITE.delivery.outside.label} {money(SITE.delivery.outside.charge)}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-600" />
              Cash on delivery available · 7-day returns
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <Phone size={16} className="text-brand-600" />
              Order by phone:{" "}
              {SITE.phones.map((p, i) => (
                <a key={p} href={`tel:${p}`} className="text-brand-600 hover:underline">
                  {p}{i < SITE.phones.length - 1 ? "," : ""}
                </a>
              ))}
            </p>
          </div>
        </motion.div>
      </div>

      {related?.length > 0 && (
        <div className="mt-14">
          <SectionHeader
            title="Related products"
            subtitle={`More from ${product.category?.name || "this category"}`}
            viewAllTo={`/category/${product.category?.slug}`}
          />
          <ProductGrid products={related} columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5" />
        </div>
      )}
    </div>
  );
}
