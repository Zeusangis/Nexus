"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "Revenue analysis bar chart for full year";

const revenueData = [
  { month: "January", credit: 120000, debit: 80000 },
  { month: "February", credit: 110000, debit: 70000 },
  { month: "March", credit: 150000, debit: 95000 },
  { month: "April", credit: 100000, debit: 60000 },
  { month: "May", credit: 140000, debit: 85000 },
  { month: "June", credit: 160000, debit: 90000 },
  { month: "July", credit: 170000, debit: 100000 },
  { month: "August", credit: 180000, debit: 110000 },
  { month: "September", credit: 155000, debit: 95000 },
  { month: "October", credit: 130000, debit: 75000 },
  { month: "November", credit: 135000, debit: 80000 },
  { month: "December", credit: 145000, debit: 85000 },
];

const revenueChartConfig = {
  credit: {
    label: "Credit Amount",
    color: "#27ae60",
  },
  debit: {
    label: "Debit Amount",
    color: "#c0392b",
  },
} satisfies ChartConfig;

export function RevenueCollectionChart() {
  const isMobile = useIsMobile();
  const barSize = isMobile ? 6 : 26;
  return (
    <Card className="border-0 shadow-xs">
      <CardHeader>
        <CardTitle>Revenue Analysis - Bar Chart</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig}>
          <BarChart
            height={250}
            data={revenueData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="credit" fill="#27ae60" radius={2} barSize={barSize} />
            <Bar dataKey="debit" fill="#c0392b" radius={2} barSize={barSize} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
