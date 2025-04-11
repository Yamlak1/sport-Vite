export interface FootballLeague {
  id: number;
  name: string;
  logo: string;
}

export interface BetType {
  name: string;
  options: string[];
}

export interface PlayerPosition {
  position: string;
  top: string;
  left: string;
}

export interface Player {
  name: string;
  position: string;
  top: string;
  left: string;
}

export interface TeamLineup {
  home: Player[];
  away: Player[];
}

export interface Match {
  lineup: unknown;
  id: number;
  league: string;
  homeTeam: string;
  homeTeamImage: string;
  awayTeam: string;
  awayTeamImage: string;
  status: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  betTypes: BetType[];
  predictedLineupPositions: TeamLineup;
  homeScore?: number;
  awayScore?: number;
}

// Example of LeagueStanding type
export interface LeagueStanding {
  position: number;
  team: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  points: number;
}

// Example of PastFixture type
export interface PastFixture {
  id: number;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
}

export interface MatchOdds {
  data: {
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      round: string;
    };
    fixture: {
      id: number;
      referee: string;
      timezone: string;
      date: string;
      timestamp: number;
      status: {
        long: string;
        short: string;
        elapsed: number | null;
      };
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
      away: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
    };
    goals: {
      home: number | null;
      away: number | null;
    };
    score: {
      halftime: {
        home: number | null;
        away: number | null;
      };
      fulltime: {
        home: number | null;
        away: number | null;
      };
      extratime: {
        home: number | null;
        away: number | null;
      };
      penalty: {
        home: number | null;
        away: number | null;
      };
    };
    odds: {
      home: number;
      draw: number;
      away: number;
    };
  }[];
}
