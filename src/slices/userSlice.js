import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLoading: false,
  users: null,
  totalPages: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoading(state, action) {
      state.userLoading = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
  },
});

export const { setUserLoading, setUsers, setTotalPages } = userSlice.actions;
export default userSlice.reducer;
