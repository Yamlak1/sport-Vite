import React, { createContext, useContext, useState } from "react";

interface FiltersContextType {
  selectedStatus: string | null;
  selectedCountry: string | null;
  selectedLeague: string | null;
  setSelectedStatus: (status: string | null) => void;
  setSelectedCountry: (country: string | null) => void;
  setSelectedLeague: (league: string | null) => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  return (
    <FiltersContext.Provider
      value={{
        selectedStatus,
        selectedCountry,
        selectedLeague,
        setSelectedStatus,
        setSelectedCountry,
        setSelectedLeague,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
}
