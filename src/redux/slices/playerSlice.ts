// playerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPlayer } from "@/services/userServices";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Define the Player interface (modify as needed)
export interface Player {
  _id: string;
  telegramId: string;
  name: string;
  phoneNumber: string;
  inviterId: string | null;
  isBanned: boolean;
  preferredLanguage: string | null;
  balance: number;
  rewardBalance: number;
  registeredAt: string;
}

// Define the state interface
interface PlayerState {
  data: Player | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PlayerState = {
  data: null,
  loading: "idle",
  error: null,
};

// Thunk to fetch player data given a telegramId
export const fetchPlayerData = createAsyncThunk(
  "player/fetchPlayerData",
  async (telegramId: string, { rejectWithValue }) => {
    try {
      // getPlayer should return a player object matching your interface
      const response = await getPlayer(telegramId);
      // Convert registeredAt to an ISO string if needed
      response.registeredAt = new Date(response.registeredAt).toISOString();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch player data"
      );
    }
  }
);

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Action to manually set/update the player data
    setPlayerData: (state, action: PayloadAction<Player>) => {
      state.data = action.payload;
    },
    logout: (state) => {
      state.data = null;
      state.loading = "idle";
      state.error = null;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.balance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayerData.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        fetchPlayerData.fulfilled,
        (state, action: PayloadAction<Player>) => {
          state.loading = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(fetchPlayerData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export actions for use in components
export const { logout, updateBalance, setPlayerData } = playerSlice.actions;

// Configure redux-persist for this slice
const persistConfig = {
  key: "player",
  storage,
  whitelist: ["data"], // persist only the player data, not loading or error state
};

// Export the persisted reducer
export default persistReducer(persistConfig, playerSlice.reducer);
