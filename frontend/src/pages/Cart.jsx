import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { removeFromCart, updateQty, selectCartTotal } from "../redux/slices/cartSlice.js";
import { SITE, money } from "../data/site.js";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);

  if (!items.length) {
    return (
      <div className="container-app py-20 text-center">
        <ShoppingBag size={44} className="mx-auto mb-4 text-slate-300" />
        <h1 className="mb-2 text-xl font-semibold">Your cart is empty</h1>
        <p className="mb-6 text-sm text-slate-500">Add a few products and they will show up here.</p>
        <Link to="/shop" className="btn-primary inline-block">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 text-2xl font-bold">My cart</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((i) => (
              <motion.div
                key={i.product}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card flex items-center gap-3 p-3 sm:gap-4"
              >
                <Link to={`/product/${i.slug}`} className="zoom-img h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={`/product/${i.slug}`} className="line-clamp-2 text-sm font-medium hover:text-brand-600">
                    {i.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-brand-600">{money(i.price)}</p>
                </div>

                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => dispatch(updateQty({ product: i.product, qty: i.qty - 1 }))}
                    className="px-2 py-1.5"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-sm">{i.qty}</span>
                  <button
                    onClick={() => dispatch(updateQty({ product: i.product, qty: i.qty + 1 }))}
                    className="px-2 py-1.5"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(i.product))}
                  className="p-2 text-slate-400 hover:text-red-500"
                  aria-label={`Remove ${i.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="card h-max p-5 lg:sticky lg:top-40">
          <h2 className="mb-4 font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery</span>
              <span>from {money(SITE.delivery.inside.charge)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 font-semibold dark:border-slate-800">
            <span>Total</span>
            <span className="text-brand-600">{money(total + SITE.delivery.inside.charge)}</span>
          </div>

          <Link to="/checkout" className="btn-primary mt-5 block w-full py-3 text-center">
            Proceed to checkout
          </Link>
          <Link to="/shop" className="btn-ghost mt-3 block w-full py-2.5 text-center text-sm">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
