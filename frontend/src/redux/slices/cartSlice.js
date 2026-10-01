import { createSlice } from "@reduxjs/toolkit";

const KEY = "cookme-cart";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

const save = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: load() },
  reducers: {
    addToCart(state, action) {
      const p = action.payload;
      const qty = Math.max(1, Number(p.qty) || 1);
      const line = state.items.find((i) => i.product === p._id);
      if (line) line.qty += qty;
      else
        state.items.push({
          product: p._id,
          slug: p.slug,
          name: p.name,
          image: p.image,
          price: p.price,
          qty,
        });
      save(state.items);
    },
    updateQty(state, action) {
      const { product, qty } = action.payload;
      const line = state.items.find((i) => i.product === product);
      if (line) line.qty = Math.max(1, Number(qty) || 1);
      save(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.product !== action.payload);
      save(state.items);
    },
    clearCart(state) {
      state.items = [];
      save(state.items);
    },
  },
});

export const { addToCart, updateQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartTotal = (s) =>
  s.cart.items.reduce((n, i) => n + i.price * i.qty, 0);
