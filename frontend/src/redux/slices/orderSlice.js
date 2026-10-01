import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import {
  createLocalOrder,
  findLocalOrder,
  getLocalOrders,
} from "../../data/localOrders.js";

/** True when the request never reached a working API. */
const apiUnreachable = (err) => {
  const status = err.response?.status;
  return !err.response || err.code === "ECONNABORTED" || status === 503 || status >= 500;
};

/** Places the order and returns the receipt. */
export const placeOrder = createAsyncThunk(
  "orders/place",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders", payload);
      return data.order;
    } catch (err) {
      // No backend, or a backend with no database: keep the order in the
      // browser so the customer still gets an order number and a receipt.
      if (apiUnreachable(err)) {
        try {
          return createLocalOrder(payload);
        } catch (localErr) {
          return rejectWithValue(localErr.message);
        }
      }
      // A real answer from the server — show what it said (missing field,
      // wrong TrxID, and so on).
      return rejectWithValue(err.response?.data?.message || "Could not place the order.");
    }
  }
);

/** Receipt lookup — used by the receipt page and "Track my order". */
export const fetchOrder = createAsyncThunk(
  "orders/fetchOne",
  async (orderNumber, { rejectWithValue }) => {
    // An order placed in this browser is here, not on the server.
    const local = findLocalOrder(orderNumber);
    if (local) return local;

    try {
      const { data } = await api.get(`/orders/${orderNumber}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

/** Fetch orders belonging to the logged-in user. */
export const fetchMyOrders = createAsyncThunk(
  "orders/mine",
  async (_, { rejectWithValue }) => {
    const local = getLocalOrders();
    try {
      const { data } = await api.get("/orders/mine/list");
      // Orders kept in this browser sit alongside the ones from the server.
      const serverNumbers = new Set((data.orders || []).map((o) => o.orderNumber));
      return [...local.filter((o) => !serverNumbers.has(o.orderNumber)), ...(data.orders || [])];
    } catch (err) {
      if (apiUnreachable(err)) return local;
      return rejectWithValue(err.response?.data?.message || "Could not load your orders");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    current: null,
    mine: [],
    placing: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
    clearCurrentOrder(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.placing = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.current = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placing = false;
        state.error = action.payload;
      })
      // Fetch Single Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;