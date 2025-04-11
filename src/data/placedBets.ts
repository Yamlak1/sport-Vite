
import { Match } from "@/types/football";

export interface PlacedBet {
  id: string;
  matchId: number;
  match: Match;
  selectedBets: {
    type: string;
    option: string;
  }[];
  possibleWin: number;
  amount: number;
  timestamp: string;
}

export const placedBets: PlacedBet[] = [];
