// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   product: null,
//   editMode: false,
//   products: [],
//   productLoading: false,
//   totalPages: null,
// };

// export const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     resetProductState(state) {
//       state.product = null;
//       state.editMode = false;
//       // state.products = [];
//       // state.productLoading = false;
//       // state.totalPages = null;
//     },
//     setProduct(state, action) {
//       state.product = action.payload;
//     },
//     setEditMode(state, action) {
//       state.editMode = action.payload;
//     },
//     setProducts(state, action) {
//       state.products = action.payload;
//     },
//     setTotalPages(state, action) {
//       state.totalPages = action.payload;
//     },
//     setProductLoading(state, action) {
//       state.productLoading = action.payload;
//     },
//   },
// });

// export const {
//   setProduct,
//   resetProductState,
//   setEditMode,
//   setProducts,
//   setTotalPages,
//   setProductLoading,
// } = productSlice.actions;

// export default productSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: null,
  editMode: false,
  products: [],
  productLoading: false,
  totalPages: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // resetProductState(state) {
    //   state.product = null;
    //   state.editMode = false;
    //   // state.products = [];
    //   // state.productLoading = false;
    //   // state.totalPages = null;
    // },
    resetProductForm(state) {
      state.product = null;
      state.editMode = false;
      state.productLoading = false;
    },
    resetProductList(state) {
      state.products = null;
      state.totalPages = null;
      state.productLoading = false;
    },
    setProduct(state, action) {
      state.product = action.payload;
    },
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setProductLoading(state, action) {
      state.productLoading = action.payload;
    },
  },
});

export const {
  setProduct,
  // resetProductState,
  resetProductList,
  resetProductForm,
  setEditMode,
  setProducts,
  setTotalPages,
  setProductLoading,
} = productSlice.actions;

export default productSlice.reducer;
