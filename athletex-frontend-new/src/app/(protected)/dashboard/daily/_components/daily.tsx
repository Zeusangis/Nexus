"use client";

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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { AddLogDialog } from "./add-log-dialog";
import { BarChartDisplay } from "./bar-chart";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useFetchDailyLogsById } from "@/utils/fetchDailyLogs";
import { DailyLogAddSchemaType } from "@/schema/daily-log/daily-log-add";
import { useGetUser } from "@/utils/getUser";

// Sample data - last 7 days including today
// export const weeklyLogs: DailyLog[] = [
//   {
//     athlete: "LeBron James",
//     date: "2025-10-25",
//     knee_pain: 3,
//     leg_freshness: 7,
//     sleep_hours: 7.0,
//     training_intensity: 6,
//     acl_injury_score: 0.15,
//     stiffness_level: 4,
//     calorie_intake: 2900,
//   },
//   {
//     athlete: "LeBron James",
//     date: "2025-10-26",
//     knee_pain: 2,
//     leg_freshness: 8,
//     sleep_hours: 8.0,
//     training_intensity: 5,
//     acl_injury_score: 0.12,
//     stiffness_level: 3,
//     calorie_intake: 2850,
//   },
//   {
//     athlete: "LeBron James",
//     date: "2025-10-27",
//     knee_pain: 4,
//     leg_freshness: 6,
//     sleep_hours: 6.5,
//     training_intensity: 7,
//     acl_injury_score: 0.18,
//     stiffness_level: 5,
//     calorie_intake: 3000,
//   },
//   {
//     athlete: "LeBron James",
//     date: "2025-10-28",
//     knee_pain: 2,
//     leg_freshness: 8,
//     sleep_hours: 7.5,
//     training_intensity: 6,
//     acl_injury_score: 0.13,
//     stiffness_level: 3,
//     calorie_intake: 2800,
//   },
//   {
//     athlete: "LeBron James",
//     date: "2025-10-29",
//     knee_pain: 3,
//     leg_freshness: 7,
//     sleep_hours: 7.0,
//     training_intensity: 6,
//     acl_injury_score: 0.14,
//     stiffness_level: 4,
//     calorie_intake: 2900,
//   },
//   {
//     athlete: "LeBron James",
//     date: "2025-10-30",
//     knee_pain: 2,
//     leg_freshness: 9,
//     sleep_hours: 8.5,
//     training_intensity: 5,
//     acl_injury_score: 0.11,
//     stiffness_level: 2,
//     calorie_intake: 2750,
//   },
//   {
//     athlete: "LeBron James",
//     date: "2025-10-31",
//     knee_pain: 2,
//     leg_freshness: 9,
//     sleep_hours: 7.5,
//     training_intensity: 6,
//     acl_injury_score: 0.12,
//     stiffness_level: 3,
//     calorie_intake: 2800,
//   },
// ];

export default function AthleteComparisonDashboard() {
  const { data: currentUser } = useGetUser();
  const { data: weeklyLogsData, isLoading } = useFetchDailyLogsById(
    currentUser?.data?.user?.athleteProfile.id || ""
  );
  console.log(weeklyLogsData);

  const todayLog =
    weeklyLogsData && weeklyLogsData.length > 0
      ? weeklyLogsData[weeklyLogsData.length - 1]
      : null;
  console.log(todayLog);
  const userName = currentUser?.data?.user?.fullName || "Athlete";

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading daily logs...</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!weeklyLogsData || weeklyLogsData.length === 0 || !todayLog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div>No daily logs found. Add your first log to get started!</div>
        <AddLogDialog />
      </div>
    );
  }

  // Calculate weekly averages
  const calculateAverage = (field: keyof DailyLogAddSchemaType) => {
    const values = weeklyLogsData
      ? weeklyLogsData.map((log: DailyLogAddSchemaType) => log[field] as number)
      : [];
    return values.length > 0
      ? values.reduce((sum: number, val: number) => sum + val, 0) /
          values.length
      : 0;
  };

  const weeklyAverages = {
    kneePain: calculateAverage("kneePain"),
    legFreshness: calculateAverage("legFreshness"),
    sleepHours: calculateAverage("sleepHours"),
    trainingIntensity: calculateAverage("trainingIntensity"),
    aclInjuryScore: calculateAverage("aclInjuryScore"),
    stiffnessLevel: calculateAverage("stiffnessLevel"),
    calorieIntake: calculateAverage("calorieIntake"),
  };

  // Calculate overall status (average of normalized metrics)
  const calculateOverallStatus = (log: DailyLogAddSchemaType) => {
    const normalized = [
      (10 - log.kneePain) / 10, // Invert pain (lower is better)
      log.legFreshness / 10,
      log.sleepHours / 10,
      log.trainingIntensity / 10,
      1 - log.aclInjuryScore, // Invert injury score
      (10 - log.stiffnessLevel) / 10, // Invert stiffness
      log.calorieIntake / 3500, // Normalize calories
    ];
    return (
      (normalized.reduce((sum, val) => sum + val, 0) / normalized.length) * 100
    );
  };

  const todayStatus = calculateOverallStatus(todayLog);
  const weeklyStatus = calculateOverallStatus({
    ...todayLog,
    ...weeklyAverages,
  });

  // Prepare radar chart data
  const radarChartData = [
    {
      metric: "Leg Freshness",
      today: todayLog.legFreshness,
      weekly: weeklyAverages.legFreshness,
    },
    {
      metric: "Sleep Quality",
      today: todayLog.sleepHours,
      weekly: weeklyAverages.sleepHours,
    },
    {
      metric: "Training",
      today: todayLog.trainingIntensity,
      weekly: weeklyAverages.trainingIntensity,
    },
    {
      metric: "Low Pain",
      today: 10 - todayLog.kneePain,
      weekly: 10 - weeklyAverages.kneePain,
    },
    {
      metric: "Flexibility",
      today: 10 - todayLog.stiffnessLevel,
      weekly: 10 - weeklyAverages.stiffnessLevel,
    },
  ];

  const logs: DailyLogAddSchemaType[] = weeklyLogsData || [];
  logs.map((log) => console.log(log.kneePain));

  // const handleInputChange = (field: keyof DailyLogAddSchemaType, value: string | number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  // const handleSave = () => {
  //   console.log("Saving updated log:", formData);
  //   // Here you would typically save to your backend
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div className="">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  {userName}
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">
                  {new Date(todayLog.date || new Date()).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
          <AddLogDialog />
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="border-2 transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Today&apos;s Overall Status
                {todayStatus > weeklyStatus ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                )}
              </CardTitle>
              <CardDescription>Composite score of all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-primary">
                {todayStatus.toFixed(1)}%
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {todayStatus > weeklyStatus ? "Above" : "Below"} weekly average
                by {Math.abs(todayStatus - weeklyStatus).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Weekly Average</CardTitle>
              <CardDescription>7-day rolling average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-muted-foreground">
                {weeklyStatus.toFixed(1)}%
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Baseline performance level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <BarChartDisplay />

          {/* Radar Chart */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Performance Balance</CardTitle>
              <CardDescription>Overall performance profile</CardDescription>
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
                  <RadarChart data={radarChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar
                      name="Today"
                      dataKey="today"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Weekly Avg"
                      dataKey="weekly"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Knee Pain</TableHead>
                <TableHead className="font-semibold">Leg Freshness</TableHead>
                <TableHead className="font-semibold">
                  Training Intensity
                </TableHead>
                <TableHead className="font-semibold">Sleep Hours</TableHead>
                <TableHead className="font-semibold">Stiffness Level</TableHead>
                <TableHead className="font-semibold">Calorie Intake</TableHead>
                <TableHead className="font-semibold">
                  ACL Injury Score
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.kneePain}</TableCell>
                  <TableCell>{log.legFreshness}</TableCell>
                  <TableCell>{log.trainingIntensity}</TableCell>
                  <TableCell>{log.sleepHours}</TableCell>
                  <TableCell>{log.stiffnessLevel}</TableCell>
                  <TableCell>{log.calorieIntake}</TableCell>
                  <TableCell>{log.aclInjuryScore.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
