import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Filters from "../components/Filters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import api from "../api/axios.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sort: "",
    minRating: "",
    inStock: false,
  });

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const params = {
      category: slug,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      minRating: filters.minRating || undefined,
      sort: filters.sort || undefined,
      inStock: filters.inStock || undefined,
    };

    Promise.all([api.get("/products", { params }), api.get("/products")])
      .then(([inCategory, all]) => {
        if (!alive) return;
        setProducts(inCategory.data.products);
        setRelated(
          all.data.products.filter((p) => p.category?.slug !== slug).slice(0, 10)
        );
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [slug, filters]);

  return (
    <div className="container-app py-6">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 px-5 py-6 capitalize text-white sm:px-6">
        <p className="mb-1 text-xs opacity-80">Home / Shop / {slug}</p>
        <h1 className="text-xl font-bold sm:text-2xl">{slug}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Filters filters={filters} setFilters={setFilters} />

        <div className="lg:col-span-3">
          <p className="mb-3 text-sm font-medium text-brand-600">
            {loading ? "Loading…" : `${products.length} products`}
          </p>
          <ProductGrid products={products} columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" />

          {related.length > 0 && (
            <div className="mt-12">
              <SectionHeader
                title="You might also like"
                subtitle="Products from other categories"
                viewAllTo="/shop"
              />
              <ProductGrid products={related} columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
