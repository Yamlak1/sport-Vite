import { Bell, User, Sun, Moon, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "./BottomNav";
import { getFixturesByDate } from "@/services/oddsApiServices";

// --- New Imports for Bet Slip Dialog ---
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { saveBet } from "@/services/betServices";
import { useToast } from "@/hooks/use-toast";
import { removeBet } from "@/redux/slices/betSlipSlice";
import {
  fetchPlayerData,
  setPlayerData,
  updateBalance,
} from "@/redux/slices/playerSlice";
import { BetTicket } from "./BetTicket";
import { getPlayer } from "@/services/userServices";

// Add type declaration for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

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

export const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [chatId, setChatId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [name, setName] = useState("");
  const [leagues, setLeagues] = useState<League[]>([]);
  const [showAllLeagues, setShowAllLeagues] = useState(false);
  const betSlip = useAppSelector((state) => state.betSlip);
  const { data: playerData } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isBetDialogOpen, setIsBetDialogOpen] = useState(false);
  const [stake, setStake] = useState<number>(5);
  const [stakeError, setStakeError] = useState("");

  const homeRoutes = ["/", "/filter", "/transactions", "/profile"];
  const isHomeRoute = homeRoutes.includes(location.pathname);
  const playerName = playerData ? playerData.name.split(" ")[0] : "Player";
  const playerBalance = playerData ? playerData.balance : 0.0;

  // Fetch Telegram user info on mount
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { initDataUnsafe } = window.Telegram.WebApp;
      if (initDataUnsafe && Object.keys(initDataUnsafe).length !== 0) {
        const { user } = initDataUnsafe;
        if (user) {
          setChatId(user.id.toString());
        }
      }
    }
  });

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      console.log("chatID :", chatId);
      if (chatId) {
        try {
          const playerResponse = await getPlayer(chatId);
          // Dispatch your action to save player data.
          dispatch(setPlayerData(playerResponse));
        } catch (error) {
          console.error("Failed to fetch player data", error);
        }
      } else {
        console.log("Not opened from telegram");
      }
    };

    fetchPlayerInfo();
  }, [chatId, dispatch]);

  // --- Bet Slip Dialog Handlers in Navbar.tsx ---
  const handleConfirmBet = async () => {
    // If there are no bets, don't send a request.
    if (betSlip.selectedBets.length === 0) return;

    // Validate stake.
    if (stake < 5) {
      setStakeError("Minimum stake is 5 birr");
      return;
    }
    if (stake > playerBalance) {
      setStakeError("Insufficient balance");
      return;
    }

    // Consolidate all selected bets into one payload.
    const selections = betSlip.selectedBets.map((bet) => ({
      fixtureId: Number(bet.fixtureId), // Ensure fixtureId is a number.
      betType: bet.type, // Should be a non-empty string.
      betValue: bet.option, // Should be a non-empty string.
      odd: Number(bet.odd), // Ensure odd is a number.
    }));

    // Build the payload object, matching the BetDto structure.
    const betData = {
      telegramId: chatId, // Must be a string.
      bookmaker: "Bwin", // You can also get this dynamically from match data.
      stake: Number(stake),
      finalOdd: Number(betSlip.totalOdds), // Make sure totalOdds is computed as a number.
      selections, // Array of bet selections.
    };

    try {
      // Send the entire payload in one API call.
      // const savedBet = await saveBet(betData);
      // console.log("Bet saved successfully:", savedBet);

      // // Update the player's balance in your Redux store.
      // dispatch(
      //   updateBalance(playerBalance - stake * betSlip.selectedBets.length)
      // );

      // Notify success.
      toast({
        title: "Bets placed successfully!",
        description: "You can view your bets in the betting history.",
      });

      // Close the bet confirmation dialog.
      setIsBetDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving bet:", error.response?.data || error.message);
      toast({
        title: "Error placing bets",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className=" top-0 left-0 right-0 z-50 bg-background dark:bg-[#282C34] ">
        <div className="px-4 py-3 border-b border-gray-300 flex justify-between items-center dark:border-gray-700">
          <div className="flex items-center gap-3">
            {isHomeRoute ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-primary"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-10 h-10 text-black" />
                </Button>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("nav.greeting")}
                  </span>
                  <span className="font-semibold dark:text-white">
                    {playerName}
                  </span>
                </div>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full bg-[#BDD9BF]"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-6 h-6 text-black" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              {theme === "light" ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "am")}
              className="bg-transparent text-sm dark:text-white"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
            </select>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Bell className="w-6 h-6" />
            </button>
            {/* Bet Slip Button: Only show if there is at least one bet */}
            {betSlip.selectedBets.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full bg-primary"
                onClick={() => setIsBetDialogOpen(true)}
              >
                <span className="text-xs text-black">
                  {betSlip.selectedBets.length}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
      {betSlip.selectedBets.length > 0 && (
        <BetTicket
          isOpen={isBetDialogOpen}
          onOpenChange={setIsBetDialogOpen}
          selectedBets={betSlip.selectedBets}
          totalOdds={betSlip.totalOdds}
          stake={stake}
          stakeError={stakeError}
          onStakeChange={(value: string) => setStake(Number(value))}
          onStakeIncrement={(amount: number) =>
            setStake((prev) => prev + amount)
          }
          onConfirmBet={handleConfirmBet}
          onRemoveBet={(fixtureId) => dispatch(removeBet(fixtureId))}
        />
      )}{" "}
    </>
  );
};
