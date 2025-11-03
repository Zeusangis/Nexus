import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AthleteProfileCardProps {
  formData: {
    age: string | number;
    gender: string;
    height: string | number;
    weight: string | number;
    riskScore: string | number;
    trainingType: string;
    experienceLevel: string;
    limitations: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const AthleteProfileCard: React.FC<AthleteProfileCardProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <Card className="rounded-2xl border-2 shadow-lg">
      <CardHeader>
        <CardTitle>Athlete Profile</CardTitle>
        <CardDescription>Update your athletic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="Enter your height"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Enter your weight"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskScore">Risk Score</Label>
            <Input
              id="riskScore"
              name="riskScore"
              type="number"
              step="0.1"
              value={formData.riskScore}
              onChange={handleInputChange}
              placeholder="Enter risk score"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainingType">Training Type</Label>
            <Input
              id="trainingType"
              name="trainingType"
              value={formData.trainingType}
              onChange={handleInputChange}
              placeholder="e.g., General, Strength, Endurance"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Input
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              placeholder="e.g., Beginner, Intermediate, Advanced"
            />
          </div>
        </div>

        {/* Limitations - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="limitations">Limitations</Label>
          <textarea
            id="limitations"
            name="limitations"
            value={formData.limitations}
            onChange={handleInputChange}
            placeholder="Enter any physical limitations or injuries..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
