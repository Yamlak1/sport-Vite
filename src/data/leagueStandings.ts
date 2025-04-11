import { LeagueStanding } from "@/types/football";

export const leagueStandings: { [league: string]: LeagueStanding[] } = {
  "English PL": [
    {
      position: 1,
      team: "Manchester City",
      played: 38,
      win: 27,
      draw: 5,
      loss: 6,
      points: 86,
    },
    {
      position: 2,
      team: "Liverpool",
      played: 38,
      win: 26,
      draw: 7,
      loss: 5,
      points: 85,
    },
    {
      position: 3,
      team: "Chelsea",
      played: 38,
      win: 23,
      draw: 8,
      loss: 7,
      points: 77,
    },
    {
      position: 4,
      team: "Manchester United",
      played: 38,
      win: 20,
      draw: 10,
      loss: 8,
      points: 70,
    },
    // … add more teams as needed
  ],
  "La Liga": [
    {
      position: 1,
      team: "Real Madrid",
      played: 38,
      win: 26,
      draw: 9,
      loss: 3,
      points: 87,
    },
    {
      position: 2,
      team: "Barcelona",
      played: 38,
      win: 25,
      draw: 8,
      loss: 5,
      points: 83,
    },
    {
      position: 3,
      team: "Atletico Madrid",
      played: 38,
      win: 24,
      draw: 8,
      loss: 6,
      points: 80,
    },
    // … add more teams as needed
  ],
  // Add additional leagues (Serie A, Ligue 1, etc.) if needed
};
