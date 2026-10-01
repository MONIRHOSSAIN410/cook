import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle2, Printer, Phone } from "lucide-react";

import { fetchOrder } from "../redux/slices/orderSlice.js";
import { SITE, money } from "../data/site.js";

const dt = (value) =>
  new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Receipt() {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading, error } = useSelector((s) => s.orders);

  useEffect(() => {
    if (!order || order.orderNumber !== orderNumber) dispatch(fetchOrder(orderNumber));
  }, [dispatch, orderNumber, order]);

  if (loading && !order) {
    return <p className="container-app py-20 text-center text-sm text-slate-500">Loading receipt…</p>;
  }

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <p className="mb-4 text-slate-500">{error || "Receipt not found."}</p>
        <Link to="/track" className="btn-primary inline-block">Track another order</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        <div className="no-print mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={28} className="text-green-500" />
            <div>
              <h1 className="text-xl font-bold">Order placed successfully</h1>
              <p className="text-sm text-slate-500">
                Keep this receipt — the order number is how you track it.
              </p>
            </div>
          </div>
          <button onClick={() => window.print()} className="btn-ghost flex items-center gap-2 text-sm">
            <Printer size={16} /> Print receipt
          </button>
        </div>

        <div className="card overflow-hidden">
          {/* Receipt header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <img src={SITE.logo} alt={SITE.name} className="h-14 w-auto" />
            <div className="text-sm sm:text-right">
              <p className="font-semibold">Order {order.orderNumber}</p>
              <p className="text-slate-500">{dt(order.createdAt)}</p>
              <span className="mt-1 inline-block rounded bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-5 text-sm dark:border-slate-800 sm:grid-cols-2">
            <div>
              <p className="mb-1 font-semibold">Delivered to</p>
              <p>{order.customer?.name}</p>
              <p className="text-slate-500">{order.customer?.phone}</p>
              {order.customer?.email && <p className="text-slate-500">{order.customer.email}</p>}
              <p className="text-slate-500">
                {order.customer?.address}
                {order.customer?.city ? `, ${order.customer.city}` : ""}
              </p>
              {order.customer?.note && (
                <p className="mt-1 text-xs text-slate-400">Note: {order.customer.note}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="mb-1 font-semibold">Payment</p>
              <p className="text-slate-500">
                {order.payment?.label || order.paymentMethod}
              </p>

              {order.payment?.transactionId ? (
                <>
                  <p className="text-slate-500">
                    TrxID:{" "}
                    <span className="font-mono text-slate-700 dark:text-slate-200">
                      {order.payment.transactionId}
                    </span>
                  </p>
                  {order.payment.senderNumber && (
                    <p className="text-slate-500">From {order.payment.senderNumber}</p>
                  )}
                  {order.payment.sendTo && (
                    <p className="text-slate-500">Sent to {order.payment.sendTo}</p>
                  )}
                  <p className="text-slate-500">
                    {order.isPaid ? "Payment verified" : "Awaiting payment verification"}
                  </p>
                </>
              ) : (
                <p className="text-slate-500">{order.isPaid ? "Paid" : "Pay on delivery"}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800/60">
                <tr>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 text-center font-medium">Qty</th>
                  <th className="p-3 text-right font-medium">Price</th>
                  <th className="p-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((i, idx) => (
                  <tr key={`${i.slug}-${idx}`} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {i.image && (
                          <img src={i.image} alt={i.name} className="h-10 w-10 rounded object-cover" />
                        )}
                        <span>{i.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">{i.qty}</td>
                    <td className="p-3 text-right">{money(i.price)}</td>
                    <td className="p-3 text-right font-medium">{money(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-100 p-5 dark:border-slate-800">
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>{money(order.itemsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span>{money(order.deliveryCharge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−{money(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold dark:border-slate-800">
                <span>Grand total</span>
                <span className="text-brand-600">{money(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-5 text-center text-xs text-slate-500 dark:bg-slate-800/60">
            <p className="mb-1 font-medium text-slate-700 dark:text-slate-200">
              Thank you for shopping with {SITE.name}!
            </p>
            <p className="flex flex-wrap items-center justify-center gap-2">
              <Phone size={12} />
              {SITE.phones.map((p) => (
                <a key={p} href={`tel:${p}`} className="hover:text-brand-600">{p}</a>
              ))}
              <span>· {SITE.email}</span>
            </p>
          </div>
        </div>

        <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/shop" className="btn-primary flex-1 py-3 text-center">Continue shopping</Link>
          <Link to="/track" className="btn-ghost flex-1 py-3 text-center">Track this order</Link>
        </div>
      </motion.div>
    </div>
  );
}
