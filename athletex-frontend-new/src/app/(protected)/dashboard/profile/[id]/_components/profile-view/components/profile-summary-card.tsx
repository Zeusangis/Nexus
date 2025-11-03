import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Activity, AlertCircle, TrendingUp } from "lucide-react";
import type { UserData } from "../types";
import { getRiskColor, getRoleColor } from "../utils";

interface ProfileSummaryCardProps {
  user: UserData;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  user,
}) => {
  return (
    <Card className="rounded-2xl border-2 shadow-lg">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/10">
            <AvatarImage src="/placeholder.svg" alt={user.fullName} />
            <AvatarFallback className="text-2xl">
              {user.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold mb-2 text-balance">
            {user.fullName}
          </h2>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{user.email}</span>
          </div>

          <Badge
            variant="outline"
            className={`${getRoleColor(user.role)} mb-6`}
          >
            {user.role}
          </Badge>

          <Separator className="my-4 w-full" />

          {user.role === "ATHELETE" && user.athleteProfile && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  BMI
                </span>
                <span className="font-medium">
                  {user.athleteProfile.bmi.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Risk Level
                </span>
                <Badge
                  variant="outline"
                  className={getRiskColor(user.athleteProfile.riskLevel)}
                >
                  {user.athleteProfile.riskLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Risk Score
                </span>
                <span className="font-medium">
                  {user.athleteProfile.riskScore}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
