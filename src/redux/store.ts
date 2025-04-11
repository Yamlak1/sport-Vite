import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import playerReducer from "./slices/playerSlice";
import matchReducer from "./slices/matchSlice";
import betSlipReducer from "./slices/betSlipSlice";

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["player"], // only user will be persisted
};

const rootReducer = combineReducers({
  player: playerReducer,
  match: matchReducer,
  betSlip: betSlipReducer,
  // Add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
