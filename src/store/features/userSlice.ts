import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  user: any;
}

const initialState: userState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { saveUser } = userSlice.actions;
export default userSlice.reducer;
