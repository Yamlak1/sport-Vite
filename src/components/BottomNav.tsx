import { Home, Filter, List, User, Search, Radio } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { icon: Home, label: t("tabs.home"), path: "/" },
    { icon: Search, label: t("tabs.explore"), path: "/filter" },
    { icon: Radio, label: t("tabs.liveBet"), path: "/liveBet" },
    { icon: List, label: t("tabs.transactions"), path: "/transactions" },
    { icon: User, label: t("tabs.profile"), path: "/profile" },
  ];

  return (
    <div className="bg-white dark:bg-background-dark dark:border-gray-700 backdrop-blur-lg border border-gray-700 rounded-2xl flex justify-around items-center p-2 shadow-lg h-14">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.label}
            className={`flex flex-col items-center justify-center px-4 transition-all duration-200 ${
              isActive
                ? "text-[#BDD9BF] p-2 rounded-full h-full"
                : "text-gray-400"
            }`}
            onClick={() => navigate(tab.path)}
          >
            <tab.icon className="w-5 h-5" />
            <span
              className={`text-xs mt-1 transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0 h-0"
              }`}
            ></span>
          </button>
        );
      })}
    </div>
  );
};
