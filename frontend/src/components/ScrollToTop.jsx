import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Every route change starts at the top of the page. */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname, search]);
  return null;
}
