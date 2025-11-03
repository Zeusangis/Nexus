import type React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  iconBgClass: string;
  iconTextClass: string;
  change?: { percentage: string; type: "increase" | "decrease" };
  className?: string;
  valueColorClass?: string;
}

export function DashboardCard({
  icon: Icon,
  title,
  value,
  iconBgClass,
  iconTextClass,
  className,
  change,
  valueColorClass = "text-gray-900",
}: DashboardCardProps) {
  const ChangeIcon = change?.type === "decrease" ? ArrowDown : ArrowUp;
  const changeTextColorClass =
    change?.type === "decrease" ? "text-red-600" : "text-green-600";
  const changeBgClass =
    change?.type === "decrease" ? "bg-red-100" : "bg-green-100";
  const changeBorderClass =
    change?.type === "decrease" ? "border-red-200" : "border-green-200";

  return (
    <div
      className={cn("flex flex-col justify-between h-full gap-3", className)}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", iconBgClass)}>
          <Icon className={cn("h-8 w-8", iconTextClass)} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{title}</span>
          <span className={cn("text-xl font-bold", valueColorClass)}>
            {value}
          </span>
        </div>
      </div>
      {change && (
        <div className="mt-auto flex items-center text-xs">
          <span
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full border",
              changeBgClass,
              changeBorderClass,
              changeTextColorClass
            )}
          >
            <ChangeIcon className="h-4 w-4" />
            {change.percentage}
          </span>
          <span className="ml-2 text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
}
