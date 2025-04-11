import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getLeagues,
  getFixturesByDate,
  getTodaysGame,
  getOtherLeagueFixtures,
  getTopLeagueFixtures,
} from "@/services/oddsApiServices";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search, Filter as FilterIcon } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedMatch } from "@/redux/slices/matchSlice";
import { useNavigate } from "react-router-dom";
import { MatchCard } from "@/components/MatchCard";

interface League {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
    coverage: Record<string, unknown>;
  }>;
}

interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
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
  venue: {
    id: number;
    name: string;
    city: string;
  };
}

export const Filter = () => {
  // State declarations
  const [leagues, setLeagues] = useState<League[]>([]);
  const [showAllLeagues, setShowAllLeagues] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [allFixtures, setAllFixtures] = useState<Fixture[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMatchTypes, setSelectedMatchTypes] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Derived list for countries from leagues
  const countries = Array.from(
    new Set(leagues.map((league) => league.country.name))
  );

  // Fixture types (checkboxes)
  const fixtureTypes = [
    { id: "live", name: "Live" },
    { id: "upcoming", name: "Upcoming" },
    { id: "completed", name: "Completed" },
  ];

  // Fetch leagues on mount
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await getLeagues();
        if (response?.data?.response) {
          setLeagues(response.data.response);
        }
      } catch (error) {
        console.error("Error fetching leagues:", error);
      }
    };
    fetchLeagues();
  }, []);

  // Fetch fixtures from both endpoints when the page is opened.
  useEffect(() => {
    const fetchCombinedFixtures = async () => {
      try {
        setIsLoading(true);
        // Fetch both top league and other league fixtures concurrently.
        const [topLeagueData, otherLeagueData] = await Promise.all([
          getTopLeagueFixtures(),
          getOtherLeagueFixtures(),
        ]);

        // Assuming both endpoints return a similar structure with a 'data' property.
        const combinedFixtures = [
          ...topLeagueData.data,
          ...otherLeagueData.data,
        ];

        setAllFixtures(combinedFixtures);

        // If no filter is selected, show upcoming fixtures (assuming "NS" means Not Started)
        if (!selectedFilter) {
          const upcomingFixtures = combinedFixtures.filter(
            (match: Fixture) => match.fixture.status.short === "NS"
          );
          setFixtures(upcomingFixtures);
        }
      } catch (error) {
        console.error("Error fetching combined fixtures:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCombinedFixtures();
  }, []);

  // Helper function to convert a raw Fixture into a normalized object for MatchCard.
  const convertFixture = (fixture: Fixture) => ({
    id: fixture.fixture.id,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeTeamImage: fixture.teams.home.logo,
    awayTeamImage: fixture.teams.away.logo,
    status: fixture.fixture.status.short,
    league: fixture.league.name,
    venue: fixture.venue, // venue is a top-level property
    week: fixture.league.round,
    commenceTime: fixture.fixture.date,
    odds: fixture.odds, // if available
    matchWinnerOdds: fixture.matchWinnerOdds, // if available
    homeScore: fixture.goals.home,
    awayScore: fixture.goals.away,
    lineup: fixture.lineup,
  });

  // Other filtering functions remain unchanged...
  const filteredFixturesByTeam = allFixtures.filter((fixture) => {
    const query = searchQuery.toLowerCase();
    return (
      fixture.teams.home.name.toLowerCase().includes(query) ||
      fixture.teams.away.name.toLowerCase().includes(query)
    );
  });

  const filteredLeagues = leagues.filter((league) =>
    league.league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedLeagues = [...filteredLeagues].sort((a, b) =>
    a.league.name.localeCompare(b.league.name)
  );
  const sortedCountries = [...filteredCountries].sort((a, b) =>
    a.localeCompare(b)
  );

  const fetchFixturesByCountry = (countryName: string) => {
    const filteredFixtures = allFixtures.filter(
      (fixture: Fixture) => fixture.league.country === countryName
    );
    setFixtures(filteredFixtures);
    setSelectedFilter(`Country: ${countryName}`);
  };

  const fetchFixturesByLeague = (leagueName: string) => {
    const filteredFixtures = allFixtures.filter(
      (fixture: Fixture) => fixture.league.name === leagueName
    );
    setFixtures(filteredFixtures);
    setSelectedFilter(`League: ${leagueName}`);
  };

  const fetchFixturesByStatus = (statuses: string[]) => {
    const filteredFixtures = allFixtures.filter((fixture: Fixture) =>
      statuses.includes(fixture.fixture.status.short)
    );
    console.log(`Status: ${statuses.join(" & ")}`);
    setFixtures(filteredFixtures);
    setSelectedFilter(`Status: ${statuses.join(" & ")}`);
  };

  const handleMatchTypeChange = (matchType: string) => {
    const updatedTypes = selectedMatchTypes.includes(matchType)
      ? selectedMatchTypes.filter((type) => type !== matchType)
      : [...selectedMatchTypes, matchType];
    setSelectedMatchTypes(updatedTypes);
    const statusMap: { [key: string]: string[] } = {
      live: ["1H", "HT", "2H", "ET", "BT", "P", "INT", "LIVE"],
      upcoming: ["TBD", "NS", "PEN", "CANC", "ABD"],
      completed: ["FT", "AET", "PEN"],
    };
    const selectedStatuses = updatedTypes.reduce((acc: string[], type) => {
      return acc.concat(statusMap[type] || []);
    }, []);
    if (selectedStatuses.length > 0) {
      console.log(selectedStatuses);
      fetchFixturesByStatus(selectedStatuses);
    }
  };

  useEffect(() => {
    if (!selectedFilter && allFixtures.length > 0) {
      const upcomingFixtures = allFixtures.filter(
        (match: Fixture) => match.fixture.status.short === "NS"
      );
      setFixtures(upcomingFixtures);
    }
  }, [selectedFilter, allFixtures]);

  const handleMatchClick = (fixture: Fixture) => {
    console.log("Navigating to fixture:", fixture.fixture.id);
    dispatch(
      setSelectedMatch({
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeTeamImage: fixture.teams.home.logo,
        awayTeamImage: fixture.teams.away.logo,
      })
    );
    navigate(`/match/${fixture.fixture.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark pb-24">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-5">
        <div className="space-y-4">
          {/* Search Bar and Filter Toggle */}
          <div className="relative">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search leagues or countries..."
                  className="w-full h-8 text-black bg-white border-2 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Suggestion List */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-background-dark shadow-md rounded-md mt-1 max-h-60 overflow-auto z-50">
                    {sortedLeagues.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                          Leagues
                        </div>
                        {sortedLeagues.map((league) => (
                          <div
                            key={league.league.id}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedLeague(league.league.name);
                              fetchFixturesByLeague(league.league.name);
                              setSearchQuery("");
                            }}
                          >
                            {league.league.name}
                          </div>
                        ))}
                      </>
                    )}
                    {sortedCountries.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                          Countries
                        </div>
                        {sortedCountries.map((country, index) => (
                          <div
                            key={index}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedCountry(country);
                              fetchFixturesByCountry(country);
                              setSearchQuery("");
                            }}
                          >
                            {country}
                          </div>
                        ))}
                      </>
                    )}
                    {sortedLeagues.length === 0 &&
                      sortedCountries.length === 0 &&
                      filteredFixturesByTeam.length > 0 && (
                        <>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                            Teams
                          </div>
                          {filteredFixturesByTeam.map((fixture) => (
                            <div
                              key={fixture.fixture.id}
                              className="cursor-pointer px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                              onClick={() => {
                                setFixtures([fixture]);
                                setSelectedFilter(
                                  `Team: ${fixture.teams.home.name} vs ${fixture.teams.away.name}`
                                );
                                setSearchQuery("");
                              }}
                            >
                              {fixture.teams.home.name} vs{" "}
                              {fixture.teams.away.name}
                            </div>
                          ))}
                        </>
                      )}
                    {sortedLeagues.length === 0 &&
                      sortedCountries.length === 0 &&
                      filteredFixturesByTeam.length === 0 && (
                        <div className="px-2 py-2 text-center text-sm text-gray-500">
                          No results found.
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Always Visible Match Type Filter Buttons */}
          <div className="flex gap-2 items-center justify-center">
            {fixtureTypes.map((type) => {
              const isSelected = selectedMatchTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => handleMatchTypeChange(type.id)}
                  className={`px-4 py-1 rounded-xl focus:outline-none transition-colors duration-200 ${
                    isSelected
                      ? "bg-primary text-gray-900"
                      : "bg-primary/30 text-gray-900"
                  }`}
                >
                  {type.name}
                </button>
              );
            })}
          </div>

          {/* Display Fixtures */}
          {selectedFilter ? (
            <div>
              {fixtures.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No{" "}
                  {selectedMatchTypes.length > 0
                    ? selectedMatchTypes
                        .map(
                          (type) => type.charAt(0).toUpperCase() + type.slice(1)
                        )
                        .join(" & ")
                    : "matches"}{" "}
                  match
                </div>
              ) : (
                <div className="space-y-4">
                  {fixtures.map((fixture) => (
                    <MatchCard
                      key={fixture.fixture.id}
                      {...convertFixture(fixture)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Upcoming Fixtures</h2>
              <div className="space-y-4">
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  fixtures.map((fixture) => (
                    <MatchCard
                      key={fixture.fixture.id}
                      {...convertFixture(fixture)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <BottomNav />
      </div>
    </div>
  );
};
