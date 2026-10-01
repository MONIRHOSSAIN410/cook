import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Award,
  ChevronRight,
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Package,
  Phone,
  Search,
  Settings,
  ShoppingBag,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { logout } from "../redux/slices/authSlice.js";
import { fetchMyOrders } from "../redux/slices/orderSlice.js";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { toggleWishlist } from "../redux/slices/wishlistSlice.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { SITE, money } from "../data/site.js";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  shipped: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  delivered: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300",
};

function StatCard({ icon: Icon, label, value, tone, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="card flex items-center gap-3 p-4"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tone}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-tight">{value}</p>
        <p className="truncate text-xs text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

function OrderRow({ order }) {
  return (
    <Link
      to={`/order/${order.orderNumber}`}
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-4 text-sm transition-colors hover:border-brand-400 dark:border-slate-800"
    >
      <div className="min-w-0">
        <p className="font-medium">{order.orderNumber}</p>
        <p className="text-xs text-slate-500">
          {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items ·{" "}
          {order.payment?.label || order.paymentMethod}
        </p>
      </div>
      <div className="flex items-center gap-3 text-right">
        <div>
          <p className="font-semibold text-brand-600">{money(order.grandTotal)}</p>
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${
              STATUS_STYLES[order.status] || STATUS_STYLES.pending
            }`}
          >
            {order.status}
          </span>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
    </Link>
  );
}

function EmptyState({ icon: Icon, title, text, to = "/shop", cta = "Start shopping" }) {
  return (
    <div className="py-12 text-center">
      <Icon size={36} className="mx-auto mb-3 text-slate-300" />
      <p className="font-medium">{title}</p>
      <p className="mx-auto mb-4 mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      <Link to={to} className="btn-primary inline-block">{cta}</Link>
    </div>
  );
}

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth.user);
  const orders = useSelector((s) => s.orders.mine);
  const products = useSelector((s) => s.products.items);
  const wishlistIds = useSelector((s) => s.wishlist.ids);

  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!user) navigate("/signin");
    else {
      dispatch(fetchMyOrders());
      dispatch(fetchProducts({}));
    }
  }, [user, dispatch, navigate]);

  const stats = useMemo(() => {
    const list = orders || [];
    const spent = list
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    return {
      count: list.length,
      spent,
      // 1 point for every ৳100 spent.
      points: Math.floor(spent / 100),
      pending: list.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status)).length,
    };
  }, [orders]);

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p._id)),
    [products, wishlistIds]
  );

  const addresses = useMemo(() => {
    const seen = new Map();
    (orders || []).forEach((o) => {
      const c = o.customer;
      if (!c?.address) return;
      const key = `${c.address}|${c.city}`.toLowerCase();
      if (!seen.has(key)) seen.set(key, c);
    });
    return [...seen.values()];
  }, [orders]);

  if (!user) return null;

  return (
    <div className="container-app py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="card h-max overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="mt-3 truncate font-semibold">{user.name}</p>
            <p className="truncate text-xs text-white/80">{user.phone || user.email}</p>
          </div>

          <div className="p-3">
            <Link
              to="/shop"
              className="mb-2 flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Store size={15} /> Visit shop
            </Link>

            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-brand-600 font-medium text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon size={16} /> {item.label}
                    </span>
                    <ChevronRight size={14} className={active ? "opacity-90" : "opacity-40"} />
                  </button>
                );
              })}
            </nav>

            <hr className="my-3 border-slate-100 dark:border-slate-800" />

            <Link
              to="/track"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search size={16} /> Track an order
            </Link>
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </aside>

        {/* ---------------- Main ---------------- */}
        <div className="space-y-6 lg:col-span-3">
          {/* Stats — always visible, this is the dashboard header */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
            <StatCard
              icon={ShoppingBag}
              label="Total orders"
              value={stats.count}
              tone="bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"
            />
            <StatCard
              icon={Wallet}
              label="Total spent"
              value={money(stats.spent)}
              tone="bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300"
              delay={0.05}
            />
            <StatCard
              icon={Award}
              label="Loyalty points"
              value={stats.points}
              tone="bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
              delay={0.1}
            />
            <StatCard
              icon={Heart}
              label="Wishlist"
              value={wishlistIds.length}
              tone="bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300"
              delay={0.15}
            />
          </div>

          {/* ----- Overview ----- */}
          {tab === "overview" && (
            <>
              <div className="card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Package size={17} className="text-brand-600" /> Recent orders
                  </h2>
                  {orders.length > 0 && (
                    <button
                      onClick={() => setTab("orders")}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      View all →
                    </button>
                  )}
                </div>

                {!orders.length ? (
                  <EmptyState
                    icon={Package}
                    title="No orders yet"
                    text="Your orders will show up here once you place them."
                  />
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((o) => (
                      <OrderRow key={o._id} order={o} />
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="card flex items-center gap-3 p-5">
                  <TrendingUp size={20} className="shrink-0 text-brand-600" />
                  <div>
                    <p className="text-sm font-semibold">{stats.pending} order(s) on the way</p>
                    <p className="text-xs text-slate-500">
                      Pending, confirmed or shipped right now.
                    </p>
                  </div>
                </div>
                <div className="card flex items-center gap-3 p-5">
                  <Award size={20} className="shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold">{stats.points} loyalty points</p>
                    <p className="text-xs text-slate-500">
                      You earn 1 point for every {money(100)} you spend.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ----- Orders ----- */}
          {tab === "orders" && (
            <div className="card p-5">
              <h2 className="mb-4 font-semibold">My orders</h2>
              {!orders.length ? (
                <EmptyState
                  icon={Package}
                  title="No orders yet"
                  text="Once you place an order it will appear here with its receipt."
                />
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <OrderRow key={o._id} order={o} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ----- Wishlist ----- */}
          {tab === "wishlist" && (
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">My wishlist</h2>
                {wishlistProducts.length > 0 && (
                  <span className="text-sm text-slate-500">{wishlistProducts.length} items</span>
                )}
              </div>

              {!wishlistProducts.length ? (
                <EmptyState
                  icon={Heart}
                  title="Your wishlist is empty"
                  text="Tap the heart on any product to save it for later."
                  cta="Browse products"
                />
              ) : (
                <>
                  <ProductGrid products={wishlistProducts} />
                  <button
                    onClick={() => wishlistIds.forEach((id) => dispatch(toggleWishlist(id)))}
                    className="mt-4 text-sm text-red-500 hover:underline"
                  >
                    Clear wishlist
                  </button>
                </>
              )}
            </div>
          )}

          {/* ----- Addresses ----- */}
          {tab === "addresses" && (
            <div className="card p-5">
              <h2 className="mb-4 font-semibold">Saved addresses</h2>
              {!addresses.length ? (
                <EmptyState
                  icon={MapPin}
                  title="No address saved yet"
                  text="The address you use at checkout is remembered here for next time."
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {addresses.map((a, i) => (
                    <div key={i} className="rounded-lg border border-slate-100 p-4 text-sm dark:border-slate-800">
                      <p className="font-medium">{a.name}</p>
                      <p className="text-slate-500">{a.phone}</p>
                      <p className="mt-1 text-slate-500">
                        {a.address}
                        {a.city ? `, ${a.city}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ----- Settings ----- */}
          {tab === "settings" && (
            <div className="card p-5">
              <h2 className="mb-4 font-semibold">Account settings</h2>
              <dl className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {[
                  ["Name", user.name],
                  ["Phone", user.phone || "—"],
                  ["Email", user.email || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="truncate font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-slate-500">
                To change any of these, call us on {SITE.phones.join(" or ")} and we will
                update it for you.
              </p>
            </div>
          )}

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Phone size={13} /> Need help? Call {SITE.phones.join(" or ")}
          </p>
        </div>
      </div>
    </div>
  );
}
