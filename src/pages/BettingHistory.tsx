import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";
import { Trophy, TrendingUp, Wallet, Check, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Navbar } from "@/components/Navbar";

const BettingHistory = () => {
  const { t } = useLanguage();
  const { fullName } = useUser();

  const stats = [
    {
      icon: Trophy,
      label: "Total Bets",
      value: "156",
      trend: "+8 this week",
      positive: true,
    },
    {
      icon: TrendingUp,
      label: "Win Rate",
      value: "57%",
      trend: "+5%",
      positive: true,
    },
    {
      icon: Wallet,
      label: "Total Profit",
      value: "$1,234",
      trend: "+$245",
      positive: true,
    },
  ];

  // Dummy betting history data
  const bettingHistory = [
    {
      id: 1,
      match: "Arsenal vs Chelsea",
      date: "2024-03-15",
      stake: 50,
      odds: 2.5,
      status: "won",
      profit: 75,
      bets: [{ type: "Match Winner", option: "Home" }],
    },
    {
      id: 2,
      match: "Barcelona vs Real Madrid",
      date: "2024-03-14",
      stake: 30,
      odds: 1.8,
      status: "lost",
      profit: -30,
      bets: [{ type: "Match Winner", option: "Away" }],
    },
    {
      id: 3,
      match: "PSG vs Lyon",
      date: "2024-03-13",
      stake: 25,
      odds: 3.0,
      status: "won",
      profit: 50,
      bets: [{ type: "Double Chance", option: "1X" }],
    },
    {
      id: 4,
      match: "Bayern Munich vs Dortmund",
      date: "2024-03-12",
      stake: 40,
      odds: 1.95,
      status: "pending",
      profit: 0,
      bets: [{ type: "Match Winner", option: "Home" }],
    },
    {
      id: 5,
      match: "Manchester United vs Liverpool",
      date: "2024-03-11",
      stake: 35,
      odds: 2.2,
      status: "lost",
      profit: -35,
      bets: [{ type: "Both Teams to Score", option: "Yes" }],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-green-600";
      case "lost":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <Check className="w-5 h-5 text-green-600" />;
      case "lost":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-2 h-2 bg-yellow-600 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background dark:bg-background-dark">
      <Navbar />
      <h1 className="text-2xl font-bold text-gray-900 mb-4 flex justify-center mt-5 font-workSans dark:text-white">
        Betting History
      </h1>

      <div className="space-y-4 mx-4">
        {bettingHistory.map((bet) => (
          <Card
            key={bet.id}
            className="bg-white dark:bg-background shadow-lg border-gray-700 p-4"
          >
            <div className="flex justify-between items-start  mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{bet.match}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(bet.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(bet.status)}
                <span
                  className={`text-sm font-medium capitalize ${getStatusColor(
                    bet.status
                  )}`}
                >
                  {bet.status}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {bet.bets.map((betItem, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-2 text-sm dark:bg-white"
                >
                  <span className="text-gray-600">{betItem.type}:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {betItem.option}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-300">
              <div className="text-sm">
                <span className="text-gray-600">Stake:</span>{" "}
                <span className="font-medium text-gray-900">${bet.stake}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Odds:</span>{" "}
                <span className="font-medium text-gray-900">{bet.odds}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Profit:</span>{" "}
                <span
                  className={`font-medium ${
                    bet.profit > 0
                      ? "text-green-600"
                      : bet.profit < 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {bet.profit > 0 ? "+" : ""}${bet.profit}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <BottomNav />
      </div>
    </div>
  );
};

export default BettingHistory;
