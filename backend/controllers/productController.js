import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @desc   List products with search, filters and sorting
// @route  GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, keyword, minPrice, maxPrice, minRating, sort, badge, inStock, limit } =
      req.query;

    const filter = {};

    if (category) {
      const cat = await Category.findOne({ slug: String(category).toLowerCase() });
      if (cat) filter.category = cat._id;
      else return res.json({ success: true, count: 0, products: [] });
    }
    if (keyword) filter.name = { $regex: String(keyword), $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (badge === "flash") filter.isFlashSale = true;
    if (badge === "best") filter.isBestSeller = true;
    if (badge === "new") filter.isNewArrival = true;
    if (badge === "trending") filter.isTrending = true;
    if (badge === "featured") filter.isFeatured = true;
    // "offer" means anything discounted below its original price.
    if (badge === "offer") filter.oldPrice = { $gt: 0 };
    if (inStock === "true") filter.stock = { $gt: 0 };

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      name_asc: { name: 1 },
      newest: { createdAt: -1 },
    };

    let query = Product.find(filter)
      .populate("category", "name slug")
      .sort(sortMap[sort] || { createdAt: -1 });

    if (limit) query = query.limit(Number(limit));

    const products = await query;
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// @desc   Single product by slug or id, with related items
// @route  GET /api/products/:idOrSlug
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const product = await Product.findOne(query).populate("category", "name slug");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const related = await Product.find({
      category: product.category?._id,
      _id: { $ne: product._id },
    })
      .populate("category", "name slug")
      .limit(6);

    res.json({ success: true, product, related });
  } catch (err) {
    next(err);
  }
};

// @desc   Add a review
// @route  POST /api/products/:id/reviews  (private)
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.reviews.some((r) => String(r.user) === String(req.user._id))) {
      res.status(400);
      throw new Error("You already reviewed this product");
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (err) {
    next(err);
  }
};
