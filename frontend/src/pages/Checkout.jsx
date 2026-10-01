import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AlertCircle, Check, Copy, ShieldCheck } from "lucide-react";

import { placeOrder } from "../redux/slices/orderSlice.js";
import { clearCart, selectCartTotal } from "../redux/slices/cartSlice.js";
import { SITE, PAYMENT_METHODS, paymentMethod, money } from "../data/site.js";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectCartTotal);
  const user = useSelector((s) => s.auth.user);
  const { placing, error } = useSelector((s) => s.orders);

  const [zone, setZone] = useState("inside");
  const [method, setMethod] = useState("cod");
  const [copied, setCopied] = useState("");
  const [pay, setPay] = useState({ sendTo: SITE.phones[0], senderNumber: "", transactionId: "" });
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    city: "",
    note: "",
  });

  const selected = paymentMethod(method);
  const delivery = SITE.delivery[zone].charge;
  const grandTotal = subtotal + delivery;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPayField = (k) => (e) => setPay((p) => ({ ...p, [k]: e.target.value }));

  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      /* clipboard blocked — the number is on screen anyway */
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      placeOrder({
        customer: form,
        items: items.map((i) => ({
          product: i.product,
          name: i.name,
          slug: i.slug,
          image: i.image,
          price: i.price,
          qty: i.qty,
        })),
        deliveryZone: zone,
        paymentMethod: selected.label,
        payment: {
          method: selected.id,
          sendTo: selected.manual ? pay.sendTo : "",
          senderNumber: selected.manual ? pay.senderNumber : "",
          transactionId: selected.manual ? pay.transactionId : "",
        },
      })
    );

    if (placeOrder.fulfilled.match(res)) {
      dispatch(clearCart());
      navigate(`/order/${res.payload.orderNumber}`);
    }
  };

  if (!items.length) {
    return (
      <div className="container-app py-20 text-center">
        <p className="mb-4 text-slate-500">There is nothing to check out yet.</p>
        <Link to="/shop" className="btn-primary inline-block">Go to shop</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* ---------------- Delivery details ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-4 p-5"
          >
            <h2 className="font-semibold">Delivery details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Full name *</label>
                <input required value={form.name} onChange={set("name")} className="field" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone number *</label>
                <input
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="01XXXXXXXXX"
                  className="field"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email (optional)</label>
              <input type="email" value={form.email} onChange={set("email")} className="field" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Full address *</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={set("address")}
                placeholder="House, road, area"
                className="field"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">City / district</label>
              <input value={form.city} onChange={set("city")} className="field" />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Delivery area</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(SITE.delivery).map(([key, d]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setZone(key)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      zone === key
                        ? "border-brand-600 bg-brand-50 dark:bg-brand-900/30"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="block font-medium">{d.label}</span>
                    <span className="text-xs text-slate-500">
                      {money(d.charge)} · {d.eta}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Order note (optional)</label>
              <textarea rows={2} value={form.note} onChange={set("note")} className="field" />
            </div>
          </motion.div>

          {/* ---------------- Payment ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card space-y-4 p-5"
          >
            <h2 className="font-semibold">Payment method</h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => {
                const active = method === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`relative rounded-lg border p-3 text-left transition-colors ${
                      active
                        ? "border-transparent ring-2"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                    }`}
                    style={active ? { "--tw-ring-color": m.accent } : undefined}
                  >
                    <span
                      className="block text-sm font-semibold"
                      style={{ color: active ? m.accent : undefined }}
                    >
                      {m.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {m.manual ? "Send Money · TrxID" : "Pay on delivery"}
                    </span>
                    {active && (
                      <Check
                        size={16}
                        className="absolute right-2 top-2"
                        style={{ color: m.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Manual mobile banking: numbers + TrxID */}
            {selected.manual ? (
              <div
                className="space-y-4 rounded-lg border p-4"
                style={{ borderColor: `${selected.accent}55`, background: `${selected.accent}0d` }}
              >
                <div>
                  <p className="text-sm font-medium">
                    How to pay with {selected.label}
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                    <li>
                      Open your {selected.label} app and choose{" "}
                      <strong>Send Money</strong>.
                    </li>
                    <li>Send exactly <strong>{money(grandTotal)}</strong> to one of the numbers below.</li>
                    <li>Copy the <strong>TrxID</strong> from the confirmation message and enter it here.</li>
                  </ol>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">
                    Our {selected.label} number ({selected.accountType})
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {selected.numbers.map((number) => {
                      const chosen = pay.sendTo === number;
                      return (
                        <div
                          key={number}
                          className={`flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 dark:bg-slate-900 ${
                            chosen ? "border-current" : "border-slate-200 dark:border-slate-700"
                          }`}
                          style={chosen ? { color: selected.accent } : undefined}
                        >
                          <button
                            type="button"
                            onClick={() => setPay((p) => ({ ...p, sendTo: number }))}
                            className="flex items-center gap-2 text-left"
                          >
                            <span
                              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                                chosen ? "border-current" : "border-slate-300"
                              }`}
                            >
                              {chosen && (
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ background: selected.accent }}
                                />
                              )}
                            </span>
                            <span className="font-mono text-sm tracking-wide text-slate-800 dark:text-slate-100">
                              {number}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => copyNumber(number)}
                            className="flex shrink-0 items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          >
                            {copied === number ? <Check size={13} /> : <Copy size={13} />}
                            {copied === number ? "Copied" : "Copy"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Your {selected.label} number *
                    </label>
                    <input
                      required
                      value={pay.senderNumber}
                      onChange={setPayField("senderNumber")}
                      placeholder="01XXXXXXXXX"
                      inputMode="numeric"
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Transaction ID (TrxID) *</label>
                    <input
                      required
                      value={pay.transactionId}
                      onChange={setPayField("transactionId")}
                      placeholder="e.g. 9F7A2K1BXQ"
                      className="field uppercase"
                    />
                  </div>
                </div>

                <p className="flex items-start gap-2 text-xs text-slate-500">
                  <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                  Never share your PIN or OTP with anyone. CookMe will never ask for them —
                  we only need the TrxID to match your payment.
                </p>
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                {selected.note} Our team will call you on {SITE.phones.join(" or ")} to confirm.
              </p>
            )}
          </motion.div>
        </div>

        {/* ---------------- Summary ---------------- */}
        <div className="card h-max p-5 lg:sticky lg:top-40">
          <h2 className="mb-4 font-semibold">Your order</h2>

          <div className="mb-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.product} className="flex items-center gap-3 text-sm">
                <img src={i.image} alt={i.name} className="h-12 w-12 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate">{i.name}</p>
                  <p className="text-xs text-slate-500">
                    {i.qty} × {money(i.price)}
                  </p>
                </div>
                <span className="font-medium">{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery</span>
              <span>{money(delivery)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span style={{ color: selected.accent }}>{selected.label}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold dark:border-slate-800">
              <span>Total</span>
              <span className="text-brand-600">{money(grandTotal)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <button type="submit" disabled={placing} className="btn-primary mt-5 w-full py-3">
            {placing ? "Placing order…" : "Place order & get receipt"}
          </button>
        </div>
      </form>
    </div>
  );
}
