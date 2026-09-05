import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: sessionStorage.getItem("signupData")
    ? JSON.parse(sessionStorage.getItem("signupData"))
    : null,
  // user: null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setSignupData(state, action) {
      state.signupData = action.payload;
      sessionStorage.setItem("signupData", JSON.stringify(action.payload));
    },
  },
});

export const { setUser, setLoading, setSignupData } = authSlice.actions;

export default authSlice.reducer;
