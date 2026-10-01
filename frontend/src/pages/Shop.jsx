import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Filters from "../components/Filters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { fetchProducts } from "../redux/slices/productSlice.js";

const TITLES = {
  new: "New arrivals",
  best: "Best sellers",
  trending: "Trending now",
  flash: "Flash sale",
  featured: "Featured products",
  offer: "Offers & discounts",
};

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, loading } = useSelector((s) => s.products);

  const keyword = searchParams.get("keyword") || "";
  const badge = searchParams.get("badge") || "";

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sort: searchParams.get("sort") || "",
    minRating: "",
    inStock: false,
  });

  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: keyword || undefined,
        badge: badge || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        minRating: filters.minRating || undefined,
        sort: filters.sort || undefined,
        inStock: filters.inStock || undefined,
      })
    );
  }, [dispatch, keyword, badge, filters]);

  const title = useMemo(() => {
    if (keyword) return `Results for “${keyword}”`;
    return TITLES[badge] || "Explore our collection";
  }, [keyword, badge]);

  return (
    <div className="container-app py-6">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 px-5 py-6 text-white sm:px-6">
        <p className="mb-1 text-xs opacity-80">Home / Shop</p>
        <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Filters filters={filters} setFilters={setFilters} />

        <div className="lg:col-span-3">
          <p className="mb-3 text-sm font-medium text-brand-600">
            {loading ? "Loading…" : `${items.length} products`}
          </p>
          <ProductGrid
            products={items}
            columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
            empty="Nothing matched those filters. Try widening the price range."
          />
        </div>
      </div>
    </div>
  );
}
