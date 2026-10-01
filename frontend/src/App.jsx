import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import FloatingActions from "./components/FloatingActions.jsx";

import Home from "./pages/Home.jsx";

/**
 * Every page except the home page is loaded on demand.
 *
 * The whole shop used to arrive as one 467 kB bundle before anything could be
 * drawn. Now the first visit downloads the home page only, and each other
 * page arrives when it is actually opened.
 */
const Shop = lazy(() => import("./pages/Shop.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Receipt = lazy(() => import("./pages/Receipt.jsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.jsx"));
const SignIn = lazy(() => import("./pages/SignIn.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/** Shown for the moment a page's code is on its way. */
function PageLoading() {
  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200
                   border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderNumber" element={<Receipt />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
