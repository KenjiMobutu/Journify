import { createSlice } from "@reduxjs/toolkit";

const notifSlice = createSlice({
  name: "notif",
  initialState: {
    notifications: [],
    message: "",
    type: "",
    quantity: 0, // Quantité de notifications
  },
  reducers: {
    setNotif: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotif: (state) => {
      state.message = "";
      state.type = "";
    },
    incrementQuantity: (state) => {
      state.quantity += 1; // Incrémentation de la quantité de notifications
    },
    decrementQuantity: (state) => {
      if (state.quantity > 0) {
        state.quantity -= 1; // Décrémentation de la quantité si elle est supérieure à 0
      }
    },
    resetQuantity: (state) => {
      state.quantity = 0; // Réinitialiser la quantité de notifications à 0
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setNotif,
  clearNotif,
  incrementQuantity,
  decrementQuantity,
  resetQuantity,
  addNotification,
  clearNotifications
} = notifSlice.actions;

export default notifSlice.reducer;
