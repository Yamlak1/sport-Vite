// mapLeagueStanding.ts
interface LeagueStandingData {
  errors: any[];
  response: Array<{
    league: {
      id: number;
      name: string;
      season: number;
      standings: Array<
        Array<{
          rank: number;
          team: { id: number; name: string; logo: string };
          points: number;
          goalsDiff: number;
          all: {
            played: number;
            win: number;
            draw: number;
            lose: number;
            goals: {
              for: number;
              against: number;
            };
          };
          home: any;
          away: any;
          [key: string]: any; // For extra fields
        }>
      >;
      [key: string]: any; // For extra fields
    };
  }>;
  [key: string]: any; // For extra fields
}

interface TransformedStanding {
  rank: number;
  teamName: string;
  teamLogo: string;
  played: number;
  win: number;
  draw: number;
  lose: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  [key: string]: any; // For any extra fields you might want
}

export function mapLeagueStanding(
  data: LeagueStandingData
): TransformedStanding[] {
  // 1) Guard clause: If no data or empty response, return an empty array
  if (!data.response || data.response.length === 0) {
    return [];
  }
  console.log("ggggg", data);
  // 2) Grab the first league object (assuming only one in `response`)
  const { league } = data.response[0];
  if (!league || !league.standings) {
    return [];
  }

  console.log("hhhhhh", league);

  // 3) `league.standings` is an array of arrays. Flatten them.
  //    Each element in `league.standings` corresponds to a different group/round (e.g. 1st Round, 2nd Round).
  const flattenedStandings = league.standings[0].flat();
  console.log("iiiiiiii", flattenedStandings);
  // 4) Map each standing to the shape you want
  const mapped = flattenedStandings.map((standing) => {
    const { rank, team, points, goalsDiff, all } = standing;
    const { played, win, draw, lose, goals } = all;

    return {
      rank,
      teamName: team.name,
      teamLogo: team.logo,
      played,
      win,
      draw,
      lose,
      gf: goals.for,
      ga: goals.against,
      gd: goalsDiff,
      points,
      // If you want additional fields (like `form`, `group`, etc.), include them here:
      // form: standing.form,
      // group: standing.group,
      // ...
    };
  });

  return mapped;
}
