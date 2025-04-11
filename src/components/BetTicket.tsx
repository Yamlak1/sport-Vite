// Inside BetTicket.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { saveBet } from "@/services/betServices"; // adjust import path as needed
import { useAppSelector, useAppDispatch } from "@/redux/hooks"; // used to access Redux store

interface Bet {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  type: string; // maps to betType in backend
  option: string; // maps to betValue in backend
  odd: number;
}

interface BetConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBets: Bet[];
  totalOdds: number;
  stake: number;
  stakeError: string;
  onStakeChange: (value: string) => void;
  onStakeIncrement: (amount: number) => void;
  onConfirmBet: () => void;
  onRemoveBet: (fixtureId: number) => void;
}

export const BetTicket: React.FC<BetConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBets,
  totalOdds,
  stake,
  stakeError,
  onStakeChange,
  onStakeIncrement,
  onConfirmBet,
  onRemoveBet,
}) => {
  console.log(selectedBets, totalOdds, stake);
  // Get player data from Redux; walletBalance and chatId (player's telegramId)
  const { data: playerData } = useAppSelector((state) => state.player);
  const walletBalance = playerData ? playerData.balance : 0;
  const playerChatId = playerData ? playerData.telegramId : "";

  const dispatch = useAppDispatch();

  // Optionally still keep chatId from Telegram WebApp if needed (this may be redundant if you already have it in playerData)
  const [chatId, setChatId] = useState<string>("");
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { initDataUnsafe } = window.Telegram.WebApp;
      if (initDataUnsafe && Object.keys(initDataUnsafe).length !== 0) {
        const { user } = initDataUnsafe;
        if (user) {
          setChatId(user.id.toString());
        }
      }
    } else {
      console.warn(
        "Telegram WebApp is not available. Make sure you're running inside Telegram."
      );
    }
  }, []);

  // Function to handle the bet confirmation.
  const handleConfirmBet = async () => {
    if (!playerChatId) {
      console.error("Chat ID is not available.");
      return;
    }

    // Construct the payload according to your BetDto.
    // Here, we're mapping the selected bets to the selections array.
    const betData = {
      telegramId: playerChatId, // using the player's telegramId from Redux
      bookmaker: "Bwin", // Change or make dynamic as needed.
      stake: Number(stake),
      finalOdd: totalOdds,
      selections: selectedBets.map((bet) => ({
        fixtureId: bet.fixtureId,
        betType: bet.type, // maps to BetSelectionDto.betType
        betValue: bet.option, // maps to BetSelectionDto.betValue
        odd: bet.odd,
        homeTeam: bet.homeTeam,
        awayTeam: bet.awayTeam,
      })),
    };

    try {
      const savedBet = await saveBet(betData, selectedBets, Number(stake));
      console.log("Bet saved successfully:", savedBet);
      // Notify success and clear selected bets if needed.
      onConfirmBet();
    } catch (error) {
      console.error("Error saving bet:", error);
      // Optionally, handle error notification here.
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-sm mx-auto bg-white dark:bg-background-dark/50 text-gray-900 border border-gray-700 rounded-lg overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Confirm Your Bets
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-[#2E4052] dark:text-white">
              Selected Bets
            </h4>
            {selectedBets.map((bet) => (
              <div
                key={bet.fixtureId}
                className="bg-primary p-4 rounded-lg relative"
              >
                <button
                  onClick={() => onRemoveBet(bet.fixtureId)}
                  className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-700 " />
                </button>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#2E4052]">
                    {bet.homeTeam} vs {bet.awayTeam}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{bet.type}</p>
                    <p className="text-sm text-gray-900">{bet.option}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">X{bet.odd}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stake Input Section */}
          <div className="space-y-3">
            <div className="space-y-2">
              <label
                htmlFor="stake"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Stake Amount (Min: 5 birr)
              </label>
              <input
                type="number"
                id="stake"
                value={stake || ""}
                onChange={(e) => onStakeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {stakeError && (
                <p className="text-red-500 text-sm mt-1">{stakeError}</p>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => onStakeIncrement(5)}
                className="bg-primary/20 dark:bg-primary hover:bg-primary/40 text-gray-900"
              >
                +5
              </Button>
              <Button
                onClick={() => onStakeIncrement(10)}
                className="bg-primary/20 hover:bg-primary/40 dark:bg-primary text-gray-900"
              >
                +10
              </Button>
              <Button
                onClick={() => onStakeIncrement(20)}
                className="bg-primary/20 hover:bg-primary/40 text-gray-900 dark:bg-primary"
              >
                +20
              </Button>
              <Button
                onClick={() => onStakeIncrement(100)}
                className="bg-primary/20 hover:bg-primary/40 text-gray-900 dark:bg-primary"
              >
                +100
              </Button>
            </div>
          </div>

          <div className="flex justify-between py-2 border-t border-gray-700 dark:border-white dark:text-white">
            <span>Total Odds</span>
            <span className="font-medium text-[#2E4052] dark:text-gray-300">
              X{totalOdds.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-t border-gray-700 dark:border-white dark:text-white">
            <span>Possible Win</span>
            <span className="font-medium text-[#2E4052] dark:text-gray-300">
              {(stake * totalOdds).toFixed(2)} birr
            </span>
          </div>

          <div className="flex justify-between py-2 border-t border-gray-700 dark:border-white dark:text-white">
            <span>Wallet Balance</span>
            <span className="font-medium text-[#2E4052] dark:text-gray-300">
              {walletBalance.toFixed(2)} birr
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full dark:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBet}
            className="w-full bg-primary hover:bg-primary/50 text-black"
            disabled={
              stake < 5 || stake > walletBalance || selectedBets.length === 0
            }
          >
            Confirm Bets ({selectedBets.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
