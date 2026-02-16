import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getProgressColorHsl } from "@/data/mockData";

interface ProgressPieChartProps {
  progress: number;
  size?: number;
}

const ProgressPieChart = ({ progress, size = 220 }: ProgressPieChartProps) => {
  const data = [
    { name: "Achieved", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  const achievedColor = getProgressColorHsl(progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={achievedColor} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{progress}%</span>
        <span className="text-xs text-muted-foreground">Overall Progress</span>
      </div>
    </div>
  );
};

export default ProgressPieChart;
