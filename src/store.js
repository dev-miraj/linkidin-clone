import { configureStore } from '@reduxjs/toolkit';
import userSlices from './slices/userSlices';
import activeUserSlice from './slices/activeChatSlice';

export default configureStore({
  reducer: {
    userData: userSlices,
    activeChatUser: activeUserSlice
  },
})