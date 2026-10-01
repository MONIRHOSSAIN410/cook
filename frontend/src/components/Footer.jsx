import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "../data/site.js";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-brand-600 text-white">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
          <p className="text-sm">Subscribe for new arrivals, offers and seasonal deals.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full gap-2 sm:w-auto"
          >
            <input
              placeholder="Your email"
              type="email"
              className="flex-1 rounded-lg px-3 py-2 text-slate-800 outline-none sm:w-64"
              aria-label="Email address"
            />
            <button className="rounded-lg bg-white px-4 font-medium text-brand-700">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container-app grid grid-cols-2 gap-8 py-10 text-sm md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <img src={SITE.logo} alt={`${SITE.name} — ${SITE.tagline}`} className="mb-3 h-16 w-auto" />
          <p className="text-slate-500 dark:text-slate-400">{SITE.description}</p>
          <div className="mt-4 flex gap-3 text-slate-500">
            <Facebook size={18} />
            <Instagram size={18} />
            <Youtube size={18} />
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Shop</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link to="/shop" className="hover:text-brand-600">All products</Link></li>
            <li><Link to="/shop?badge=new" className="hover:text-brand-600">New arrivals</Link></li>
            <li><Link to="/shop?badge=best" className="hover:text-brand-600">Best sellers</Link></li>
            <li><Link to="/cart" className="hover:text-brand-600">My cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">My account</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link to="/signin" className="hover:text-brand-600">Sign in</Link></li>
            <li><Link to="/signup" className="hover:text-brand-600">Create account</Link></li>
            <li><Link to="/account" className="hover:text-brand-600">My orders</Link></li>
            <li><Link to="/track" className="hover:text-brand-600">Track an order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Contact</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            {SITE.phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone size={14} />
                <a href={`tel:${p}`} className="hover:text-brand-600">{p}</a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail size={14} />
              <a href={`mailto:${SITE.email}`} className="hover:text-brand-600">{SITE.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} /> {SITE.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
