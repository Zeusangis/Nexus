"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  athleteEditSchema,
  type AthleteEditSchemaType,
} from "@/schema/athletes/athlete-add";
import { useEffect } from "react";
import TextInput from "@/components/molecules/text-input";
import { useEditAthlete } from "@/utils/editAthlete";
import { calculateBmi } from "@/utils/bmi";
import { useRouter } from "next/navigation";
import { AthleteUser } from "@/utils/fetchAthleteWithId";
export default function EditAthleteForm({ athlete }: { athlete: AthleteUser }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AthleteEditSchemaType>({
    resolver: zodResolver(athleteEditSchema),
  });
  const { mutate: editAthlete, isPending } = useEditAthlete();
  const router = useRouter();

  const onSubmit = async (data: AthleteEditSchemaType) => {
    editAthlete(
      { id: athlete.athleteProfile.userId, athleteData: data },
      {
        onSuccess: () => {
          router.push("/dashboard/athletes");
        },
      }
    );
  };

  const height = watch("height");
  const weight = watch("weight");

  useEffect(() => {
    const rounded = calculateBmi(weight, height);
    setValue("bmi", rounded);
  }, [height, weight, setValue]);

  // Populate the form when the athlete prop arrives (works well with async data)
  useEffect(() => {
    if (!athlete) return;
    reset({
      fullName: athlete.fullName ?? "",
      email: athlete.email ?? "",
      age: athlete.athleteProfile?.age ?? 0,
      gender: athlete.athleteProfile?.gender ?? "male",
      height: athlete.athleteProfile?.height ?? 0,
      weight: athlete.athleteProfile?.weight ?? 0,
      bmi: athlete.athleteProfile?.bmi ?? 0,
    });
  }, [athlete, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-2xl mx-auto p-6"
    >
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <div className="space-y-2">
            <Label htmlFor="full_name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <TextInput
              error={errors.fullName?.message}
              id="full_name"
              placeholder="Enter full name"
              /* value populated via react-hook-form reset */
              {...register("fullName")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              /* value populated via react-hook-form reset */
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">
                Age <span className="text-destructive">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                /* value populated via react-hook-form reset */
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("gender")}
                onValueChange={(value) => setValue("gender", value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Physical Measurements Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Physical Measurements</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">
                Height (cm) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                /* value populated via react-hook-form reset */
                placeholder="Enter height"
                {...register("height", { valueAsNumber: true })}
              />
              {errors.height && (
                <p className="text-sm text-destructive">
                  {errors.height.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight (kg) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                /* value populated via react-hook-form reset */
                placeholder="Enter weight"
                {...register("weight", { valueAsNumber: true })}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <TextInput
                id="bmi"
                label="BMI"
                {...register("bmi")}
                error={errors.bmi?.message}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>

          <div className="space-y-2">
            <Label htmlFor="profile_image">Profile Image URL</Label>
            <Input
              id="profile_image"
              type="url"
              placeholder="Enter profile image URL"
              {...register("profile_image")}
            />
            {errors.profile_image && (
              <p className="text-sm text-destructive">
                {errors.profile_image.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_joined">Date Joined</Label>
            <Input id="date_joined" type="date" {...register("date_joined")} />
            {errors.date_joined && (
              <p className="text-sm text-destructive">
                {errors.date_joined.message}
              </p>
            )}
          </div>
        </div> */}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button loading={isPending} loadingText="Updating" type="submit">
          Update Athlete
        </Button>
      </div>
    </form>
  );
}
