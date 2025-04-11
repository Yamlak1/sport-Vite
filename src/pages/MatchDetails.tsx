import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import FootballField from "@/components/FootballField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { leagueStandings } from "@/data/leagueStandings";
import { pastFixtures } from "@/data/pastFixtures";
import { placedBets } from "@/data/placedBets";
import { useToast } from "@/hooks/use-toast";
import { saveBet } from "@/services/betServices";
import { useUser } from "@/hooks/useUser";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateBalance } from "@/redux/slices/playerSlice";
import { getMatchOdds } from "@/services/oddsApiServices";
import { Navbar } from "@/components/Navbar";
import { addBet, removeBet } from "@/redux/slices/betSlipSlice";
import { MatchCard } from "@/components/MatchCard";
import { BetTicket } from "@/components/BetTicket";
import { PlayCircle } from "lucide-react";

// Import default lineup helpers and data
import { homePositions, awayPositions, mapLineup } from "@/data/positions";
import { teamImages } from "@/data/teamImages";
import { betTypes } from "@/data/betTypes";
import AdBanner from "@/components/adBanner";

// Interfaces
interface BetValue {
  value: string;
  odd: string;
}

interface Bet {
  id: number;
  name: string;
  values: BetValue[];
}

interface Bookmaker {
  id: number;
  name: string;
  bets: Bet[];
}

interface MatchOddsData {
  fixture: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
  update: string;
  bookmakers: Bookmaker[];
}

interface Player {
  name: string;
  position: string;
  top: string;
  left: string;
}

interface MatchData {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamImage: string;
  awayTeamImage: string;
  homeScore: number;
  awayScore: number;
  status: string;
  league: string;
  commenceTime: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  predictedLineupPositions?: {
    home: Player[];
    away: Player[];
  };
}

const MatchDetails = () => {
  const [activeTab, setActiveTab] = useState<"bets" | "lineup" | "statistics">(
    "bets"
  );
  const [selectedBets, setSelectedBets] = useState<
    { type: string; option: string }[]
  >([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [matchOdds, setMatchOdds] = useState<MatchOddsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { balance } = useUser();
  const dispatch = useAppDispatch();
  const [stake, setStake] = useState<number>(5);
  const [stakeError, setStakeError] = useState<string>("");
  const betSlip = useAppSelector((state) => state.betSlip);

  // Get match information from Redux instead of location state
  const selectedMatch = useAppSelector((state) => state.match.selectedMatch);
  console.log("Selected match: ", selectedMatch);

  // Helper for Tailwind grid columns
  const getGridColsClass = (numOptions: number) => {
    if (numOptions === 1) return "grid-cols-1";
    if (numOptions <= 6) return "grid-cols-3";
    if (numOptions <= 9) return "grid-cols-2";
    if (numOptions <= 16) return "grid-cols-2";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
  };

  // Memoize the default lineup so it doesn't change on every render
  const defaultLineup = useMemo(
    () => ({
      home: mapLineup(
        [
          "David de Gea",
          "Aaron Wan-Bissaka",
          "Victor Lindelof",
          "Harry Maguire",
          "Luke Shaw",
          "Scott McTominay",
          "Paul Pogba",
          "Bruno Fernandes",
          "Marcus Rashford",
          "Mason Greenwood",
          "Anthony Martial",
        ],
        homePositions
      ),
      away: mapLineup(
        [
          "Alisson Becker",
          "Trent Alexander-Arnold",
          "Virgil van Dijk",
          "Joel Matip",
          "Andrew Robertson",
          "Fabinho",
          "Jordan Henderson",
          "Thiago Alcantara",
          "Mohamed Salah",
          "Darwin Núñez",
          "Diogo Jota",
        ],
        awayPositions
      ),
    }),
    []
  );

  const completedStatuses = ["FT", "AET", "PEN", "CANC", "ABD"];

  // Fetch match data and override lineup with defaultLineup

  useEffect(() => {
    const fetchMatchData = async () => {
      console.log("Starting fetchMatchData");
      if (id) {
        try {
          console.log("Fetching match data for ID:", id);
          setIsLoading(true);
          // Fetch odds data
          const oddsData = await getMatchOdds(id);
          console.log("Received odds data:", oddsData);
          if (oddsData?.data?.[0]) {
            const matchData: MatchData = {
              id: oddsData.data[0].fixture.id,
              homeTeam:
                selectedMatch?.homeTeam ||
                oddsData.data[0].teams?.home?.name ||
                "",
              awayTeam:
                selectedMatch?.awayTeam ||
                oddsData.data[0].teams?.away?.name ||
                "",
              homeTeamImage:
                selectedMatch?.homeTeamImage ||
                oddsData.data[0].teams?.home?.logo ||
                "",
              awayTeamImage:
                selectedMatch?.awayTeamImage ||
                oddsData.data[0].teams?.away?.logo ||
                "",
              week: selectedMatch?.week,
              homeScore: selectedMatch?.homeScore,
              awayScore: selectedMatch?.awayScore,
              status: selectedMatch?.status || "Upcoming",
              league: oddsData.data[0].league?.name || "",
              commenceTime: oddsData.data[0].fixture?.date || "",

              // Always use the default lineup here
              predictedLineupPositions: selectedMatch.predictedLineupPositions,
            };
            console.log("Created match data:", matchData);
            setMatch(matchData);
            setMatchOdds(oddsData.data[0]);
          } else {
            throw new Error("No match data found in API response");
          }
        } catch (error) {
          console.error("Error fetching match data:", error);
          toast({
            title: "Error",
            description: "Failed to load match details",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No ID provided");
        setIsLoading(false);
      }
    };

    fetchMatchData();
  }, [id, toast, selectedMatch]); // Note: defaultLineup is not included now

  // Handle initial odds selection from URL
  useEffect(() => {
    const odds = searchParams.get("odds");
    if (odds && match) {
      let betOption = "";
      switch (odds) {
        case "1X":
          betOption = "Home";
          break;
        case "X":
          betOption = "Draw";
          break;
        case "2X":
          betOption = "Away";
          break;
      }

      if (betOption) {
        handleSelectBet("Match Winner", betOption);
        const accordionTrigger = document.querySelector(
          '[data-state="closed"][value="match-winner"]'
        ) as HTMLElement;
        if (accordionTrigger) {
          accordionTrigger.click();
        }
      }
    }
  }, [match, searchParams]);

  // At the top of your component (inside MatchDetails)
  const matchData = match || selectedMatch;

  if (isLoading || !matchData) {
    return (
      <div className="min-h-screen bg-[#ECE8E5] pb-24 pt-5">
        <div className="bg-white backdrop-blur-sm px-4 py-3 flex items-center gap-4 fixed top-0 w-full z-10">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-700 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <span className="font-semibold text-gray-900">
            {t("matchDetails.title")}
          </span>
        </div>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const handleSelectBet = (type: string, option: string) => {
    if (!match) return;

    // Check if odds is available. If not, inform the user and exit.
    if (!odds) {
      toast({
        title: "No odds found",
        description: "Odds data is not available for this match.",
        variant: "destructive",
      });
      return;
    }

    const currentOdd =
      option === "Home" ? odds.home : option === "Draw" ? odds.draw : odds.away;

    if (
      selectedBets.some((bet) => bet.type === type && bet.option === option)
    ) {
      dispatch(removeBet(match.id));
      setSelectedBets([]);
      return;
    }

    dispatch(
      addBet({
        fixtureId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        type,
        option,
        odd: currentOdd,
      })
    );
    setSelectedBets([{ type, option }]);
  };

  const handleConfirmBet = async () => {
    if (!match || betSlip.selectedBets.length === 0) return;

    if (stake < 5) {
      setStakeError("Minimum stake is 5 birr");
      return;
    }

    if (stake > balance) {
      setStakeError("Insufficient balance");
      return;
    }

    try {
      // await Promise.all(
      //   betSlip.selectedBets.map((bet) =>
      //     saveBet(
      //       { ...match, id: bet.fixtureId },
      //       [{ type: bet.type, option: bet.option }],
      //       stake
      //     )
      //   )
      // );

      // dispatch(updateBalance(balance - stake * betSlip.selectedBets.length));
      toast({
        title: "Bets placed successfully!",
        description: "You can view your bets in the betting history.",
      });
      setIsConfirmDialogOpen(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error placing bets",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const isOptionSelected = (type: string, option: string) => {
    return selectedBets.some(
      (bet) => bet.type === type && bet.option === option
    );
  };

  const getMatchWinnerOdds = () => {
    if (!matchOdds?.bookmakers) return null;
    const bookmaker = matchOdds.bookmakers.find((bm) =>
      bm.bets.some((bet) => bet.name === "Match Winner")
    );
    if (!bookmaker) return null;
    const matchWinnerBet = bookmaker.bets.find(
      (bet) => bet.name === "Match Winner"
    );
    if (!matchWinnerBet) return null;

    return {
      home: parseFloat(
        matchWinnerBet.values.find((v) => v.value === "Home")?.odd || "0"
      ),
      draw: parseFloat(
        matchWinnerBet.values.find((v) => v.value === "Draw")?.odd || "0"
      ),
      away: parseFloat(
        matchWinnerBet.values.find((v) => v.value === "Away")?.odd || "0"
      ),
    };
  };

  const computedOdds = getMatchWinnerOdds();
  const odds = computedOdds ?? match?.odds;

  const getAvailableBetTypes = () => {
    if (!matchOdds?.bookmakers) return [];
    const betTypesMap = new Map<string, Bet>();
    matchOdds.bookmakers.forEach((bookmaker) => {
      bookmaker.bets.forEach((bet) => {
        if (!betTypesMap.has(bet.name)) {
          betTypesMap.set(bet.name, bet);
        }
      });
    });
    return Array.from(betTypesMap.values());
  };

  const handleStakeChange = (value: string) => {
    setStakeError("");
    if (value === "") {
      setStake(0);
      return;
    }
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    setStake(numValue);
  };

  const handleStakeIncrement = (amount: number) => {
    setStake((prev) => prev + amount);
  };

  // Sample highlights data
  const highlights = [
    {
      id: 1,
      thumbnail: "https://placehold.co/300x500?text=Highlight+1",
      videoUrl: "https://video.example.com/1.mp4",
    },
    {
      id: 2,
      thumbnail: "https://placehold.co/300x500?text=Highlight+2",
      videoUrl: "https://video.example.com/2.mp4",
    },
    {
      id: 3,
      thumbnail: "https://placehold.co/300x500?text=Highlight+3",
      videoUrl: "https://video.example.com/3.mp4",
    },
    {
      id: 4,
      thumbnail: "https://placehold.co/300x500?text=Highlight+4",
      videoUrl: "https://video.example.com/4.mp4",
    },
    {
      id: 5,
      thumbnail: "https://placehold.co/300x500?text=Highlight+5",
      videoUrl: "https://video.example.com/5.mp4",
    },
  ];
  const isMatchCompleted = completedStatuses.includes(matchData.status);

  return (
    <div className="min-h-screen bg-[#ECE8E5] dark:bg-background-dark ">
      <Navbar />

      <div className="px-4 pb-32 mt-5">
        <MatchCard
          id={matchData.id}
          homeTeam={matchData.homeTeam}
          awayTeam={matchData.awayTeam}
          homeTeamImage={matchData.homeTeamImage}
          awayTeamImage={matchData.awayTeamImage}
          homeScore={matchData.homeScore}
          awayScore={matchData.awayScore}
          status={matchData.status}
          league={matchData.league}
          venue={matchData.league.round} // if venue is coming from matchData.league.round
          week={matchData.week}
          commenceTime={matchData.commenceTime}
        />

        <div className="flex gap-2 mb-3 mt-5 overflow-x-auto">
          {/* If the match is completed, hide the 'bets' tab, otherwise show it */}
          {isMatchCompleted ? (
            <>
              <Button
                variant={activeTab === "lineup" ? "default" : "secondary"}
                className={`min-w-max py-4 text-base font-medium rounded-xl 
                  ${
                    activeTab === "lineup"
                      ? "bg-primary/80 hover:bg-primary/90 text-gray-900 shadow-lg"
                      : "bg-white dark:bg-background hover:bg-primary/50 text-gray-800"
                  }
                  transition-all duration-200 ease-in-out
                `}
                onClick={() => setActiveTab("lineup")}
              >
                {t(`matchDetails.lineup`)}
              </Button>

              <Button
                variant={activeTab === "statistics" ? "default" : "secondary"}
                className={`min-w-max py-4 text-base font-medium rounded-xl 
                  ${
                    activeTab === "statistics"
                      ? "bg-primary/80 hover:bg-primary/90 text-gray-900 shadow-lg"
                      : "bg-white dark:bg-background hover:bg-primary/50 text-gray-800"
                  }
                  transition-all duration-200 ease-in-out
                `}
                onClick={() => setActiveTab("statistics")}
              >
                {t(`matchDetails.statistics`)}
              </Button>

              <Button
                variant={activeTab === "highlights" ? "default" : "secondary"}
                className={`min-w-max py-4 text-base font-medium rounded-xl
                  ${
                    activeTab === "highlights"
                      ? "bg-primary/80 hover:bg-primary/90 text-gray-900 shadow-lg"
                      : "bg-white dark:bg-background hover:bg-primary/50 text-gray-800"
                  }
                  transition-all duration-200 ease-in-out
                `}
                onClick={() => setActiveTab("highlights")}
              >
                {t(`matchDetails.highlights`)}
              </Button>
            </>
          ) : (
            // if match not complete, show all tabs, including "bets"
            <>
              {["bets", "lineup", "statistics", "highlights"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "secondary"}
                  className={`min-w-max py-4 text-base font-medium rounded-xl
                ${
                  activeTab === tab
                    ? "bg-primary/80 hover:bg-primary/90 text-gray-900 shadow-lg"
                    : "bg-white dark:bg-background hover:bg-primary/50 text-gray-800"
                }
                transition-all duration-200 ease-in-out
              `}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                >
                  {t(`matchDetails.${tab}`)}
                </Button>
              ))}
            </>
          )}
        </div>

        {/* If match is completed => show a message instead of bets, else show the bet panel */}
        {isMatchCompleted && activeTab === "bets" ? (
          <div className="text-center text-xl font-semibold py-6 text-red-500">
            This fixture has ended.
          </div>
        ) : (
          activeTab === "bets" && (
            <div className="space-y-4">
              {getAvailableBetTypes().length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {getAvailableBetTypes().map((betType) => (
                    <AccordionItem
                      key={betType.id}
                      value={betType.name}
                      className="border-none"
                    >
                      <AccordionTrigger className="bg-white dark:bg-background p-3 rounded-xl text-gray-900 hover:no-underline">
                        <span className="font-semibold">{betType.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div
                          className={`grid ${getGridColsClass(
                            betType.values.length + 1
                          )} gap-2`}
                        >
                          {betType.values.map((value) => (
                            <Button
                              key={value.value}
                              variant="outline"
                              onClick={() =>
                                handleSelectBet(betType.name, value.value)
                              }
                              className="flex flex-row items-center justify-between shadow-lg font-workSans h-8 rounded-lg transition-colors bg-[#EEEEFF] hover:bg-background/40 text-gray-900"
                            >
                              <span className="text-center break-words line-clamp-1 text-xs sm:text-sm">
                                {value.value}
                              </span>
                              <span className="text-xs sm:text-sm">
                                ({value.odd})
                              </span>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center text-gray-500">No odds found</div>
              )}
            </div>
          )
        )}

        {activeTab === "lineup" && (
          <div className="bg-[#ECE8E5] dark:bg-background-dark backdrop-blur-sm rounded-xl ">
            {matchData.predictedLineupPositions ? (
              <div className="space-y-6">
                <FootballField
                  homeTeam={matchData.predictedLineupPositions.home}
                  awayTeam={matchData.predictedLineupPositions.away}
                  className="mb-3"
                />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 dark:text-white">
                      {matchData.homeTeam}
                    </h4>
                    <ul className="space-y-2">
                      {matchData.predictedLineupPositions.home.map((player) => (
                        <li key={player.name} className="text-sm text-gray-900">
                          <span className="font-medium text-[#FACD1A]">
                            {player.position}:
                          </span>{" "}
                          <span className="dark:text-white">{player.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 dark:text-white">
                      {matchData.awayTeam}
                    </h4>
                    <ul className="space-y-2">
                      {matchData.predictedLineupPositions.away.map((player) => (
                        <li key={player.name} className="text-sm text-gray-900">
                          <span className="font-medium text-[#FACD1A]">
                            {player.position}:
                          </span>{" "}
                          <span className="dark:text-white">{player.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white">{t("noLineupAvailable")}</div>
            )}
          </div>
        )}

        {activeTab === "statistics" && (
          <div>
            <div className="mb-8 mt-4 bg-primary/40 dark:bg-primary/90 flex p-3 flex-col rounded-xl shadow-xl">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-workSans text-gray-900 mb-2">
                  League Standings
                </h4>
                <span className="text-xs text-blue-500 underline">
                  View all
                </span>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-fixed text-sm text-gray-900">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Pos</th>
                      <th className="px-4 py-2">Team</th>
                      <th className="px-4 py-2">P</th>
                      <th className="px-4 py-2">W</th>
                      <th className="px-4 py-2">D</th>
                      <th className="px-4 py-2">L</th>
                      <th className="px-4 py-2">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueStandings["English PL"]?.map((team) => (
                      <tr key={team.team} className="border-t border-gray-700">
                        <td className="px-4 py-2">{team.position}</td>
                        <td className="px-4 py-2">{team.team}</td>
                        <td className="px-4 py-2">{team.played}</td>
                        <td className="px-4 py-2">{team.win}</td>
                        <td className="px-4 py-2">{team.draw}</td>
                        <td className="px-4 py-2">{team.loss}</td>
                        <td className="px-4 py-2">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-4 mt-4 bg-primary/40 dark:bg-primary/90 flex p-3 flex-col rounded-xl shadow-xl">
              <div className="flex items-start ">
                <h4 className="text-lg font-workSans text-gray-900 mb-2">
                  Past Fixtures
                </h4>{" "}
              </div>
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-fixed text-sm text-gray-900">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Home</th>
                      <th className="px-4 py-2">Score</th>
                      <th className="px-4 py-2">Away</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastFixtures.map((fixture) => (
                      <tr key={fixture.id} className="border-t border-gray-700">
                        <td className="px-4 py-2">
                          {new Date(fixture.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{fixture.homeTeam}</td>
                        <td className="px-4 py-2">{fixture.score}</td>
                        <td className="px-4 py-2">{fixture.awayTeam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "highlights" && (
          <div className="mb-4 mt-4 flex p-3 flex-col">
            <div className="grid grid-cols-3 gap-4">
              {highlights.map((highlight) => (
                <div key={highlight.id} className="relative">
                  <img
                    src={highlight.thumbnail}
                    alt={`Highlight ${highlight.id}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* If the match ended, we won't show the "place bet" bar */}
      {!isMatchCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark shadow-lg border-t border-gray-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Wallet className="w-5 h-5 text-gray-500 dark:text-white" />
            <span className="font-medium">{balance.toFixed(2)} birr</span>
          </div>
          <Button
            className="flex-1 py-6 text-lg font-semibold bg-primary dark:bg-white text-gray-900"
            onClick={() => setIsConfirmDialogOpen(true)}
            disabled={selectedBets.length === 0}
          >
            Place Bet {selectedBets.length > 0 && selectedBets.length}
          </Button>
        </div>
      )}

      <BetTicket
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedBets={betSlip.selectedBets}
        totalOdds={betSlip.totalOdds}
        stake={stake}
        stakeError={stakeError}
        onStakeChange={handleStakeChange}
        onStakeIncrement={handleStakeIncrement}
        onConfirmBet={handleConfirmBet}
        onRemoveBet={(fixtureId) => dispatch(removeBet(fixtureId))}
      />
    </div>
  );
};

export default MatchDetails;
