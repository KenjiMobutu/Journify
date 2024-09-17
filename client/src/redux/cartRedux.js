import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (state) => {
  let total = 0;

  // Total des produits
  state.products.forEach((product) => {
    const productPrice = product.price || 0;
    total += productPrice;
  });

  // Total des attractions
  state.attractions.forEach((attraction) => {
    const attractionPrice = attraction.price || 0;
    total += attractionPrice;
  });

  // Total des vols
  state.flights.forEach((flight) => {
    const flightPrice = flight.price || 0;
    console.log("FLIGHT PRICE:", flightPrice);
    total += flightPrice;
  });

  // Total des taxis
  state.taxis.forEach((taxi) => {
    const taxiPrice = taxi.price || 0;
    total += taxiPrice;
  });

  return total;
};

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
      const hasAttractions = action.payload.attractions && action.payload.attractions.length > 0;
      const hasFlights = action.payload.flights && action.payload.flights.length > 0;
      const hasTaxis = action.payload.taxis && action.payload.taxis.length > 0;

      // Ajouter le produit (hôtel)
      if (action.payload.product) {
        state.products.push(action.payload.product);
        state.quantity += 1;
      }

      // Ajouter les attractions
      if (hasAttractions) {
        state.attractions.push(...action.payload.attractions);
        state.quantity += action.payload.attractions.length; // Ajouter la quantité des attractions
      }

      // Ajouter les vols
      if (hasFlights) {
        state.flights.push(...action.payload.flights);
        state.quantity += action.payload.flights.length; // Ajouter la quantité des vols
      }

      // Ajouter les taxis
      if (hasTaxis) {
        state.taxis.push(...action.payload.taxis);
        state.quantity += action.payload.taxis.length; // Ajouter la quantité des taxis
      }

      // Mettre à jour le total du panier
      state.total += action.payload.price;
    },
    addFlight: (state, action) => {
      // Vérifie si le vol est déjà dans le tableau flights
      const flightExists = state.flights.some(
        (flight) => flight.token === action.payload.flightId
      );
      console.log("FLIGHT EXISTS:", flightExists);
      console.log("FLIGHTS:", action.payload);
      if (!flightExists) {
        // Ajoute le vol seulement s'il n'existe pas déjà
        state.quantity += 1;
        state.flights.push(action.payload);

        // Si le prix est une chaîne, on le convertit en nombre
        const flightPrice = parseFloat(action.payload.price) || 0;
        state.total += flightPrice;
      } else {
        console.log("Flight already exists in cart");
      }

    },
    removeProduct: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (productIndex !== -1) {
        const productPrice =
          action.payload.product_price_breakdown
            .all_inclusive_amount_hotel_currency.value;
        state.total -= productPrice; // Mise à jour du total
        if (state.total < 0) {
          state.total = 0;
        }
        state.quantity -= 1; // Mise à jour de la quantité
        if (state.quantity < 0) {
          state.quantity = 0;
        }
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
      state.quantity -= 1; // Mise à jour de la quantité
      if (state.quantity < 0) {
        state.quantity = 0;
      }
    },
    removeFlight: (state, action) => {
      const flightIndex = state.flights.findIndex(
        (flight) => flight.id === action.payload.id
      );

      if (flightIndex !== -1) {
        // Vérification de l'existence de priceBreakdown et de ses sous-propriétés
        const flightPrice =
          action.payload.priceBreakdown?.total?.units ||
          action.payload.price ||
          0; // Défaut à 0 si rien n'est disponible

        console.log("FLIGHT PRICE 1:", action.payload.price);
        console.log("FLIGHT PRICE 2:", flightPrice);

        // Mise à jour du total et vérification des valeurs
        state.total -= flightPrice;
        if (state.total < 0) {
          state.total = 0;
        }

        state.quantity -= 1;
        if (state.quantity < 0) {
          state.quantity = 0;
        }

        // Suppression du vol du tableau flights
        state.flights.splice(flightIndex, 1);

        // Recalcul du total global après suppression

      }
    },
    removeTaxi: (state, action) => {
      const taxiIndex = state.taxis.findIndex(
        (taxi) => taxi.id === action.payload.id
      );
      state.quantity -= 1; // Mise à jour de la quantité
      if (taxiIndex !== -1) {
        state.taxis.splice(taxiIndex, 1);
      }

    },
    setTotal: (state, action) => {
      console.log("STATE:", state.total);
      console.log("SET TOTAL:", action.payload);
      state.total = action.payload; // La valeur de `total` est définie explicitement
    },
    resetCart: (state) => {
      state.products = [];
      state.attractions = [];
      state.flights = [];
      state.taxis = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  addFlight,
  removeFlight,
  removeTaxi,
  resetCart,
  setTotal,
  removeAttraction,
} = cartSlice.actions;

export default cartSlice.reducer;
