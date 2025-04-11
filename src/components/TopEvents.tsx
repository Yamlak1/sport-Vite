import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { fetchedFootballLeagues, Fetchedfixtures } from "@/data/data";
import { FootballLeague, Match } from "@/types/football";
import {
  getFixturesByDate,
  getTodaysGame,
  getTopLeagueFixtures,
} from "@/services/oddsApiServices";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedMatch } from "@/redux/slices/matchSlice";
import { setFixtures } from "../store/slices/fixturesSlice";
import { useFilters } from "../contexts/FiltersContext";

import ballImg from "@/assets/ballImg.jpg";
import { MatchCard } from "./MatchCard";
import { Button } from "./ui/button";
import { FilterIcon } from "lucide-react";

// Define API response types
interface ApiLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
}

interface UnifiedLeague {
  id: string | number;
  name: string;
  country?: string;
  logo: string;
  flag?: string;
}

interface ApiTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

interface ApiFixture {
  id: number;
  date: string;
  timestamp: number;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
}

interface ApiScore {
  halftime: { home: number | null; away: number | null };
  fulltime: { home: number | null; away: number | null };
}

interface ApiMatch {
  fixture: ApiFixture;
  league: ApiLeague;
  teams: {
    home: ApiTeam;
    away: ApiTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: ApiScore;
}

interface LeagueButtonProps {
  league: UnifiedLeague;
  selected: boolean;
  onClick: () => void;
}

const LeagueButton = ({ league, selected, onClick }: LeagueButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 border rounded-full px-4 py-2 text-sm dark:text-black whitespace-nowrap min-w-fit ${
      selected
        ? "bg-[#FACD6A] text-white border-[#FACD6A]"
        : "bg-white text-gray-800 hover:bg-accent/80"
    }`}
  >
    <img
      src={league.logo}
      alt={league.name}
      className="w-8 h-8 object-contain flex-shrink-0"
    />
    {selected && <span className="truncate max-w-[150px]">{league.name}</span>}
  </button>
);

export const TopEvents = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [matches, setMatches] = useState<Match[]>([]);
  const [apiMatches, setApiMatches] = useState<ApiMatch[]>([]);
  const [footballLeagues, setFootballLeagues] = useState<FootballLeague[]>([]);
  const [apiLeagues, setApiLeagues] = useState<ApiLeague[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [selectedBets, setSelectedBets] = useState<
    { type: string; option: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const leaguesContainerRef = useRef<HTMLDivElement>(null);

  // Football scrollbar refs and state (unchanged)
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  const [showTypeFilters, setShowTypeFilters] = useState(false);
  const [selectedMatchTypes, setSelectedMatchTypes] = useState<string[]>([]);

  const [today] = useState(new Date().toISOString().split("T")[0]);
  const { selectedStatus, selectedCountry } = useFilters();

  const handleMatchClick = (match: Match) => {
    dispatch(
      setSelectedMatch({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeTeamImage: match.homeTeamImage,
        awayTeamImage: match.awayTeamImage,
      })
    );
    navigate(`/match/${match.id}`);
  };

  // Load local leagues on mount.
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setIsLoading(true);
        // const response = await getTopLeagueFixtures();
        const today = new Date();
        const dateString = today.toISOString().split("T")[0]; // e.g. "2025-04-09"
        const response = await getFixturesByDate(dateString);
        console.log(dateString);
        console.log("object", response);
        const fixturesData = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : null;

        if (!fixturesData) {
          throw new Error("Invalid API response format");
        }

        dispatch(setFixtures(fixturesData));

        const leaguesMap = new Map();
        fixturesData.forEach((match: any) => {
          leaguesMap.set(match.league.id, {
            id: match.league.id,
            name: match.league.name,
            country: match.league.country,
            logo: match.league.logo,
            flag: match.league.flag,
          });
        });
        const uniqueLeagues = Array.from(leaguesMap.values());
        setApiLeagues(uniqueLeagues);
        console.log("Unique leagues:", uniqueLeagues);

        if (fixturesData && Array.isArray(fixturesData)) {
          setApiMatches(fixturesData);

          // Deduplicate leagues.
          const leaguesMap = new Map();
          fixturesData.forEach((match: any) => {
            leaguesMap.set(match.league.id, {
              id: match.league.id,
              name: match.league.name,
              country: match.league.country,
              logo: match.league.logo,
              flag: match.league.flag,
            });
          });
          const uniqueLeagues = Array.from(leaguesMap.values());
          setApiLeagues(uniqueLeagues);

          const convertedMatches = fixturesData.map((match: any) => {
            // Retrieve full odds data from the correct location.
            const fullOdds = match.odds; // Use match.odds instead of match.fixture.odds
            console.log("fullOdds", fullOdds);
            let matchWinnerOdds = null;

            if (
              fullOdds &&
              fullOdds.bookmakers &&
              Array.isArray(fullOdds.bookmakers)
            ) {
              for (const bookmaker of fullOdds.bookmakers) {
                // Look for the "Match Winner" bet (id === 1).
                const bet = bookmaker.bets.find((b: any) => b.id === 1);
                if (bet && bet.values && bet.values.length >= 3) {
                  console.log(bet.values[0].odd);
                  matchWinnerOdds = {
                    home: bet.values[0].odd,
                    draw: bet.values[1].odd,
                    away: bet.values[2].odd,
                  };
                  break;
                }
              }
            }
            console.log("in top events: ", matchWinnerOdds);
            return {
              id: match.fixture.id,
              homeTeam: match.teams.home.name,
              awayTeam: match.teams.away.name,
              homeTeamImage: match.teams.home.logo,
              awayTeamImage: match.teams.away.logo,
              homeScore: match.goals.home ?? 0,
              awayScore: match.goals.away ?? 0,
              status: match.fixture.status.short,
              league: match.league.name,
              venue: match.fixture.venue.name,
              week: match.league.round,
              // Pass the full fixture date as the commenceTime.
              commenceTime: match.fixture.date,
              odds: fullOdds, // Save full odds data.
              matchWinnerOdds: matchWinnerOdds,
              lineup: match.lineup,
            };
          });

          if (convertedMatches.length > 0) {
            console.log("444444444", convertedMatches);
            setMatches(convertedMatches);
          } else {
            throw new Error("No matches found in API response");
          }
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error: any) {
        console.error("Failed to fetch fixtures:", error);
        toast({
          title: "Error",
          description: "Failed to fetch fixtures. Using fallback data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
  }, [today, dispatch, toast]);

  const filterFixtures = () => {
    let filteredFixtures = [...matches];

    // 1. Filter by fixture type (match types) if any are selected.
    if (selectedMatchTypes.length > 0) {
      const statusMap: { [key: string]: string[] } = {
        live: ["1H", "HT", "2H", "ET", "BT", "P", "INT", "LIVE"],
        upcoming: ["TBD", "NS", "P", "CANC", "ABD"],
        completed: ["FT", "AET", "PEN"],
      };
      // Combine all status codes for the selected fixture types.
      const selectedStatuses = selectedMatchTypes.flatMap(
        (type) => statusMap[type] || []
      );
      filteredFixtures = filteredFixtures.filter((fixture) =>
        selectedStatuses.includes(fixture.status)
      );
    }
    // 2. Otherwise, if a global status filter is selected, apply it.
    else if (selectedStatus) {
      let statuses: string[] = [];
      switch (selectedStatus) {
        case "Live Matches":
          statuses = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];
          break;
        case "Upcoming Matches":
          statuses = ["NS", "TBD"];
          break;
        case "Completed Matches":
          statuses = ["FT", "AET", "PEN", "ABD"];
          break;
        default:
          statuses = [];
      }
      filteredFixtures = filteredFixtures.filter((fixture) =>
        statuses.includes(fixture.status)
      );
    }

    // 3. Filter by country if set.
    if (selectedCountry) {
      filteredFixtures = filteredFixtures.filter(
        (fixture) => fixture.league.country === selectedCountry
      );
    }
    // 4. Filter by league if set.
    if (selectedLeague) {
      console.log(selectedLeague);
      filteredFixtures = filteredFixtures.filter(
        (fixture) => fixture.league === selectedLeague
      );
    }
    return filteredFixtures;
  };

  // ----------------------------
  // Updated match type handler: simply update state.
  // ----------------------------
  const handleMatchTypeChange = (matchType: string) => {
    setSelectedMatchTypes((prev) =>
      prev.includes(matchType)
        ? prev.filter((type) => type !== matchType)
        : [...prev, matchType]
    );
  };

  // ----------------------------
  // Football scrollbar logic (unchanged)
  // ----------------------------
  useEffect(() => {
    const scrollContainer = leaguesContainerRef.current;
    const scrollThumb = scrollThumbRef.current;
    const scrollTrack = scrollTrackRef.current;
    if (!scrollContainer || !scrollThumb || !scrollTrack) return;

    const updateThumbPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const trackWidth = scrollTrack.clientWidth;
      const thumbWidth = scrollThumb.clientWidth;
      const thumbPosition =
        (scrollLeft / (scrollWidth - clientWidth)) * (trackWidth - thumbWidth);
      scrollThumb.style.left = `${thumbPosition}px`;

      if (scrollContainer.scrollLeft > 0) {
        setIsRolling(true);
        if (scrollContainer.dataset.timeoutId) {
          clearTimeout(parseInt(scrollContainer.dataset.timeoutId));
        }
        const timeoutId = setTimeout(() => {
          setIsRolling(false);
        }, 500);
        scrollContainer.dataset.timeoutId = timeoutId.toString();
      } else {
        setIsRolling(false);
      }
    };

    const handleThumbMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.clientX - scrollThumb.getBoundingClientRect().left);
      setScrollLeft(scrollContainer.scrollLeft);
    };

    const handleThumbMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const x = e.clientX - scrollTrack.getBoundingClientRect().left;
      const trackWidth = scrollTrack.clientWidth;
      const thumbWidth = scrollThumb.clientWidth;
      const newScrollLeft =
        ((x - startX) / (trackWidth - thumbWidth)) *
        (scrollContainer.scrollWidth - scrollContainer.clientWidth);
      scrollContainer.scrollLeft = newScrollLeft;
      setIsRolling(true);
    };

    const handleThumbMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        setIsRolling(false);
      }, 500);
    };

    scrollContainer.addEventListener("scroll", updateThumbPosition);
    scrollThumb.addEventListener("mousedown", handleThumbMouseDown);
    window.addEventListener("mousemove", handleThumbMouseMove);
    window.addEventListener("mouseup", handleThumbMouseUp);
    updateThumbPosition();

    return () => {
      scrollContainer.removeEventListener("scroll", updateThumbPosition);
      scrollThumb.removeEventListener("mousedown", handleThumbMouseDown);
      window.removeEventListener("mousemove", handleThumbMouseMove);
      window.removeEventListener("mouseup", handleThumbMouseUp);
      if (scrollContainer.dataset.timeoutId) {
        clearTimeout(parseInt(scrollContainer.dataset.timeoutId));
      }
    };
  }, [isDragging, startX, isRolling]);

  // Fixture types for match status filtering.
  const fixtureTypes = [
    { id: "live", name: "Live" },
    { id: "upcoming", name: "Upcoming" },
    { id: "completed", name: "Completed" },
  ];

  // Compute filtered fixtures.
  const filteredFixtures = filterFixtures();

  // Combine API leagues with static leagues.
  const leaguesMap = new Map<string, UnifiedLeague>();
  apiLeagues.forEach((league) => {
    leaguesMap.set(league.name, {
      id: league.id,
      name: league.name,
      country: league.country,
      logo: league.logo,
      flag: league.flag,
    });
  });
  footballLeagues.forEach((league) => {
    if (!leaguesMap.has(league.name)) {
      leaguesMap.set(league.name, {
        id: league.id,
        name: league.name,
        logo: league.logo,
      });
    }
  });
  const allLeagues: UnifiedLeague[] = Array.from(leaguesMap.values());
  const featuredLeagueNames = [
    "La Liga",
    "English PL",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "UEFA Champions League",
  ];
  const featuredLeagues = allLeagues.filter((league) =>
    featuredLeagueNames.includes(league.name)
  );
  const otherLeagues = allLeagues.filter(
    (league) => !featuredLeagueNames.includes(league.name)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("events.topEvents")}
        </h2>
        <button className="text-gray-500 font-semibold">
          <Button
            variant="ghost"
            className="text-black w-2 flex items-center justify-center"
            onClick={() => setShowTypeFilters(!showTypeFilters)}
          >
            <FilterIcon className="h-4 text-black dark:text-white" />
          </Button>
        </button>
      </div>
      {showTypeFilters && (
        <div className="flex gap-2 items-center justify-center">
          {fixtureTypes.map((type) => {
            const isSelected = selectedMatchTypes.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => handleMatchTypeChange(type.id)}
                className={`px-4 py-1 rounded-xl focus:outline-none transition-colors duration-200 dark:text-gray-300 ${
                  isSelected
                    ? "bg-primary text-gray-900"
                    : "bg-primary/50 text-gray-900"
                }`}
              >
                {type.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative mt-5">
        <div
          ref={leaguesContainerRef}
          className="flex gap-4 overflow-x-auto football-scrollbar relative"
        >
          {/* "All" button */}
          <button
            onClick={() => setSelectedLeague(null)}
            className={`flex items-center px-6 py-3 border rounded-full text-sm whitespace-nowrap min-w-fit bg-white ${
              selectedLeague === null
                ? "bg-[#FACD6A] text-gray-900 border-[#FACD6A]"
                : "bg-gray-300 border-[#FACD6A]/50 text-gray-900 hover:bg-[#FACD6A]"
            }`}
          >
            <span>{t("All")}</span>
          </button>
          {featuredLeagues.map((league) => (
            <LeagueButton
              key={league.id}
              league={league}
              selected={selectedLeague === league.name}
              onClick={() => setSelectedLeague(league.name)}
            />
          ))}
          {!showMore && otherLeagues.length > 0 && (
            <button
              onClick={() => setShowMore(true)}
              className="flex items-center px-3 py-1 rounded-full text-sm whitespace-nowrap min-w-fit bg-white border-accent/50 text-gray-900 dark:text-white dark:bg-gray-700"
            >
              <span>{t("See more")}</span>
            </button>
          )}
          {showMore &&
            otherLeagues.map((league) => (
              <LeagueButton
                key={league.id}
                league={league}
                selected={selectedLeague === league.name}
                onClick={() => setSelectedLeague(league.name)}
              />
            ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-5">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FACD6A]"></div>
        </div>
      ) : filteredFixtures.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No matches available for the selected filters.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredFixtures.map((fixture) => (
            <MatchCard
              key={fixture.id}
              id={fixture.id}
              homeTeam={fixture.homeTeam}
              awayTeam={fixture.awayTeam}
              homeTeamImage={fixture.homeTeamImage}
              awayTeamImage={fixture.awayTeamImage}
              status={fixture.status}
              league={fixture.league}
              venue={fixture.venue}
              week={fixture.week}
              commenceTime={fixture.commenceTime}
              odds={fixture.odds}
              matchWinnerOdds={fixture.matchWinnerOdds}
              homeScore={fixture.homeScore}
              awayScore={fixture.awayScore}
              lineup={fixture.lineup}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to format match status for display.
// const formatStatus = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "1h":
//       return "1st Half";
//     case "2h":
//       return "2nd Half";
//     case "ht":
//       return "Half Time";
//     case "ft":
//       return "Full Time";
//     case "et":
//       return "Extra Time";
//     case "p":
//       return "Penalty";
//     case "ns":
//       return "Not Started";
//     case "tbd":
//       return "TBD";
//     case "pst":
//       return "Postponed";
//     case "susp":
//       return "Suspended";
//     case "int":
//       return "Interrupted";
//     case "aban":
//       return "Abandoned";
//     case "awrd":
//       return "Technical Loss";
//     case "wo":
//       return "WalkOver";
//     case "live":
//       return "LIVE";
//     default:
//       return status;
//   }
// };
