import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

dotenv.config();

/** Same HD photo set the storefront ships with, so the API and the offline
 *  catalogue always show the exact same picture for a product. */
const hd = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=90&w=${w}`;

const PHOTOS = {
  sneakers: "1542291026-7eec264c27ff",
  tshirt: "1521572163474-6864f9cf17ab",
  bag: "1584917865442-de89df76afd3",
  sunglasses: "1511499767150-a48a237f0083",
  jeans: "1541099649105-f69ad21f3246",
  polo: "1489987707025-afc232f7ea0f",
  jacket: "1551028719-00167b16eac5",
  dress: "1595777457583-95e059d581b8",
  saree: "1610030469983-98e550d6193c",
  blazer: "1591369822096-ffd140ec948f",
  kidsHoodie: "1503341504253-dff4815485f1",
  kidsTshirt: "1622290291468-a28f7a7dc6a8",
};

const categories = [
  { name: "Men", slug: "men", icon: "👔", image: hd(PHOTOS.polo, 1200) },
  { name: "Women", slug: "women", icon: "👗", image: hd(PHOTOS.dress, 1200) },
  { name: "Kids", slug: "kids", icon: "🧒", image: hd(PHOTOS.kidsHoodie, 1200) },
  { name: "Footwear", slug: "footwear", icon: "👟", image: hd(PHOTOS.sneakers, 1200) },
  { name: "Accessories", slug: "accessories", icon: "👜", image: hd(PHOTOS.bag, 1200) },
];

const productSeed = [
  { name: "Classic White Sneakers", slug: "classic-white-sneakers", category: "footwear", price: 2490, oldPrice: 3000, badge: "SALE", rating: 4.5, photo: PHOTOS.sneakers, isBestSeller: true, isTrending: true, isFlashSale: true, description: "Everyday comfort sneakers with a clean silhouette and cushioned sole." },
  { name: "Classic Cotton T-Shirt", slug: "classic-cotton-t-shirt", category: "men", price: 890, oldPrice: 1100, badge: "SALE", rating: 4.2, photo: PHOTOS.tshirt, isBestSeller: true, isFeatured: true, description: "Soft breathable cotton tee that keeps its shape wash after wash." },
  { name: "Leather Crossbody Bag", slug: "leather-crossbody-bag", category: "accessories", price: 1890, rating: 4.6, photo: PHOTOS.bag, isTrending: true, isFeatured: true, description: "Premium leather crossbody bag with gold hardware and a roomy interior." },
  { name: "Premium Sunglasses", slug: "premium-sunglasses", category: "accessories", price: 1290, oldPrice: 1600, badge: "OFFER", rating: 4.3, photo: PHOTOS.sunglasses, isFlashSale: true, isTrending: true, isFeatured: true, description: "UV-protected round-frame sunglasses with a lightweight metal body." },
  { name: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", category: "men", price: 1890, oldPrice: 2200, badge: "OFFER", rating: 4.1, photo: PHOTOS.jeans, isFlashSale: true, isFeatured: true, description: "Slim tapered denim with just enough stretch for all-day comfort." },
  { name: "Formal Polo Shirt", slug: "formal-polo-shirt", category: "men", price: 1150, rating: 4.0, photo: PHOTOS.polo, description: "Smart-casual polo shirt that works at the office and on weekends." },
  { name: "Men's Leather Jacket", slug: "mens-leather-jacket", category: "men", price: 5490, oldPrice: 6200, badge: "NEW", rating: 4.7, photo: PHOTOS.jacket, isNewArrival: true, isFeatured: true, description: "Genuine leather biker jacket with quilted lining and antique zips." },
  { name: "Floral Summer Dress", slug: "floral-summer-dress", category: "women", price: 2450, badge: "NEW", rating: 4.4, photo: PHOTOS.dress, isNewArrival: true, isTrending: true, description: "Flowy floral dress in a breathable weave — made for warm days." },
  { name: "Elegant Saree Collection", slug: "elegant-saree-collection", category: "women", price: 3200, oldPrice: 4000, badge: "NEW", rating: 4.8, photo: PHOTOS.saree, isBestSeller: true, isFlashSale: true, description: "Handwoven traditional saree with rich detailing and a matching blouse piece." },
  { name: "Women's Casual Blazer", slug: "womens-casual-blazer", category: "women", price: 2890, rating: 4.2, photo: PHOTOS.blazer, isNewArrival: true, description: "Tailored casual blazer that sharpens up any everyday outfit." },
  { name: "Kids Hoodie", slug: "kids-hoodie", category: "kids", price: 1290, rating: 4.0, photo: PHOTOS.kidsHoodie, isNewArrival: true, isTrending: true, description: "Warm cosy hoodie with a soft brushed inside — perfect for school runs." },
  { name: "Kids Graphic T-Shirt Pack", slug: "kids-graphic-t-shirt-pack", category: "kids", price: 990, oldPrice: 1200, badge: "SALE", rating: 4.1, photo: PHOTOS.kidsTshirt, isFlashSale: true, isTrending: true, description: "Fun printed tees for everyday school and play wear. Pack of two." },
];

const importData = async () => {
  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  await Order.deleteMany();

  const createdCategories = await Category.insertMany(categories);
  const catMap = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

  const products = productSeed.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: catMap[p.category],
    price: p.price,
    oldPrice: p.oldPrice || 0,
    discountPercent: p.oldPrice
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : 0,
    image: hd(p.photo),
    images: [hd(p.photo)],
    badge: p.badge || "",
    rating: p.rating || 0,
    numReviews: 0,
    stock: 50,
    isFlashSale: !!p.isFlashSale,
    isBestSeller: !!p.isBestSeller,
    isNewArrival: !!p.isNewArrival,
    isTrending: !!p.isTrending,
    isFeatured: !!p.isFeatured,
  }));

  await Product.insertMany(products);

  await User.create({
    name: "CookMe Admin",
    email: "admin@cookme.com",
    phone: "01711254089",
    password: "password123",
    isAdmin: true,
  });

  console.log(`Seeded ${createdCategories.length} categories and ${products.length} products.`);
  console.log("Admin login -> admin@cookme.com / password123");
};

const destroyData = async () => {
  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  await Order.deleteMany();
  console.log("All data removed.");
};

const run = async () => {
  const conn = await connectDB();
  if (!conn) process.exit(1);
  try {
    if (process.argv[2] === "-d") await destroyData();
    else await importData();
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
