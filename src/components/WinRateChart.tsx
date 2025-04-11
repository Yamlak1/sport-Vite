import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jan", winRate: 45 },
  { date: "Feb", winRate: 52 },
  { date: "Mar", winRate: 48 },
  { date: "Apr", winRate: 61 },
  { date: "May", winRate: 55 },
  { date: "Jun", winRate: 67 },
  { date: "Jul", winRate: 57 },
];

export const WinRateChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#000" />
        <XAxis dataKey="date" stroke="red" tick={{ fill: "#9CA3AF" }} />
        <YAxis stroke="green" tick={{ fill: "#9CA3AF" }} domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "0.375rem",
          }}
          itemStyle={{ color: "#D1D5DB" }}
          labelStyle={{ color: "#D1D5DB" }}
        />
        <Line
          type="monotone"
          dataKey="winRate"
          stroke="#D946EF"
          strokeWidth={2}
          dot={{ fill: "#D946EF", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
