import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
// import UserDataLoader from "@/components/UserDataLoader";
import Index from "./pages/Index";
import MatchDetails from "./pages/MatchDetails";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import BettingHistory from "./pages/BettingHistory";
import Transactions from "./pages/Transactions";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FiltersProvider } from "./contexts/FiltersContext";
import { Filter } from "./pages/Filter";
import { FloatingBetSlipButton } from "./components/FloatingBetSlipButton";
import Scoreboard from "./components/trial";
import Security from "./pages/Security";
import LiveBets from "./pages/liveBets";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <FiltersProvider>
            {/* <UserDataLoader /> */}
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/match/:id" element={<MatchDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/performance" element={<BettingHistory />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/filter" element={<Filter />} />
                <Route path="/trial" element={<Scoreboard />} />
                <Route path="/security" element={<Security />} />
                <Route path="/liveBet" element={<LiveBets />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* <FloatingBetSlipButton /> */}
            </BrowserRouter>
          </FiltersProvider>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
