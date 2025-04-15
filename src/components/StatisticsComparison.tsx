// StatisticsComparison.tsx

import React from "react";

/**
 * Expected shape from your API:
 * homeStats.response[0].statistics = [
 *   { type: "Shots on Goal", value: 5 },
 *   { type: "Shots off Goal", value: 4 },
 *   { type: "Ball Possession", value: "53%" },
 *   ... etc.
 * ]
 */
interface TeamStat {
  type: string;
  value: string | number;
}

interface ApiResponse {
  response?: {
    team?: { id: number; name: string };
    statistics: TeamStat[];
  }[];
}

interface StatisticsComparisonProps {
  homeStats: ApiResponse | null;
  awayStats: ApiResponse | null;
}

function parseStatValue(value: string | number): number {
  // Handle strings like "53%", "47%", or "16"
  if (typeof value === "string") {
    // if it includes '%', remove it and parse to float
    if (value.includes("%")) {
      return parseFloat(value.replace("%", "")) || 0;
    } else {
      return parseFloat(value) || 0;
    }
  } else {
    // already a number
    return value;
  }
}

const StatisticsComparison: React.FC<StatisticsComparisonProps> = ({
  homeStats,
  awayStats,
}) => {
  // Safety checks to ensure we have data
  const home = homeStats?.response?.[0]?.statistics || [];
  const away = awayStats?.response?.[0]?.statistics || [];

  if (!home.length || !away.length) {
    return <p>Loading stats...</p>;
  }

  // Combine stats based on the 'type' field
  // For each home stat, find the matching away stat (by 'type')
  const combinedStats = home.map((hStat) => {
    const aStat = away.find((s) => s.type === hStat.type);
    return {
      type: hStat.type,
      homeValue: parseStatValue(hStat.value),
      awayValue: aStat ? parseStatValue(aStat.value) : 0,
    };
  });

  return (
    <div className="space-y-4">
      {combinedStats.map((stat) => {
        const total = stat.homeValue + stat.awayValue;
        const homePercent = total > 0 ? (stat.homeValue / total) * 100 : 0;
        const awayPercent = total > 0 ? (stat.awayValue / total) * 100 : 0;

        // We'll display raw numeric or percent values depending on 'type'.
        // If the stat itself is "Ball Possession", it likely was "53%" originally;
        // but parseStatValue stripped that to a number. We'll add '%' back for display if needed.
        const isPossessionOrPercent =
          stat.type.toLowerCase().includes("possession") ||
          stat.type.includes("%");

        // Rebuild the display text
        const homeDisplay = isPossessionOrPercent
          ? `${stat.homeValue}%`
          : String(stat.homeValue);
        const awayDisplay = isPossessionOrPercent
          ? `${stat.awayValue}%`
          : String(stat.awayValue);

        return (
          <div key={stat.type}>
            {/* The bar + numeric displays */}
            <div className="flex items-center space-x-2 w-full">
              {/* Home value on the left */}
              <span className="w-8 text-right text-sm">{homeDisplay}</span>

              {/* The combined bar in the middle */}
              <div className="relative flex-1 h-2 bg-gray-200 rounded">
                {/* Home portion from the LEFT */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-blue-500"
                  style={{ width: `${homePercent}%` }}
                ></div>

                {/* Away portion from the RIGHT */}
                <div
                  className="absolute right-0 top-0 bottom-0 bg-green-500"
                  style={{ width: `${awayPercent}%` }}
                ></div>
              </div>

              {/* Away value on the right */}
              <span className="w-8 text-left text-sm">{awayDisplay}</span>
            </div>

            {/* The label for the stat type */}
            <div className="text-center text-sm text-gray-700 dark:text-white mt-1">
              {stat.type}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsComparison;
