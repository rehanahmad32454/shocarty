import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  category: null,
  editCategory: false,
};

export const categorySlice = createSlice({
  name: category,
  initialState,
  reducers: {
    setcategory(state, action) {
      state.category = action.payload;
    },
    setEditCategory(state, action) {
      state.category = action.payload;
    },
  },
});

export const { category, editCategory } = categorySlice.actions;
export default categorySlice.reducer;
