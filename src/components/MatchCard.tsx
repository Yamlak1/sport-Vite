import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedMatch } from "@/redux/slices/matchSlice";
import {
  getTopLeagueMatchOdds,
  getOtherLeagueMatchOdds,
} from "@/services/oddsApiServices";

interface MatchCardProps {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamImage: string;
  awayTeamImage: string;
  homeScore: number;
  awayScore: number;
  status: string;
  elapsed?: number; // elapsed time in minutes
  league: string;
  venue: string;
  week: string;
  commenceTime: string;
  odds: any;
  matchWinnerOdds?: {
    home: number;
    draw: number;
    away: number;
  };
  lineup?: any; // Raw lineup data from the API.
}

const transformLineup = (
  lineupData: any,
  homeTeamName: string,
  awayTeamName: string
) => {
  const predictedLineupPositions = { home: [], away: [] };

  if (!lineupData || !Array.isArray(lineupData)) {
    return predictedLineupPositions;
  }

  lineupData.forEach((teamLineup: any) => {
    if (
      teamLineup.team?.name === homeTeamName &&
      Array.isArray(teamLineup.startXI)
    ) {
      predictedLineupPositions.home = teamLineup.startXI.map((entry: any) => ({
        name: entry.name || (entry.player && entry.player.name) || "",
        position: entry.position || (entry.player && entry.player.pos) || "",
        top: entry.top,
        left: entry.left,
      }));
    } else if (
      teamLineup.team?.name === awayTeamName &&
      Array.isArray(teamLineup.startXI)
    ) {
      predictedLineupPositions.away = teamLineup.startXI.map((entry: any) => ({
        name: entry.name || (entry.player && entry.player.name) || "",
        position: entry.position || (entry.player && entry.player.pos) || "",
        top: entry.top || "50%",
        left: entry.left || "50%",
      }));
    }
  });

  return predictedLineupPositions;
};

export const MatchCard: React.FC<MatchCardProps> = ({
  id,
  homeTeam,
  awayTeam,
  homeTeamImage,
  awayTeamImage,
  homeScore,
  awayScore,
  status,
  elapsed,
  league,
  venue,
  week,
  commenceTime,
  odds,
  matchWinnerOdds,
  lineup,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Transform lineup data using the helper
  const predictedLineupPositions = lineup
    ? transformLineup(lineup, homeTeam, awayTeam)
    : null;

  // Helper arrays for statuses
  const inProgressStatuses = ["1H", "HT", "2H", "ET", "BT", "P", "INT", "LIVE"];
  const completedStatuses = ["FT", "AET", "PEN", "CANC", "ABD"];

  const showScore =
    inProgressStatuses.includes(status) || completedStatuses.includes(status);

  // For date display
  const dateObj = new Date(commenceTime);
  const formattedCommenceTime = `${String(dateObj.getDate()).padStart(
    2,
    "0"
  )}-${String(dateObj.getMonth() + 1).padStart(
    2,
    "0"
  )}-${dateObj.getFullYear()}`;

  const handleClick = async () => {
    try {
      let oddsResponse;
      try {
        oddsResponse = await getTopLeagueMatchOdds(id);
      } catch (error: any) {
        if (
          error?.response?.data?.message &&
          error.response.data.message.includes("Mapping entry not found")
        ) {
          oddsResponse = await getOtherLeagueMatchOdds(id);
        } else {
          throw error;
        }
      }

      dispatch(
        setSelectedMatch({
          id,
          homeTeam,
          awayTeam,
          homeTeamImage,
          awayTeamImage,
          status,
          league,
          venue,
          week,
          commenceTime,
          odds: oddsResponse.data,
          matchWinnerOdds,
          homeScore,
          awayScore,
          predictedLineupPositions,
        })
      );
      navigate(`/match/${id}`);
    } catch (error) {
      console.error("Error fetching odds:", error);
    }
  };

  const handleOddsClick = (e: React.MouseEvent, option: string) => {
    e.stopPropagation();
    dispatch(
      setSelectedMatch({
        id,
        homeTeam,
        awayTeam,
        homeTeamImage,
        awayTeamImage,
        status,
        league,
        venue,
        week,
        commenceTime,
        odds,
        matchWinnerOdds,
        homeScore,
        awayScore,
        predictedLineupPositions,
      })
    );
    navigate(`/match/${id}?odds=${option}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full max-w-[460px] shadow-xl mx-auto cursor-pointer bg-[#ffff] dark:bg-background text-black font-sans rounded-2xl overflow-hidden"
    >
      {/* Clipped Header: Week */}
      <div className="scoreboard-shape bg-background dark:bg-background-dark px-3 pb-3 pt-1 text-center">
        <div className="text-sm text-gray-600 font-workSans break-words whitespace-normal dark:text-white font-semibold">
          {week}
        </div>
      </div>

      {/* Venue */}
      <div className="text-md flex items-center font-workSans font-medium text-sm text-gray-600 justify-center break-words whitespace-normal">
        {league}
      </div>

      {/* Teams Section */}
      <div className="flex justify-around items-center px-3 bg-[#ffff] dark:bg-background">
        {/* Home Team */}
        <div className="flex flex-col items-center justify-center min-w-[90px]">
          <div className="h-10 w-10 mb-2 flex items-center justify-center">
            <img
              src={homeTeamImage}
              alt={homeTeam}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-sm mb-1 text-center font-workSans w-16">
            {homeTeam}
          </div>
          <div className="text-xs text-gray-600">Home</div>
        </div>

        {/* Middle Section: Score or VS + Commence Time */}
        <div className="flex flex-col items-center min-w-[70px]">
          {showScore ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {homeScore} : {awayScore}
              </div>
              {/* If in-progress, show elapsed time */}
              {inProgressStatuses.includes(status) && elapsed !== undefined ? (
                <div className="text-sm text-green-500">{`${elapsed} min`}</div>
              ) : null}

              {/* If completed, show status (above date) and date below */}
              {completedStatuses.includes(status) && (
                <>
                  <div className="text-sm text-red-500 font-semibold">
                    {status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formattedCommenceTime}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-2xl font-bold mb-2">VS</div>
              {matchWinnerOdds && (
                <div className="text-sm text-green-500">
                  {formattedCommenceTime}
                </div>
              )}
            </>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center justify-center min-w-[90px]">
          <div className="h-10 w-10 mb-2 flex items-center justify-center">
            <img
              src={awayTeamImage}
              alt={awayTeam}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-sm mb-1 text-center font-workSans w-16">
            {awayTeam}
          </div>
          <div className="text-xs text-gray-600">Away</div>
        </div>
      </div>

      {/* Odds Section or Formatted Commence Time */}
      {matchWinnerOdds ? (
        <div className="flex justify-around mt-2 pb-3">
          <button
            onClick={(e) => handleOddsClick(e, "1X")}
            className="flex flex-row items-center justify-between gap-6 font-workSans px-3 h-8 bg-[#EEEEFF] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs text-black">1X</span>
            <span className="text-sm text-gray-900">
              {matchWinnerOdds.home}
            </span>
          </button>
          <button
            onClick={(e) => handleOddsClick(e, "X")}
            className="flex flex-row items-center justify-between gap-6 font-workSans px-3 h-8 bg-[#EEEEFF] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs text-black">X</span>
            <span className="text-sm text-gray-900">
              {matchWinnerOdds.draw}
            </span>
          </button>
          <button
            onClick={(e) => handleOddsClick(e, "2X")}
            className="flex flex-row items-center justify-between gap-6 font-workSans px-3 h-8 bg-[#EEEEFF] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs text-black mr-1">2X</span>
            <span className="text-sm text-gray-900">
              {matchWinnerOdds.away}
            </span>
          </button>
        </div>
      ) : (
        // If no matchWinnerOdds is passed
        <div className="text-sm text-center text-gray-500 pb-3">
          {formattedCommenceTime}
        </div>
      )}
    </div>
  );
};
