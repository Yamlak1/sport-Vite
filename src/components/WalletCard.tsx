import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getPlayer } from "@/services/userServices";
import { deposit } from "@/services/transactionService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Wallet } from "lucide-react";

export const WalletCard = () => {
  const { t } = useLanguage();
  const [telegramId, setTelegramId] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  // State for deposit pop-up
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");

  useEffect(() => {
    // Check if the Telegram object and its WebApp property exist
    if (window.Telegram && window.Telegram.WebApp) {
      const { initDataUnsafe } = window.Telegram.WebApp;
      if (initDataUnsafe && Object.keys(initDataUnsafe).length !== 0) {
        const { user } = initDataUnsafe;
        if (user) {
          const { id, first_name, last_name } = user;
          setTelegramId(id);
          setFirstName(first_name);
          setLastName(last_name);
        }
      }
    } else {
      console.warn(
        "Telegram WebApp is not available. Make sure you're running inside Telegram."
      );
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      console.log(telegramId);

      try {
        const user = await getPlayer(telegramId);
        console.log("Fetched User:", user);
        setWalletBalance(user.balance);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [telegramId]);

  const handleDepositClick = () => {
    setShowDepositModal(true);
  };

  const handleWithdrawClick = () => {
    // Automatically populate the withdraw phone number from userData if available
    if (userData && userData.phone) {
      setWithdrawPhone(userData.phone);
    }
    setShowWithdrawModal(true);
  };

  const handleDeposit = async () => {
    if (!depositAmount || !userData) return;
    try {
      console.log("-----------------------");
      console.log(
        firstName,
        lastName,
        userData.phoneNumber,
        userData.telegramId
      );
      console.log(userData);
      const response = await deposit(
        Number(depositAmount),
        "firstName",
        "lastName",
        // userData.phoneNumber,
        "0946270789",
        userData.telegramId
      );

      console.log("Payment URL:", response.payment_url);
      window.location.href = response.payment_url;
    } catch (error) {
      console.error("Error depositing money:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawPhone) return;
    try {
      // Replace with your actual withdraw logic or service call
      console.log(
        "Withdrawing",
        withdrawAmount,
        "Birr to phone number:",
        withdrawPhone
      );
    } catch (error) {
      console.error("Error withdrawing money:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark dark:border dark:border-gray-700 shadow-lg rounded-2xl p-3 relative mt-3">
      <div className="mb-6">
        <p className="text-black dark:text-white font-semibold mb-1">
          {t("wallet.currentBalance")}
        </p>
        <h1 className="text-4xl font-bold text-black dark:text-white bg-clip-text text-gray-900">
          {walletBalance} Birr
        </h1>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleWithdrawClick}
          className="flex-1 bg-gray-900 dark:bg-white dark:text-black backdrop-blur-lg border-white/10 hover:bg-gray-900/50 text-white hover:text-black rounded-2xl"
        >
          {t("wallet.withdraw")}
        </Button>
        <Button
          variant="outline"
          onClick={handleDepositClick}
          className="flex-1 text-gray-900 backdrop-blur-lg border-white/10 hover:bg-[#FACD6A]/50 rounded-2xl bg-primary"
        >
          {t("wallet.deposit")}
        </Button>
      </div>

      {/* Deposit Pop-up Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 dark:bg-background-dark">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              {t("wallet.deposit")}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="depositAmount"
                className="block text-sm font-medium text-black dark:text-white mb-1"
              >
                Amount
              </label>
              <input
                id="depositAmount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter Amount"
                className="border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleDeposit}
                className="bg-primary text-gray-900 rounded-xl px-6 py-1 text-sm"
              >
                Confirm
              </Button>
              <Button
                onClick={() => setShowDepositModal(false)}
                className="bg-gray-900 hover:bg-gray-600 text-gray-200 rounded-xl px-4 py-1 text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Pop-up Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 dark:bg-background-dark">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              {t("wallet.withdraw")}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="withdrawAmount"
                className="block text-sm font-medium text-black mb-1 dark:text-white"
              >
                Amount
              </label>
              <input
                id="withdrawAmount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter Amount"
                className="border rounded px-2 py-1 text-sm w-full text-black"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="withdrawPhone"
                className="block text-sm font-medium text-black mb-1 dark:text-white"
              >
                Phone Number
              </label>
              <input
                id="withdrawPhone"
                type="tel"
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
                placeholder="Enter Phone Number"
                className="border rounded px-2 py-1 text-sm w-full text-black"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleWithdraw}
                className="bg-primary hover:bg-[#FACD6A]/80 text-gray-900 rounded-xl px-6 py-1 text-sm"
              >
                Withdraw
              </Button>
              <Button
                onClick={() => setShowWithdrawModal(false)}
                className="bg-gray-900 text-gray-200 hover:bg-gray-600 rounded-xl px-4 py-1 text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
