"use client";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  athleteAddSchema,
  type AthleteAddSchemaType,
} from "@/schema/athletes/athlete-add";
import { useEffect, useState } from "react";
import { useAddAthlete, useAddCoachAthleteRelation } from "@/utils/addAthlete";
import { useRouter } from "next/navigation";
import SplitFormContainer from "@/components/molecules/split-form-container";
import SelectField from "@/components/organisms/select-field";
import { calculateBmi } from "@/utils/bmi";

export default function AddAthleteForm() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AthleteAddSchemaType>({
    resolver: zodResolver(athleteAddSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "12345678",
      age: 0,
      gender: "",
      height: 0,
      weight: 0,
      bmi: 0,
      // profile_image: "",
      // date_joined: "",
    },
  });
  const { mutate: addAthlete, isPending } = useAddAthlete();
  const { mutate: coachAddAthlete } = useAddCoachAthleteRelation();
  const router = useRouter();

  const onSubmit = async (data: AthleteAddSchemaType) => {
    addAthlete(data, {
      onSuccess: (response) => {
        // After adding athlete, create coach-athlete relation with the newly created athlete's ID
        console.log("Response.data", response?.data);
        const athleteId = response?.data?.id;
        console.log(athleteId);
        if (athleteId) {
          coachAddAthlete(athleteId, {
            onSuccess: () => {
              router.push("/dashboard/athletes");
            },
            onError: (error) => {
              console.error("Error creating coach-athlete relation:", error);
              // Still navigate even if relation fails - athlete was created successfully
              router.push("/dashboard/athletes");
            },
          });
        } else {
          // If no athlete ID returned, just navigate
          router.push("/dashboard/athletes");
        }
      },
    });
  };

  const onError = (errors: FieldErrors<AthleteAddSchemaType>) => {
    // Log zod/react-hook-form validation errors to help debugging when submit doesn't fire
    console.log("Validation errors:", errors);
  };

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

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
      <div className="space-y-6">
        {/* Personal Information Section */}
        <SplitFormContainer title="Personal Information">
          <div className="space-y-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                placeholder="Enter full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
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
                  {...register("age", { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <SelectField
                  label="Gender"
                  control={control}
                  {...register("gender")}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                  placeholder="Select gender"
                />
              </div>
            </div>
          </div>
        </SplitFormContainer>
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
              <Label htmlFor="bmi">
                BMI <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                disabled
                value={bmi || ""}
              />
              {errors.bmi && (
                <p className="text-sm text-destructive">{errors.bmi.message}</p>
              )}
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
        <Button loading={isPending} loadingText="Adding Athlete" type="submit">
          Add Athlete
        </Button>
      </div>
    </form>
  );
}
