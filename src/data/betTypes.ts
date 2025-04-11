import { BetType } from "@/types/football";

export const betTypes: BetType[] = [
  {
    name: "Over/Under 2.5 Goals",
    options: ["Over 2.5", "Under 2.5"],
  },
  {
    name: "Both Teams to Score (BTTS)",
    options: ["Yes", "No"],
  },
  {
    name: "Half-Time Result",
    options: ["Home", "Draw", "Away"],
  },
  {
    name: "Double Chance",
    options: ["1X", "2X", "X"],
  },
  {
    name: "Exact Score",
    options: ["1-0", "2-0", "2-1", "Other"],
  },
  {
    name: "First Goal",
    options: ["Home", "Away", "No Goal"],
  },
  {
    name: "Asian Handicap",
    options: ["Home -0.5", "Home -1", "Away +0.5", "Away +1"],
  },
  {
    name: "Total Corners - Over/Under",
    options: ["Over 10.5", "Under 10.5"],
  },
  {
    name: "Total Cards - Over/Under",
    options: ["Over 3.5", "Under 3.5"],
  },
  {
    name: "Half-Time/Full-Time",
    options: [
      "Home/Home",
      "Home/Draw",
      "Home/Away",
      "Draw/Home",
      "Draw/Draw",
      "Draw/Away",
      "Away/Home",
      "Away/Draw",
      "Away/Away",
    ],
  },
  {
    name: "Anytime Goalscorer",
    options: [
      "Home: Player 1",
      "Home: Player 2",
      "Away: Player 1",
      "Away: Player 2",
    ],
  },
];
