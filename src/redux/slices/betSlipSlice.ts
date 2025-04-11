import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BetSelection {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  type: string;
  option: string;
  odd: number;
}

interface BetSlipState {
  selectedBets: BetSelection[];
  totalOdds: number;
}

const initialState: BetSlipState = {
  selectedBets: [],
  totalOdds: 0,
};

const calculateTotalOdds = (bets: BetSelection[]) => {
  return bets.reduce((total, bet) => total * bet.odd, 1);
};

export const betSlipSlice = createSlice({
  name: "betSlip",
  initialState,
  reducers: {
    addBet: (state, action: PayloadAction<BetSelection>) => {
      // Check if bet for this fixture already exists
      const existingBetIndex = state.selectedBets.findIndex(
        (bet) => bet.fixtureId === action.payload.fixtureId
      );

      if (existingBetIndex !== -1) {
        // Replace existing bet
        state.selectedBets[existingBetIndex] = action.payload;
      } else {
        // Add new bet
        state.selectedBets.push(action.payload);
      }

      // Update total odds
      state.totalOdds = calculateTotalOdds(state.selectedBets);
    },
    removeBet: (state, action: PayloadAction<number>) => {
      state.selectedBets = state.selectedBets.filter(
        (bet) => bet.fixtureId !== action.payload
      );
      state.totalOdds = calculateTotalOdds(state.selectedBets);
    },
    clearBetSlip: (state) => {
      state.selectedBets = [];
      state.totalOdds = 0;
    },
  },
});

export const { addBet, removeBet, clearBetSlip } = betSlipSlice.actions;
export default betSlipSlice.reducer;
