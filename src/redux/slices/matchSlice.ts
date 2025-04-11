import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchState {
  selectedMatch: {
    homeTeam: string;
    awayTeam: string;
    homeTeamImage: string;
    awayTeamImage: string;
  } | null;
}

const initialState: MatchState = {
  selectedMatch: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedMatch: (
      state,
      action: PayloadAction<{
        homeTeam: string;
        awayTeam: string;
        homeTeamImage: string;
        awayTeamImage: string;
      } | null>
    ) => {
      state.selectedMatch = action.payload;
    },
  },
});

export const { setSelectedMatch } = matchSlice.actions;
export default matchSlice.reducer;
