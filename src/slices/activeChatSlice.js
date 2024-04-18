import { createSlice } from '@reduxjs/toolkit';

export const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState: {
    activeUser: null
  },
  reducers: {
    activeUser: (state,action) => {
      state.activeUser = action.payload
    }
  },
})


export const { activeUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;