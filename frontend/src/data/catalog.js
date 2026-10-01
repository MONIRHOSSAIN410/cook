/**
 * The storefront's picture catalogue and offline product data.
 *
 * Every image the shop shows is declared here once, so a product looks the
 * same on the home page, the shop grid, the category page and the receipt.
 * The list also doubles as an offline catalogue: if the API is unreachable or
 * the database has not been seeded, `src/api/axios.js` serves this instead so
 * the shop is never empty and no card is ever missing its picture.
 */

const unsplash = (id, w) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=90&w=${w}`;

/** Widths handed to the browser through srcSet. */
export const IMAGE_WIDTHS = [400, 800, 1200, 1600];

/** slug -> photo id. The single source of truth for product pictures. */
export const PRODUCT_PHOTOS = {
  "classic-white-sneakers": "1542291026-7eec264c27ff",
  "classic-cotton-t-shirt": "1521572163474-6864f9cf17ab",
  "leather-crossbody-bag": "1584917865442-de89df76afd3",
  "premium-sunglasses": "1511499767150-a48a237f0083",
  "slim-fit-denim-jeans": "1541099649105-f69ad21f3246",
  "formal-polo-shirt": "1489987707025-afc232f7ea0f",
  "mens-leather-jacket": "1551028719-00167b16eac5",
  "floral-summer-dress": "1595777457583-95e059d581b8",
  "elegant-saree-collection": "1610030469983-98e550d6193c",
  "womens-casual-blazer": "1591369822096-ffd140ec948f",
  "kids-hoodie": "1503341504253-dff4815485f1",
  "kids-graphic-t-shirt-pack": "1622290291468-a28f7a7dc6a8",
};

const placeholder = (name = "CookMe") =>
  `https://placehold.co/1200x1500/e2e8f0/475569?text=${encodeURIComponent(name)}`;

/** The HD picture for a product. Catalogue first, then whatever the API sent. */
export function productImage(product, width = 1200) {
  if (!product) return placeholder();
  const id = PRODUCT_PHOTOS[product.slug];
  if (id) return unsplash(id, width);
  if (product.image?.startsWith("http")) return product.image;
  return placeholder(product.name);
}

/** Responsive srcSet so phones download a small file and desktops a sharp one. */
export function productSrcSet(product) {
  if (!product || !PRODUCT_PHOTOS[product.slug]) return undefined;
  return IMAGE_WIDTHS.map((w) => `${productImage(product, w)} ${w}w`).join(", ");
}

/** Last resort for <img onError> so a card never shows an empty grey box. */
export function productFallback(product) {
  return placeholder(product?.name);
}

/* ------------------------------------------------------------------ *
 * Categories
 * ------------------------------------------------------------------ */

export const CATEGORIES = [
  { _id: "cat-men", name: "Men", slug: "men", icon: "👔", photo: PRODUCT_PHOTOS["formal-polo-shirt"] },
  { _id: "cat-women", name: "Women", slug: "women", icon: "👗", photo: PRODUCT_PHOTOS["floral-summer-dress"] },
  { _id: "cat-kids", name: "Kids", slug: "kids", icon: "🧒", photo: PRODUCT_PHOTOS["kids-hoodie"] },
  { _id: "cat-footwear", name: "Footwear", slug: "footwear", icon: "👟", photo: PRODUCT_PHOTOS["classic-white-sneakers"] },
  { _id: "cat-accessories", name: "Accessories", slug: "accessories", icon: "👜", photo: PRODUCT_PHOTOS["leather-crossbody-bag"] },
].map((c) => ({ ...c, image: unsplash(c.photo, 1200) }));

const cat = (slug) => {
  const c = CATEGORIES.find((x) => x.slug === slug);
  return { _id: c._id, name: c.name, slug: c.slug, icon: c.icon };
};

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

const seed = [
  { slug: "classic-white-sneakers", name: "Classic White Sneakers", category: "footwear", price: 2490, oldPrice: 3000, badge: "SALE", rating: 4.5, isBestSeller: true, isTrending: true, isFlashSale: true, description: "Everyday comfort sneakers with a clean silhouette and cushioned sole." },
  { slug: "classic-cotton-t-shirt", name: "Classic Cotton T-Shirt", category: "men", price: 890, oldPrice: 1100, badge: "SALE", rating: 4.2, isBestSeller: true, isFeatured: true, description: "Soft breathable cotton tee that keeps its shape wash after wash." },
  { slug: "leather-crossbody-bag", name: "Leather Crossbody Bag", category: "accessories", price: 1890, rating: 4.6, isTrending: true, isFeatured: true, description: "Premium leather crossbody bag with gold hardware and a roomy interior." },
  { slug: "premium-sunglasses", name: "Premium Sunglasses", category: "accessories", price: 1290, oldPrice: 1600, badge: "OFFER", rating: 4.3, isFlashSale: true, isTrending: true, isFeatured: true, description: "UV-protected round-frame sunglasses with a lightweight metal body." },
  { slug: "slim-fit-denim-jeans", name: "Slim Fit Denim Jeans", category: "men", price: 1890, oldPrice: 2200, badge: "OFFER", rating: 4.1, isFlashSale: true, isFeatured: true, description: "Slim tapered denim with just enough stretch for all-day comfort." },
  { slug: "formal-polo-shirt", name: "Formal Polo Shirt", category: "men", price: 1150, rating: 4.0, description: "Smart-casual polo shirt that works at the office and on weekends." },
  { slug: "mens-leather-jacket", name: "Men's Leather Jacket", category: "men", price: 5490, oldPrice: 6200, badge: "NEW", rating: 4.7, isNewArrival: true, isFeatured: true, description: "Genuine leather biker jacket with quilted lining and antique zips." },
  { slug: "floral-summer-dress", name: "Floral Summer Dress", category: "women", price: 2450, badge: "NEW", rating: 4.4, isNewArrival: true, isTrending: true, description: "Flowy floral dress in a breathable weave — made for warm days." },
  { slug: "elegant-saree-collection", name: "Elegant Saree Collection", category: "women", price: 3200, oldPrice: 4000, badge: "NEW", rating: 4.8, isBestSeller: true, isFlashSale: true, description: "Handwoven traditional saree with rich detailing and a matching blouse piece." },
  { slug: "womens-casual-blazer", name: "Women's Casual Blazer", category: "women", price: 2890, rating: 4.2, isNewArrival: true, description: "Tailored casual blazer that sharpens up any everyday outfit." },
  { slug: "kids-hoodie", name: "Kids Hoodie", category: "kids", price: 1290, rating: 4.0, isNewArrival: true, isTrending: true, description: "Warm cosy hoodie with a soft brushed inside — perfect for school runs." },
  { slug: "kids-graphic-t-shirt-pack", name: "Kids Graphic T-Shirt Pack", category: "kids", price: 990, oldPrice: 1200, badge: "SALE", rating: 4.1, isFlashSale: true, isTrending: true, description: "Fun printed tees for everyday school and play wear. Pack of two." },
];

export const PRODUCTS = seed.map((p, i) => ({
  _id: `cm-${p.slug}`,
  name: p.name,
  slug: p.slug,
  description: p.description,
  category: cat(p.category),
  price: p.price,
  oldPrice: p.oldPrice || 0,
  discountPercent: p.oldPrice
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0,
  image: unsplash(PRODUCT_PHOTOS[p.slug], 1600),
  images: [unsplash(PRODUCT_PHOTOS[p.slug], 1600)],
  badge: p.badge || "",
  rating: p.rating || 0,
  numReviews: 0,
  reviews: [],
  stock: 50,
  isFlashSale: !!p.isFlashSale,
  isBestSeller: !!p.isBestSeller,
  isNewArrival: !!p.isNewArrival,
  isTrending: !!p.isTrending,
  isFeatured: !!p.isFeatured,
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}));

/** The same filtering and sorting the API does, applied locally. */
export function filterProducts(params = {}) {
  const { category, keyword, minPrice, maxPrice, minRating, sort, badge, inStock, limit } = params;
  let list = PRODUCTS.slice();

  if (category) list = list.filter((p) => p.category?.slug === String(category).toLowerCase());
  if (keyword) {
    const k = String(keyword).toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(k) || p.description.toLowerCase().includes(k)
    );
  }
  if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
  if (minRating) list = list.filter((p) => p.rating >= Number(minRating));
  if (badge === "flash") list = list.filter((p) => p.isFlashSale);
  if (badge === "best") list = list.filter((p) => p.isBestSeller);
  if (badge === "new") list = list.filter((p) => p.isNewArrival);
  if (badge === "trending") list = list.filter((p) => p.isTrending);
  if (badge === "featured") list = list.filter((p) => p.isFeatured);
  // "offer" is every product that is cheaper than its original price.
  if (badge === "offer") list = list.filter((p) => p.oldPrice > 0);
  if (inStock === true || inStock === "true") list = list.filter((p) => p.stock > 0);

  if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating_desc") list.sort((a, b) => b.rating - a.rating);
  else if (sort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));

  return limit ? list.slice(0, Number(limit)) : list;
}

export function findProduct(idOrSlug) {
  const product = PRODUCTS.find((p) => p.slug === idOrSlug || p._id === idOrSlug);
  if (!product) return null;
  const related = PRODUCTS.filter(
    (p) => p.category?.slug === product.category?.slug && p._id !== product._id
  ).slice(0, 6);
  return { product, related };
}

/* ------------------------------------------------------------------ *
 * Hero slides
 * ------------------------------------------------------------------ */

/**
 * The two small promo tiles that sit beside the hero carousel on desktop.
 */
export const HERO_TILES = [
  {
    label: "Everyday Basics",
    caption: "Cotton tees from ৳890",
    to: "/category/men",
    image: unsplash(PRODUCT_PHOTOS["classic-cotton-t-shirt"], 1200),
  },
  {
    label: "Party Ready",
    caption: "Dresses & sarees",
    to: "/category/women",
    image: unsplash(PRODUCT_PHOTOS["elegant-saree-collection"], 1200),
  },
];

export const HERO_SLIDES = [
  {
    title: "Fresh Picks, Ready To Go",
    subtitle: "Hand-selected products delivered to your door",
    cta: "Shop the collection",
    to: "/shop",
    image: unsplash(PRODUCT_PHOTOS["floral-summer-dress"], 1600),
    tint: "from-slate-950/90 via-slate-950/45 to-transparent",
  },
  {
    title: "Step Into Comfort",
    subtitle: "Everyday sneakers built to last",
    cta: "Shop footwear",
    to: "/category/footwear",
    image: unsplash(PRODUCT_PHOTOS["classic-white-sneakers"], 1600),
    tint: "from-brand-900/90 via-brand-900/45 to-transparent",
  },
  {
    title: "New Season Essentials",
    subtitle: "Layer up with our latest arrivals",
    cta: "Shop new in",
    to: "/shop?badge=new",
    image: unsplash(PRODUCT_PHOTOS["mens-leather-jacket"], 1600),
    tint: "from-slate-950/90 via-slate-900/45 to-transparent",
  },
];
