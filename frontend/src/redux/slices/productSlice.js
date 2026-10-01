import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params });
      return data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not load products");
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchOne",
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${idOrSlug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Product not found");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/categories");
      return data.categories;
    } catch (err) {
      return rejectWithValue("Could not load categories");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: [],
    current: null,
    related: [],
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.related = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchProductDetail.pending, (s) => {
        s.detailLoading = true;
        s.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (s, a) => {
        s.detailLoading = false;
        s.current = a.payload.product;
        s.related = a.payload.related || [];
      })
      .addCase(fetchProductDetail.rejected, (s, a) => {
        s.detailLoading = false;
        s.error = a.payload;
      })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.categories = a.payload;
      });
  },
});

export const { clearCurrent } = productSlice.actions;
export default productSlice.reducer;
