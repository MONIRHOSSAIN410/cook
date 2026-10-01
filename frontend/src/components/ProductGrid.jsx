import { motion } from "framer-motion";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({
  products,
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  empty = "No products found.",
}) {
  if (!products?.length) {
    return <p className="py-10 text-center text-sm text-slate-500">{empty}</p>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      className={`grid ${columns} gap-3 sm:gap-4`}
    >
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </motion.div>
  );
}
