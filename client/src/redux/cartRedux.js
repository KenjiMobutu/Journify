import { createSlice } from "@reduxjs/toolkit";



const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [], // Tableau des hotels
    attractions: [],
    flights: [],
    taxis: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload.product);
      state.attractions.push(...action.payload.attractions);
      state.flights.push(...action.payload.flights);
      state.taxis.push(...action.payload.taxis);
      state.total += action.payload.price;
    },
    removeProduct: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (productIndex !== -1) {
        const productPrice = action.payload.product_price_breakdown.all_inclusive_amount_hotel_currency.value;
        state.total -= productPrice; // Mise à jour du total
        if (state.total < 0) {
          state.total = 0;
        }
        state.quantity -= 1; // Mise à jour de la quantité
        state.products.splice(productIndex, 1); // Suppression du produit
      }
    },
    removeAttraction: (state, action) => {
      const attractionIndex = state.attractions.findIndex(
        (attraction) => attraction.id === action.payload.id
      );
      if (attractionIndex !== -1) {
        state.attractions.splice(attractionIndex, 1);
      }
    },
  },
});

export const { addProduct, removeProduct} = cartSlice.actions;

export default cartSlice.reducer;
