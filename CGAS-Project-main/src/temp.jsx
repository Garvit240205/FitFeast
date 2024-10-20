import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Temp = () => {
  const calorieData = [
    {
      day: "Mon",
      caloriesConsumed: 1800,
      caloriesBurned: 1600,
    },
    {
      day: "Tue",
      caloriesConsumed: 2800,
      caloriesBurned: 2600,
    },
    {
      day: "Wed",
      caloriesConsumed: 1000,
      caloriesBurned: 1600,
    },
    {
      day: "Thu",
      caloriesConsumed: 4800,
      caloriesBurned: 1600,
    },
    {
      day: "Fri",
      caloriesConsumed: 1200,
      caloriesBurned: 900,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart data={calorieData}>
        <defs>
          <linearGradient id="color" x1={0} x2={0} y1={0} y2={1}>
            <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
            <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="caloriesBurned"
          stroke="#2451B7"
          fill="url(#color)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Temp;
