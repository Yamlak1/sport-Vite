// liveBets.tsx

import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";
import { betResult, getBets } from "@/services/betServices";
import { getFixturesById } from "@/services/oddsApiServices";
import React, { useEffect, useState } from "react";

function LiveBets() {
  const [bets, setBets] = useState<any[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [fixtureInfos, setFixtureInfos] = useState<Record<string, any>>({});
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state to track expansion/collapse status per bet ID
  const [expandedBets, setExpandedBets] = useState<Record<string, boolean>>({});

  // A helper to toggle expansion when user clicks the "Bookmaker" box
  function toggleBetExpansion(betId: string) {
    setExpandedBets((prev) => ({
      ...prev,
      [betId]: !prev[betId],
    }));
  }

  // Fetch the Telegram user and store the user id as chatId
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { initDataUnsafe } = window.Telegram.WebApp;
      if (initDataUnsafe && Object.keys(initDataUnsafe).length !== 0) {
        const { user } = initDataUnsafe;
        if (user) {
          // For production, use user.id.toString();
          setChatId(user.id.toString());
          return;
        }
      }
    }
  }, []);

  // Once the chatId is available, fetch bets and bet results
  useEffect(() => {
    async function fetchBetsAndResults() {
      try {
        console.log("Fetching bets for chatId:", chatId);
        const fetchedBets = await getBets(chatId as string);
        console.log("Fetched Bets:", fetchedBets);
        setBets(fetchedBets);

        // Fetch each bet's result concurrently
        const betResultsArray = await Promise.all(
          fetchedBets.map(async (bet) => {
            const result = await betResult(bet._id);
            return { betId: bet._id, result };
          })
        );

        // Build a results map keyed by bet id for quick lookup
        const resultsMap: Record<string, any> = {};
        betResultsArray.forEach(({ betId, result }) => {
          resultsMap[betId] = result;
        });
        console.log("Res map", resultsMap);
        setResults(resultsMap);
      } catch (err) {
        console.error("Error fetching bets or results:", err);
        setError("There was an error fetching bets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (chatId) {
      fetchBetsAndResults();
    }
  }, [chatId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading bets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-background-dark">
      <Navbar />
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Live Bets</h1>
        {bets.length === 0 ? (
          <p className="text-center text-gray-600">No live bets available.</p>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => {
              // Check if this bet is currently expanded
              const isExpanded = expandedBets[bet._id] || false;

              // 1) Check if any selection is lost
              const isAnyLost = bet.selections.some(
                (sel: any) => sel.status === "lost"
              );

              // 2) Check if all are won
              const isAllWon =
                bet.selections.length > 0 &&
                bet.selections.every((sel: any) => sel.status === "won");

              // Decide which icon to show on the right side
              let icon = null;
              if (isAnyLost) {
                icon = (
                  <span title="Some selection lost" style={{ color: "red" }}>
                    ❌
                  </span>
                );
              } else if (isAllWon) {
                icon = (
                  <span title="All selections won" style={{ color: "green" }}>
                    ✅
                  </span>
                );
              }

              return (
                <div
                  key={bet._id}
                  className="border border-gray-300 bg-white dark:bg-background rounded-lg shadow"
                >
                  {/* The 'Bookmaker box' to toggle expansion */}
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleBetExpansion(bet._id)}
                  >
                    <div>
                      <p className="font-bold dark:text-black">
                        Bookmaker: {bet.bookmaker}
                      </p>
                      <p className="dark:text-black">Stake: {bet.stake}</p>
                    </div>

                    {/* Show the X or check icon if conditions match */}
                    <div>{icon}</div>
                  </div>

                  {/* If expanded, show the list of selections */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4">
                      {bet.selections.map((selection: any, index: number) => (
                        <div
                          key={index}
                          className="p-2 border-t border-gray-200 dark:border-gray-400"
                        >
                          <p className="text-xl font-semibold dark:text-black">
                            {selection.homeTeam} vs {selection.awayTeam}
                          </p>
                          <p className="text-md dark:text-black">
                            {selection.betType} - {selection.betValue}
                          </p>
                          <p className="text-sm flex items-center dark:text-black">
                            <span>Odd: {selection.odd}</span>
                            {selection.status === "pending" && (
                              <span
                                title="Pending"
                                className="ml-2"
                                style={{ color: "goldenrod" }}
                              >
                                ⏱️
                              </span>
                            )}
                            {selection.status === "won" && (
                              <span
                                title="Won"
                                className="ml-2"
                                style={{ color: "green" }}
                              >
                                ✅
                              </span>
                            )}
                            {selection.status === "lost" && (
                              <span
                                title="Lost"
                                className="ml-2"
                                style={{ color: "red" }}
                              >
                                ❌
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <BottomNav />
      </div>
    </div>
  );
}

export default LiveBets;
