import React from "react";
// Example icon imports (optional)
import { CheckCircle2Icon, XCircleIcon, MinusCircleIcon } from "lucide-react";

interface TeamStanding {
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
  // The last five results determined by team form. For example: "WWWWD" or "LDLLL"
  form?: string;
}

interface LeagueStandingsProps {
  leagueStandings: TeamStanding[];
  isStandingsLoading: boolean;
}

export function LeagueStandingsTable({
  leagueStandings,
  isStandingsLoading,
}: LeagueStandingsProps) {
  return (
    <div className="mt-8">
      <h4 className="font-semibold mb-2 text-lg">League Standings</h4>

      {isStandingsLoading ? (
        <p>Loading League Standings...</p>
      ) : leagueStandings && leagueStandings.length > 0 ? (
        /* Responsive wrapper for scrolling if table is wide */
        <div className="overflow-auto rounded-lg shadow">
          {/* Table container */}
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-800">
            {/* Table header */}
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  #
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  Club
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  MP
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  W
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  D
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  L
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  GF
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  GA
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  GD
                </th>
                <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  Pts
                </th>
                {/* <th className="p-3 font-medium text-gray-900 dark:text-gray-100">
                  Last 5
                </th> */}
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              {leagueStandings.map((team) => (
                <tr
                  key={team.rank}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {/* Rank */}
                  <td className="p-3 font-bold text-gray-900 dark:text-gray-100">
                    {team.rank}
                  </td>

                  {/* Club Name + Logo */}
                  <td className="p-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <img
                      src={team.teamLogo}
                      alt={team.teamName}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{team.teamName}</span>
                  </td>

                  {/* MP */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.played}
                  </td>

                  {/* W */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.win}
                  </td>

                  {/* D */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.draw}
                  </td>

                  {/* L */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.lose}
                  </td>

                  {/* GF */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.gf}
                  </td>

                  {/* GA */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.ga}
                  </td>

                  {/* GD */}
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {team.gd}
                  </td>

                  {/* Points */}
                  <td className="p-3 font-bold text-gray-900 dark:text-gray-100">
                    {team.points}
                  </td>

                  {/* Last 5 */}
                  {/* <td className="p-3">
                    {team.form ? (
                      <div className="flex gap-1">
                        {team.form
                          .slice(-5)
                          .split("")
                          .map((result, i) => {
                            console.log("llll", team.form);
                            if (result === "W") {
                              return (
                                <CheckCircle2Icon
                                  key={i}
                                  size={18}
                                  className="text-green-500"
                                />
                              );
                            } else if (result === "L") {
                              return (
                                <XCircleIcon
                                  key={i}
                                  size={18}
                                  className="text-red-500"
                                />
                              );
                            } else if (result === "D") {
                              return (
                                <MinusCircleIcon
                                  key={i}
                                  size={18}
                                  className="text-gray-400"
                                />
                              );
                            } else {
                              return (
                                <span key={i} className="text-gray-500">
                                  {result}
                                </span>
                              );
                            }
                          })}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300">
                        —
                      </span>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No standings available</p>
      )}
    </div>
  );
}
