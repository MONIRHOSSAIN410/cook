import Category from "../models/Category.js";
import Product from "../models/Product.js";

// @desc  All categories with a live product count
// @route GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    res.json({
      success: true,
      categories: categories.map((c) => ({ ...c, productCount: map[String(c._id)] || 0 })),
    });
  } catch (err) {
    next(err);
  }
};
