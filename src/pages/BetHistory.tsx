import { ArrowLeft, Calendar, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock data - replace with actual API data later
const mockBets = [
  {
    id: 1,
    date: "2024-03-20",
    time: "14:30",
    event: "Manchester United vs Liverpool",
    betType: "1X2",
    selection: "Home",
    odds: 2.5,
    stake: 100,
    status: "won",
  },
  {
    id: 2,
    date: "2024-03-19",
    time: "16:00",
    event: "Arsenal vs Chelsea",
    betType: "Over/Under",
    selection: "Over 2.5",
    odds: 1.8,
    stake: 50,
    status: "lost",
  },
  {
    id: 3,
    date: "2024-03-18",
    time: "20:00",
    event: "Tottenham vs Manchester City",
    betType: "Both Teams to Score",
    selection: "Yes",
    odds: 1.9,
    stake: 75,
    status: "won",
  },
];

const BetHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBets = mockBets.filter((bet) => {
    const matchesSearch = bet.event
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || bet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full bg-primary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </Button>
            <h1 className="text-2xl font-bold dark:text-white">Bet History</h1>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bets..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                /* Add filter modal logic */
              }}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-6">
            {["all", "won", "lost", "pending"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                className="capitalize"
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Bet List */}
        <div className="px-4 space-y-4">
          {filteredBets.map((bet) => (
            <Card
              key={bet.id}
              className="p-4 bg-white dark:bg-gray-800 border-0 shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg dark:text-white">
                    {bet.event}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {bet.date} {bet.time}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bet.status === "won"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : bet.status === "lost"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {bet.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bet Type
                  </p>
                  <p className="font-medium dark:text-white">{bet.betType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selection
                  </p>
                  <p className="font-medium dark:text-white">{bet.selection}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stake
                  </p>
                  <p className="font-medium dark:text-white">${bet.stake}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Odds
                  </p>
                  <p className="font-medium dark:text-white">{bet.odds}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <BottomNav />
      </div>
    </div>
  );
};

export default BetHistory;
