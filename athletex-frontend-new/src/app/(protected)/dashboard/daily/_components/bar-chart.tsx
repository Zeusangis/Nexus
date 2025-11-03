import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DailyLog } from "@/schema/daily-log/daily-log";
// Sample data - last 7 days including today
const weeklyLogs: DailyLog[] = [
  {
    athlete: "LeBron James",
    date: "2025-10-25",
    knee_pain: 3,
    leg_freshness: 7,
    sleep_hours: 7.0,
    training_intensity: 6,
    acl_injury_score: 0.15,
    stiffness_level: 4,
    calorie_intake: 2900,
  },
  {
    athlete: "LeBron James",
    date: "2025-10-26",
    knee_pain: 2,
    leg_freshness: 8,
    sleep_hours: 8.0,
    training_intensity: 5,
    acl_injury_score: 0.12,
    stiffness_level: 3,
    calorie_intake: 2850,
  },
  {
    athlete: "LeBron James",
    date: "2025-10-27",
    knee_pain: 4,
    leg_freshness: 6,
    sleep_hours: 6.5,
    training_intensity: 7,
    acl_injury_score: 0.18,
    stiffness_level: 5,
    calorie_intake: 3000,
  },
  {
    athlete: "LeBron James",
    date: "2025-10-28",
    knee_pain: 2,
    leg_freshness: 8,
    sleep_hours: 7.5,
    training_intensity: 6,
    acl_injury_score: 0.13,
    stiffness_level: 3,
    calorie_intake: 2800,
  },
  {
    athlete: "LeBron James",
    date: "2025-10-29",
    knee_pain: 3,
    leg_freshness: 7,
    sleep_hours: 7.0,
    training_intensity: 6,
    acl_injury_score: 0.14,
    stiffness_level: 4,
    calorie_intake: 2900,
  },
  {
    athlete: "LeBron James",
    date: "2025-10-30",
    knee_pain: 2,
    leg_freshness: 9,
    sleep_hours: 8.5,
    training_intensity: 5,
    acl_injury_score: 0.11,
    stiffness_level: 2,
    calorie_intake: 2750,
  },
  {
    athlete: "LeBron James",
    date: "2025-10-31",
    knee_pain: 2,
    leg_freshness: 9,
    sleep_hours: 7.5,
    training_intensity: 6,
    acl_injury_score: 0.12,
    stiffness_level: 3,
    calorie_intake: 2800,
  },
];

const todayLog: DailyLog = weeklyLogs[weeklyLogs.length - 1];

const calculateAverage = (field: keyof DailyLog) => {
  const values = weeklyLogs.map((log) => log[field] as number);
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const weeklyAverages = {
  knee_pain: calculateAverage("knee_pain"),
  leg_freshness: calculateAverage("leg_freshness"),
  sleep_hours: calculateAverage("sleep_hours"),
  training_intensity: calculateAverage("training_intensity"),
  acl_injury_score: calculateAverage("acl_injury_score"),
  stiffness_level: calculateAverage("stiffness_level"),
  calorie_intake: calculateAverage("calorie_intake"),
};

const barChartData = [
  {
    metric: "Knee Pain",
    today: todayLog.knee_pain,
    weekly: weeklyAverages.knee_pain,
  },
  {
    metric: "Leg Freshness",
    today: todayLog.leg_freshness,
    weekly: weeklyAverages.leg_freshness,
  },
  {
    metric: "Stiffness",
    today: todayLog.stiffness_level,
    weekly: weeklyAverages.stiffness_level,
  },
  {
    metric: "Sleep (hrs)",
    today: todayLog.sleep_hours,
    weekly: weeklyAverages.sleep_hours,
  },
  {
    metric: "Training",
    today: todayLog.training_intensity,
    weekly: weeklyAverages.training_intensity,
  },
  {
    metric: "Calories (÷100)",
    today: todayLog.calorie_intake / 100,
    weekly: weeklyAverages.calorie_intake / 100,
  },
];
export function BarChartDisplay() {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Today vs Weekly Average</CardTitle>
        <CardDescription>Detailed metric comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            today: {
              label: "Today",
              color: "hsl(var(--chart-1))",
            },
            weekly: {
              label: "Weekly Avg",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={barChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="metric" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="today"
                fill="hsl(var(--chart-1))"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="weekly"
                fill="hsl(var(--chart-2))"
                radius={[0, 4, 4, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
