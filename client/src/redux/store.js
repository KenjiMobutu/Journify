import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartRedux";
import authReducer from "./authRedux";
import notifReducer from "./notifRedux";
import selectedChatReducer from './chatRedux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const getPersistConfig = (userId) => ({
  key: `root-${userId || "guest"}`, // La clé change en fonction de l'utilisateur
  version: 1,
  storage,
});

const rootReducer = combineReducers({ cart: cartReducer, auth: authReducer, notif: notifReducer, selectedChat: selectedChatReducer, });

export const setupStore = (userId) => {
  const persistConfig = getPersistConfig(userId); // Récupération de la configuration de persistance basée sur l'utilisateur
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};
