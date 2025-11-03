"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Save, X, Edit } from "lucide-react";
import { useUpdateProfile } from "@/utils/updateProfile";
import { calculateBmi } from "@/utils/bmi";
import { ProfileSummaryCard } from "./profile-view/components";
import { AthleteChatDialog } from "./athlete-chat-dialog";
import type { UserData } from "./profile-view/types";
import { Athlete } from "@/utils/fetchAthletes";
import { AthleteStatsGrid } from "./profile-view/components/athlete-stats-grid";
import { useGetUser } from "@/utils/getUser";
import { toast } from "sonner";

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

export default function UserProfile({ athleteData }: { athleteData: Athlete }) {
  const params = useParams();
  const { mutate: updateProfileMutation, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Get current logged-in user to check if they're a coach
  const { data: currentUserData } = useGetUser();
  const currentUser = currentUserData?.data?.user;
  console.log(currentUser);
  const isCoach = currentUser?.role === "COACH";

  // Convert Athlete to UserData format
  const user: UserData = {
    id: athleteData.userId,
    fullName: athleteData.user.fullName,
    email: athleteData.user.email,
    role: athleteData.user.role as "ATHELETE" | "COACH",
    athleteProfile: {
      id: athleteData.id,
      userId: athleteData.userId,
      age: athleteData.age,
      gender: athleteData.gender,
      height: athleteData.height,
      weight: athleteData.weight,
      bmi: athleteData.bmi,
      riskLevel: athleteData.riskLevel as "LOW" | "MEDIUM" | "HIGH",
      sportId: athleteData.sportId,
      riskScore: athleteData.riskScore,
      trainingType: athleteData.trainingType,
      experienceLevel: athleteData.experienceLevel,
      limitations: athleteData.limitations,
    },
  };

  // Initialize React Hook Form
  const { register, watch, setValue, handleSubmit, reset } =
    useForm<ProfileFormData>({
      defaultValues: {
        fullName: user.fullName,
        email: user.email,
        age: user.athleteProfile?.age || 0,
        gender: user.athleteProfile?.gender || "MALE",
        height: user.athleteProfile?.height || 0,
        weight: user.athleteProfile?.weight || 0,
        bmi: user.athleteProfile?.bmi || 0,
        riskScore: user.athleteProfile?.riskScore || 0,
        trainingType: user.athleteProfile?.trainingType || "",
        experienceLevel: user.athleteProfile?.experienceLevel || "",
        limitations: user.athleteProfile?.limitations || "",
      },
    });

  const height = watch("height");
  const weight = watch("weight");
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    if (height > 0 && weight > 0) {
      const rounded = calculateBmi(weight, height);
      setBmi(rounded);
      setValue("bmi", rounded);
    } else {
      setBmi(null);
      setValue("bmi", 0);
    }
  }, [height, weight, setValue]);

  // Get all form values for display
  const formData = watch();

  const onSubmit = async (data: ProfileFormData) => {
    console.log("=== Save Profile Debug ===");
    console.log("User ID:", user.id);
    console.log("Form Data:", data);

    const payload = {
      userId: user.id,
      profileData: {
        fullName: data.fullName,
        email: data.email,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        bmi: data.bmi,
        riskScore: data.riskScore,
        trainingType: data.trainingType,
        experienceLevel: data.experienceLevel,
        limitations: data.limitations,
      },
    };

    console.log("Payload being sent:", payload);
    updateProfileMutation(payload, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    reset({
      fullName: user.fullName,
      email: user.email,
      age: user.athleteProfile?.age || 0,
      gender: user.athleteProfile?.gender || "MALE",
      height: user.athleteProfile?.height || 0,
      weight: user.athleteProfile?.weight || 0,
      bmi: user.athleteProfile?.bmi || 0,
      riskScore: user.athleteProfile?.riskScore || 0,
      trainingType: user.athleteProfile?.trainingType || "",
      experienceLevel: user.athleteProfile?.experienceLevel || "",
      limitations: user.athleteProfile?.limitations || "",
    });
    setIsEditing(false);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Saving profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-balance">
              User Profile
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Edit your profile information"
                : "View and manage profile information"}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Show Chat button only when current user is a coach viewing an athlete */}
            {isCoach && (
              <AthleteChatDialog
                athleteId={params.id as string}
                athleteName={user.fullName}
              />
            )}
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <ProfileSummaryCard user={user} />
          </motion.div>

          {/* Right Column - Detailed Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Information Card */}
            <Card className="rounded-2xl border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm font-medium p-2 bg-muted rounded-md">
                        {user.fullName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-sm font-medium p-2 bg-muted rounded-md">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Athlete Profile Card */}
            {user.role === "ATHELETE" && user.athleteProfile && (
              <Card className="rounded-2xl border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Athlete Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AthleteStatsGrid
                    athleteProfile={{
                      ...user.athleteProfile,
                      age: formData.age,
                      gender: formData.gender,
                      height: formData.height,
                      weight: formData.weight,
                      riskScore: formData.riskScore,
                      trainingType: formData.trainingType,
                      experienceLevel: formData.experienceLevel,
                    }}
                    isEditing={isEditing}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                  />

                  {/* Limitations Section */}
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="limitations">Limitations / Notes</Label>
                    {isEditing ? (
                      <Textarea
                        id="limitations"
                        {...register("limitations")}
                        placeholder="Any injuries, medical conditions, or limitations..."
                        rows={4}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-sm p-3 bg-muted rounded-md min-h-[100px]">
                        {formData.limitations || "No limitations specified"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
