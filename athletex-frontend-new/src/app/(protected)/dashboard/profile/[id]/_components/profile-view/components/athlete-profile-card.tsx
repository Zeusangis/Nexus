import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit, Save, X } from "lucide-react";
import type { UserData } from "../types";
import { AthleteStatsGrid } from "./athlete-stats-grid";
import { LimitationsSection } from "./limitations-section";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

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

interface AthleteProfileCardProps {
  user: UserData;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onFieldChange: (field: string, value: string | number) => void;
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
}

export const AthleteProfileCard: React.FC<AthleteProfileCardProps> = ({
  user,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onFieldChange,
  register,
  watch,
  setValue,
}) => {
  if (user.role !== "ATHELETE" || !user.athleteProfile) return null;

  return (
    <Card className="rounded-2xl border-2 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Athlete Profile
        </CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={onStartEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancelEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <AthleteStatsGrid
          athleteProfile={user.athleteProfile}
          isEditing={isEditing}
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <LimitationsSection
          limitations={user.athleteProfile.limitations ?? null}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
      </CardContent>
    </Card>
  );
};
