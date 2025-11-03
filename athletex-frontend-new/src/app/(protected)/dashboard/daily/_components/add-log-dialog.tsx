"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  DailyLogAddSchema,
  type DailyLogAddSchemaType,
} from "@/schema/daily-log/daily-log-add";
import { useGetUser } from "@/utils/getUser";
import TextInput from "@/components/molecules/text-input";
import { useDailyLog } from "@/utils/addDailyLog";

export function AddLogDialog() {
  const currentUser = useGetUser();
  const { mutate, isPending } = useDailyLog();
  const [open, setOpen] = useState(false);

  // Get athleteId and convert to string
  const athleteId = String(
    currentUser?.data?.data?.user?.athleteProfile?.id || ""
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DailyLogAddSchemaType>({
    resolver: zodResolver(DailyLogAddSchema),
    defaultValues: {
      athleteId: athleteId,
      date: "",
      kneePain: 0,
      legFreshness: 10,
      sleepHours: 8,
      trainingIntensity: 5,
      aclInjuryScore: 0,
      stiffnessLevel: 0,
      calorieIntake: 2500,
    },
  });

  const resetForm = () => {
    reset({
      athleteId: athleteId,
      kneePain: 0,
      date: "",
      legFreshness: 10,
      sleepHours: 8,
      trainingIntensity: 5,
      aclInjuryScore: 0,
      stiffnessLevel: 0,
      calorieIntake: 2500,
    });
    setOpen(false);
  };

  const onSubmit = (data: DailyLogAddSchemaType) => {
    console.log("Submitted log:", data);
    mutate(data, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="primary" className="rounded-full">
          <Plus className="h-4 w-4" />
          Add Daily Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Daily Log</DialogTitle>
          <DialogDescription>
            Enter athlete health and performance metrics
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <TextInput
              id="date"
              type="date"
              {...register("date")}
              error={errors.date?.message}
              className="transition-all focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="knee_pain">Knee Pain (0-10)</Label>
              <TextInput
                id="knee_pain"
                type="number"
                step="1"
                {...register("kneePain", { valueAsNumber: true })}
                error={errors.kneePain?.message}
                className="transition-all focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leg_freshness">Leg Freshness (0-10)</Label>
              <TextInput
                id="leg_freshness"
                type="number"
                step="1"
                {...register("legFreshness", { valueAsNumber: true })}
                error={errors.legFreshness?.message}
                className="transition-all focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleep_hours">Sleep Hours</Label>
              <TextInput
                id="sleep_hours"
                type="number"
                step="0.5"
                {...register("sleepHours", { valueAsNumber: true })}
                error={errors.sleepHours?.message}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingIntensity">
                Training Intensity (0-10)
              </Label>
              <TextInput
                id="trainingIntensity"
                type="number"
                step="1"
                {...register("trainingIntensity", { valueAsNumber: true })}
                error={errors.trainingIntensity?.message}
                className="transition-all focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acl_injury_score">ACL Injury Score (0-1)</Label>
              <TextInput
                id="acl_injury_score"
                type="number"
                step="0.01"
                {...register("aclInjuryScore", { valueAsNumber: true })}
                error={errors.aclInjuryScore?.message}
                className="transition-all focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stiffnessLevel">Stiffness Level (0-10)</Label>
              <TextInput
                id="stiffnessLevel"
                type="number"
                step="1"
                {...register("stiffnessLevel", { valueAsNumber: true })}
                error={errors.stiffnessLevel?.message}
                className="transition-all focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calorie_intake">Calorie Intake</Label>
            <TextInput
              id="calorie_intake"
              type="number"
              step="100"
              {...register("calorieIntake", { valueAsNumber: true })}
              error={errors.calorieIntake?.message}
              className="transition-all focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isPending}
              loadingText="Adding"
            >
              Add Log
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
