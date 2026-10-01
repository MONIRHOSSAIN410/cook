import { SlidersHorizontal } from "lucide-react";

const SORTS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating_desc", label: "Highest rated" },
  { value: "name_asc", label: "Name: A–Z" },
];

export default function Filters({ filters, setFilters }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <aside className="card h-max p-4 lg:sticky lg:top-40">
      <div className="mb-4 flex items-center gap-2 font-semibold">
        <SlidersHorizontal size={16} className="text-brand-600" /> Filters
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium">Price range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
            className="field"
            aria-label="Minimum price"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
            className="field"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium">Sort by</p>
        <select
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          className="field"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium">Minimum rating</p>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => set({ minRating: filters.minRating === String(r) ? "" : String(r) })}
              className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                filters.minRating === String(r)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {r}★ & above
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(e) => set({ inStock: e.target.checked })}
          className="accent-brand-600"
        />
        In stock only
      </label>

      <button
        onClick={() =>
          setFilters({ minPrice: "", maxPrice: "", sort: "", minRating: "", inStock: false })
        }
        className="btn-ghost mt-5 w-full text-sm"
      >
        Clear filters
      </button>
    </aside>
  );
}
