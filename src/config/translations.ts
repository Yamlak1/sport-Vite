export type Language = "en" | "am";

export const translations = {
  en: {
    nav: {
      greeting: "Hey,",
    },
    wallet: {
      currentBalance: "Your Wallet",
      bonusBalance: "Bonus Balance",
      deposit: "Deposit",
      withdraw: "Withdraw",
    },
    events: {
      topEvents: "Top Events",
      seeAll: "See All",
      ongoing: "Ongoing",
      win: "to win", // New key for win
      draw: "Draw", // New key for draw
    },
    tabs: {
      home: "Home",
      performance: "Performance",
      transactions: "Transactions",
      profile: "Profile",
      explore: "Explore",
    },
    matchDetails: {
      title: "Match Details",
      fullTime: "FT",
      bets: "Bets",
      statistics: "Statistics",
      highlights: "Highlights",
      matchWinner: "Match Winner",
      possession: "Possession",
      shotsOnTarget: "Shots on Target",
      lineup: "Lineup",
    },
    notFound: {
      title: "404",
      message: "Oops! Page not found",
      returnHome: "Return to Home",
    },
    profile: {
      betHistory: "Bet History",
      transactions: "Transaction History",
      security: "Security Settings",
      support: "Support",
      logout: "Logout",
      stats: {
        totalBets: "Total Bets",
        won: "Won",
        winRate: "Win Rate",
      },
    },
    transactions: {
      title: "Transactions",
      deposit: "Deposit",
      withdraw: "Withdraw",
      pending: "Pending",
      completed: "Completed",
      history: "Transaction History",
    },
  },
  am: {
    nav: {
      greeting: "ሰላም,",
    },
    wallet: {
      currentBalance: "አሁን ያለው ቀሪ ሂሳብ",
      bonusBalance: "ተጨማሪ ቀሪ ሂሳብ",
      deposit: "ገንዘብ ያስገቡ",
      withdraw: "ገንዘብ ያውጡ",
    },
    events: {
      topEvents: "ዋና ዋና ጨዋታዎች",
      seeAll: "ሁሉንም ይመልከቱ",
      ongoing: "በመካሄድ ላይ",
      win: "ለመሸነፍ", // New key for win in Amharic
      draw: "ቅጽበት", // New key for draw in Amharic
    },
    tabs: {
      home: "ዋና ገጽ",
      performance: "አፈጻጸም",
      transactions: "ግብይቶች",
      profile: "መገለጫ",
      explore: "መመለስ",
    },
    matchDetails: {
      title: "የጨዋታ ዝርዝሮች",
      fullTime: "ሙሉ ጊዜ",
      bets: "ውርርዶች",
      statistics: "ስታትስቲክስ",
      matchWinner: "የጨዋታው አሸናፊ",
      possession: "ኳስ መያዝ",
      shotsOnTarget: "በጎል ላይ የተወሰዱ ሙከራዎች",
    },
    notFound: {
      title: "404",
      message: "ይቅርታ! ገጹ አልተገኘም",
      returnHome: "ወደ ዋና ገጽ ተመለስ",
    },
    profile: {
      betHistory: "የውርርድ ታሪክ",
      transactions: "የገንዘብ ዝውውር ታሪክ",
      security: "የደህንነት ቅንብሮች",
      support: "ድጋፍ",
      logout: "ውጣ",
      stats: {
        totalBets: "ጠቅላላ ውርርድ",
        won: "አሸናፊ",
        winRate: "የማሸነፍ መጠን",
      },
    },
    transactions: {
      title: "ግብይቶች",
      deposit: "ያስቀምጡ",
      withdraw: "ያውጡ",
      pending: "በመጠባበቅ ላይ",
      completed: "የተጠናቀቀ",
      history: "የግብይት ታሪክ",
    },
  },
};
