import { useEffect } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  User,
  Ruler,
  Weight,
  Activity,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AthleteProfile } from "../types";
import { getRiskColor, formatGender } from "../utils";
import { calculateBmi } from "@/utils/bmi";

interface ProfileFormData {
  fullName: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  riskScore: number;
  trainingType: string;
  experienceLevel: string;
  limitations: string;
}

interface AthleteStatsGridProps {
  athleteProfile: AthleteProfile;
  isEditing: boolean;
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
}

export const AthleteStatsGrid: React.FC<AthleteStatsGridProps> = ({
  athleteProfile,
  isEditing,
  register,
  watch,
  setValue,
}) => {
  const height = watch("height");
  const weight = watch("weight");

  useEffect(() => {
    if (height > 0 && weight > 0) {
      const rounded = calculateBmi(weight, height);
      setValue("bmi", rounded);
    } else {
      setValue("bmi", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, weight]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Age */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Age
          </span>
          {isEditing ? (
            <Input
              type="number"
              {...register("age", { valueAsNumber: true })}
              className="w-24 h-8 text-right"
            />
          ) : (
            <span className="font-semibold">{athleteProfile.age} years</span>
          )}
        </div>

        {/* Gender */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Gender
          </span>
          {isEditing ? (
            <Select
              value={watch("gender")}
              onValueChange={(value) => setValue("gender", value)}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="font-semibold">
              {formatGender(athleteProfile.gender)}
            </span>
          )}
        </div>

        {/* Height */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Height
          </span>
          {isEditing ? (
            <Input
              type="number"
              {...register("height", { valueAsNumber: true })}
              className="w-24 h-8 text-right"
            />
          ) : (
            <span className="font-semibold">{athleteProfile.height} cm</span>
          )}
        </div>

        {/* Weight */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Weight className="h-4 w-4" />
            Weight
          </span>
          {isEditing ? (
            <Input
              type="number"
              {...register("weight", { valueAsNumber: true })}
              className="w-24 h-8 text-right"
            />
          ) : (
            <span className="font-semibold">{athleteProfile.weight} kg</span>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* BMI */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            BMI
          </span>
          <span className="font-semibold">{watch("bmi")?.toFixed(1)}</span>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Risk Level
          </span>
          <Badge
            variant="outline"
            className={getRiskColor(athleteProfile.riskLevel)}
          >
            {athleteProfile.riskLevel}
          </Badge>
        </div>

        {/* Risk Score */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Risk Score
          </span>
          {isEditing ? (
            <Input
              type="number"
              step="0.1"
              {...register("riskScore", { valueAsNumber: true })}
              className="w-24 h-8 text-right"
            />
          ) : (
            <span className="font-semibold">{athleteProfile.riskScore}</span>
          )}
        </div>

        {/* Training Type */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Training Type
          </span>
          {isEditing ? (
            <Input
              {...register("trainingType")}
              className="w-32 h-8 text-right"
            />
          ) : (
            <span className="font-semibold">
              {athleteProfile.trainingType || "General"}
            </span>
          )}
        </div>

        {/* Experience Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Award className="h-4 w-4" />
            Experience Level
          </span>
          {isEditing ? (
            <Input
              {...register("experienceLevel")}
              className="w-32 h-8 text-right"
            />
          ) : (
            <span className="font-semibold">
              {athleteProfile.experienceLevel || "Beginner"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
