import { formatDateLong } from "@/lib/dateUtils";

interface Fixture {
  fixture: {
    id: number;
    date: string; // e.g. "2025-04-15T00:00:00+00:00"
    timestamp: number;
    // ...
  };
  league: {
    id: number;
    name: string;
    // ...
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean };
    away: { id: number; name: string; logo: string; winner: boolean };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

interface PastFixturesProps {
  data: Fixture[];
}

export function PastFixturesList({ data }: PastFixturesProps) {
  // 1) Sort fixtures by date descending (most recent first).
  //    If your API returns them in desired order, you can skip this.
  const sortedData = [...data].sort((a, b) => {
    // descending by timestamp
    return b.fixture.timestamp - a.fixture.timestamp;
  });

  return (
    <div className="space-y-6">
      {sortedData.map((item) => {
        const { fixture, teams, score } = item;
        const formattedDate = formatDateLong(fixture.date);
        // Or you can do your own formatting if you don't use the helper.

        // If the final score is missing, you can default to " - "
        const homeGoals = score.fulltime.home ?? "-";
        const awayGoals = score.fulltime.away ?? "-";

        return (
          <div key={fixture.id} className="space-y-1">
            <div className="text-gray-500 text-sm font-semibold">
              {formattedDate}
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
              {/* Home */}
              <div className="flex items-center gap-2">
                <img
                  src={teams.home.logo}
                  alt={teams.home.name}
                  className="w-6 h-6 object-contain"
                />
                <span className="font-semibold">{teams.home.name}</span>
              </div>

              {/* Score */}
              <span className="font-bold text-lg text-gray-700 dark:text-gray-300">
                {homeGoals} - {awayGoals}
              </span>

              {/* Away */}
              <div className="flex items-center gap-2">
                <img
                  src={teams.away.logo}
                  alt={teams.away.name}
                  className="w-6 h-6 object-contain"
                />
                <span className="font-semibold">{teams.away.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
