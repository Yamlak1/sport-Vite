import { useState } from "react";

export const BettingActivityCalendar = () => {
  const [year] = useState(new Date().getFullYear());
  const [month] = useState(new Date().getMonth());

  // Sample data - in a real app, this would come from your backend
  const bettingDays = {
    "2024-02-01": 3,
    "2024-02-05": 1,
    "2024-02-10": 4,
    "2024-02-15": 2,
    "2024-02-20": 5,
  };

  const getIntensityClass = (count: number) => {
    if (!count) return "bg-gray-800";
    if (count === 1) return "bg-primary/20";
    if (count === 2) return "bg-primary/40";
    if (count === 3) return "bg-primary/60";
    if (count === 4) return "bg-primary/80";
    return "bg-primary";
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-6 h-6" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const betCount = bettingDays[date] || 0;

      days.push(
        <div
          key={date}
          className={`w-6 h-6 rounded-sm ${getIntensityClass(betCount)}`}
          title={`${date}: ${betCount} bets`}
        />
      );
    }

    return days;
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 min-w-[600px]">
        {renderCalendar()}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-400">Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-gray-800" />
          <div className="w-4 h-4 rounded-sm bg-primary/20" />
          <div className="w-4 h-4 rounded-sm bg-primary/40" />
          <div className="w-4 h-4 rounded-sm bg-primary/60" />
          <div className="w-4 h-4 rounded-sm bg-primary/80" />
          <div className="w-4 h-4 rounded-sm bg-primary" />
        </div>
        <span className="text-sm text-gray-400">More</span>
      </div>
    </div>
  );
};
