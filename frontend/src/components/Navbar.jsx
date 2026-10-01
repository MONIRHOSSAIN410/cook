import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, ShoppingCart, User, Sun, Moon, Menu, X, Phone, Package,
  Heart, Home as HomeIcon, Store, LogOut, Tag,
} from "lucide-react";
import { toggleTheme } from "../redux/slices/themeSlice.js";
import { selectCartCount } from "../redux/slices/cartSlice.js";
import { fetchCategories } from "../redux/slices/productSlice.js";
import { logout } from "../redux/slices/authSlice.js";
import { CATEGORIES } from "../data/catalog.js";
import { SITE } from "../data/site.js";

/** Links that are always there, whatever the shop is selling. */
const STATIC_LINKS = [
  { name: "Home", to: "/", icon: HomeIcon },
  { name: "Shop All", to: "/shop", icon: Store },
  { name: "Offers", to: "/shop?badge=offer", icon: Tag },
];

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dark = useSelector((s) => s.theme.dark);
  const user = useSelector((s) => s.auth.user);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((s) => s.wishlist.ids.length);
  const apiCategories = useSelector((s) => s.products.categories);

  // The menu is built from the categories the shop actually has, so adding a
  // category to the database adds it to the navigation by itself.
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const categoryLinks = useMemo(() => {
    const list = apiCategories?.length ? apiCategories : CATEGORIES;
    return list.map((c) => ({
      name: c.name,
      to: `/category/${c.slug}`,
      icon: null,
      emoji: c.icon || "",
      count: c.productCount,
    }));
  }, [apiCategories]);

  const links = useMemo(
    () => [...STATIC_LINKS, ...categoryLinks],
    [categoryLinks]
  );

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur
                       dark:border-slate-800 dark:bg-slate-950/90">
      {/* Hotline strip */}
      <div className="hidden bg-brand-600 text-white sm:block">
        <div className="container-app flex items-center justify-between py-1.5 text-xs">
          <p>{SITE.tagline} — free delivery on orders over ৳3,000</p>
          <div className="flex items-center gap-3">
            <Phone size={13} />
            {SITE.phones.map((p) => (
              <a key={p} href={`tel:${p}`} className="hover:underline">
                {p}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-app flex items-center gap-3 py-3 sm:gap-4">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={SITE.mark}
            alt={SITE.name}
            width="36"
            height="36"
            className="h-9 w-9 object-contain"
          />
          <span className="hidden text-lg font-bold leading-none sm:inline">
            <span className="text-brand-600">Cook</span>
            <span className="text-sky-400">Me</span>
          </span>
        </Link>

        <form onSubmit={submitSearch} className="hidden flex-1 md:flex md:max-w-xl">
          <div className="flex w-full overflow-hidden rounded-lg border border-slate-200
                          focus-within:ring-2 focus-within:ring-brand-400 dark:border-slate-700">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories..."
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              aria-label="Search products"
            />
            <button type="submit" className="btn-primary flex items-center gap-1 rounded-none text-sm">
              <Search size={16} />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3 text-sm sm:gap-4">
          <Link
            to="/track"
            className="hidden items-center gap-1 hover:text-brand-600 sm:flex"
          >
            <Package size={17} />
            <span className="hidden lg:inline">Track order</span>
          </Link>

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to={user ? "/account" : "/signin"} className="flex items-center gap-1 hover:text-brand-600">
            <User size={18} />
            <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Login"}</span>
          </Link>

          <Link to="/cart" className="relative flex items-center gap-1 hover:text-brand-600">
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center
                               justify-center rounded-full bg-brand-600 px-1 text-[10px]
                               text-white sm:static sm:ml-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submitSearch} className="container-app pb-3 md:hidden">
        <div className="flex w-full overflow-hidden rounded-lg border border-slate-200
                        focus-within:ring-2 focus-within:ring-brand-400 dark:border-slate-700">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            aria-label="Search products"
          />
          <button type="submit" className="btn-primary rounded-none px-3">
            <Search size={16} />
          </button>
        </div>
      </form>

      <nav className="container-app hidden gap-6 pb-2 text-sm font-medium text-slate-600
                      dark:text-slate-300 lg:flex">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `transition-colors hover:text-brand-600 ${isActive ? "text-brand-600" : ""}`
            }
          >
            {l.name}
          </NavLink>
        ))}
      </nav>

      {/* The drawer is rendered straight into <body>. The header uses
          backdrop-blur, and a blurred element becomes the containing block for
          its fixed children — which is what kept the menu trapped inside the
          header bar instead of covering the page. */}
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm"
                aria-hidden="true"
              />

              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className="fixed inset-y-0 left-0 z-[101] flex w-[85%] max-w-sm flex-col
                           overflow-y-auto overscroll-contain bg-white p-6 shadow-lift
                           dark:bg-slate-950"
              >
              <div className="mb-6 flex items-center justify-between">
                <img src={SITE.logo} alt={SITE.name} className="h-12 w-auto" />
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {STATIC_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors ${
                        isActive
                          ? "bg-brand-600 font-medium text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    {l.icon && <l.icon size={18} />} {l.name}
                  </NavLink>
                ))}

                <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Categories
                </p>
                {categoryLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-lg px-3 py-2.5 text-base transition-colors ${
                        isActive
                          ? "bg-brand-600 font-medium text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    <span>
                      {l.emoji} {l.name}
                    </span>
                    {l.count > 0 && (
                      <span className="text-xs text-slate-400">{l.count}</span>
                    )}
                  </NavLink>
                ))}

                <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  My account
                </p>
                <Link
                  to={user ? "/account" : "/signin"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User size={18} /> {user ? user.name.split(" ")[0] : "Sign in"}
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} /> Wishlist
                  </span>
                  {wishlistCount > 0 && (
                    <span className="text-xs text-slate-400">{wishlistCount}</span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingCart size={18} /> Cart
                  </span>
                  {cartCount > 0 && (
                    <span className="text-xs text-slate-400">{cartCount}</span>
                  )}
                </Link>
                <Link
                  to="/track"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Package size={18} /> Track my order
                </Link>

                {user && (
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setMobileOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <LogOut size={18} /> Log out
                  </button>
                )}
              </nav>

              <div className="mt-8 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                <p className="mb-2 font-medium">Hotline</p>
                {SITE.phones.map((p) => (
                  <a key={p} href={`tel:${p}`} className="block text-brand-600">
                    {p}
                  </a>
                ))}
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
