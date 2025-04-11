import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Fixture } from "../../types/fixture";

interface FixturesState {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

const initialState: FixturesState = {
  fixtures: [],
  loading: false,
  error: null,
};

const fixturesSlice = createSlice({
  name: "fixtures",
  initialState,
  reducers: {
    setFixtures: (state, action: PayloadAction<Fixture[]>) => {
      state.fixtures = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setFixtures, setLoading, setError } = fixturesSlice.actions;
export default fixturesSlice.reducer;
