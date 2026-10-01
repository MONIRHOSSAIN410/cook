import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Phone, Send, X } from "lucide-react";
import { SITE } from "../data/site.js";

/**
 * The pair of round buttons that float above the bottom-right corner:
 * "back to top" (appears once the page is scrolled) and "message us", which
 * opens a small panel to call the hotline or send a pre-written WhatsApp
 * message. Nothing is stored — the message opens in the customer's own app.
 */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = () => {
    const number = SITE.phones[0].replace(/^0/, "880");
    const body = text.trim() || `Hi ${SITE.name}, I have a question about my order.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(body)}`;
  };

  return (
    <div className="no-print fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="card w-[19rem] overflow-hidden shadow-lift"
          >
            <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <img src={SITE.mark} alt="" className="h-7 w-7 rounded bg-white/15 object-contain p-0.5" />
                <div>
                  <p className="text-sm font-semibold leading-tight">Message {SITE.name}</p>
                  <p className="text-[11px] text-white/80">We usually reply within an hour</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close messages">
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Tell us what you need and we will get back to you.
              </p>

              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message…"
                className="field resize-none"
              />

              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex w-full items-center justify-center gap-2 py-2.5"
              >
                <Send size={15} /> Send on WhatsApp
              </a>

              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <p className="mb-2 text-xs font-medium text-slate-500">Or call our hotline</p>
                {SITE.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-brand-600
                               hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Phone size={14} /> {p}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white
                         shadow-lift transition-colors hover:bg-brand-700"
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close messages" : "Message us"}
          aria-expanded={open}
          className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white
                     shadow-lift transition-colors hover:bg-brand-700"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "chat"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {open ? <X size={22} /> : <MessageCircle size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
