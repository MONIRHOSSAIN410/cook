import { createSlice } from "@reduxjs/toolkit";

const KEY = "cookme-theme";

function initialDark() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function apply(dark) {
  try {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  } catch {
    /* storage can be blocked — the class toggle still works */
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: { dark: initialDark() },
  reducers: {
    toggleTheme(state) {
      state.dark = !state.dark;
      apply(state.dark);
    },
    setTheme(state, action) {
      state.dark = !!action.payload;
      apply(state.dark);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
