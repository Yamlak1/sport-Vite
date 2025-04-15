// dateUtils.ts

export function formatDateLong(dateStr: string): string {
  const dateObj = new Date(dateStr); // e.g. "2025-04-15T00:00:00+00:00"

  // Extract parts
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("en-US", { month: "long" });
  const year = dateObj.getFullYear();

  // E.g. "SUNDAY 20 OCTOBER 2019"
  return `${weekday.toUpperCase()} ${day} ${month.toUpperCase()} ${year}`;
}
