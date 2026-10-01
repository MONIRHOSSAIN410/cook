import { configureStore } from "@reduxjs/toolkit";
import products from "./slices/productSlice.js";
import cart from "./slices/cartSlice.js";
import theme from "./slices/themeSlice.js";
import auth from "./slices/authSlice.js";
import orders from "./slices/orderSlice.js";
import wishlist from "./slices/wishlistSlice.js";

const store = configureStore({
  reducer: { products, cart, theme, auth, orders, wishlist },
});

export default store;
