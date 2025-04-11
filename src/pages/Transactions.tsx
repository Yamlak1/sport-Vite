import { Receipt, ArrowDown, ArrowUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Button } from "@/components/ui/button";
import { WalletCard } from "@/components/WalletCard";
import { Navbar } from "@/components/Navbar";
import AdBanner from "@/components/adBanner";

const Transactions = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: ArrowUp,
      label: "Total Deposits",
      value: "$2,345",
      trend: "+12%",
      positive: true,
    },
    {
      icon: ArrowDown,
      label: "Total Withdrawals",
      value: "$1,111",
      trend: "-8%",
      positive: false,
    },
    {
      icon: Clock,
      label: "Pending",
      value: "$234",
      trend: "2 transactions",
      positive: true,
    },
  ];

  const PendingIcon = stats[2].icon; // Extract the icon component before rendering

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark  pb-24">
      <Navbar />

      <div className="pb-3 px-4 dark:bg-[#282C34]">
        {/* Wallet Card */}
        <WalletCard />
      </div>
      {/* Stats Grid */}
      <div className="bg-[#ECE8E5] backdrop-blur-sm rounded-xl ">
        <Card className="bg-white/30 dark:bg-background-dark dark:border dark:border-gray-700 shadow-2xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg bg-primary dark:text-black shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <stat.icon className="h-8 w-8 mb-2" />
                    <p className="text-sm">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                  <span
                    className={`text-sm ${
                      stat.positive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
            <div
              key={stats[2].label}
              className="col-span-2 p-4 rounded-lg bg-gray-900 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <PendingIcon className="h-8 w-8 mb-2 text-white" />
                  <p className="text-sm text-white">{stats[2].label}</p>
                  <p className="text-xl font-bold text-white">
                    {stats[2].value}
                  </p>
                </div>
                <span className="text-sm text-green-400">{stats[2].trend}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-white/30 dark:bg-background-dark dark:border dark:border-gray-700 shadow-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Transaction History</h2>
          </div>
          <Button variant="ghost" className="text-sm text-gray-500">
            See all
          </Button>
        </div>
        <TransactionHistory />
      </Card>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <BottomNav />
      </div>
    </div>
  );
};

export default Transactions;
