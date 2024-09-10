import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null, // Ajout de l'identifiant utilisateur
    isFetching: false, // Pour gérer l'état de chargement
    error: null, // Pour gérer les erreurs
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = null; // Réinitialiser l'erreur
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.userId = action.payload.userId; // Mettre à jour l'ID utilisateur
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload; // Enregistrer l'erreur
    },
    logout: (state) => {
      state.userId = null; // Réinitialiser l'ID utilisateur lors de la déconnexion
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
