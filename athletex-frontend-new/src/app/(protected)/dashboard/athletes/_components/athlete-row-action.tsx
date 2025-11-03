"use client";

import React from "react";

import ActionDropdownMenu from "@/components/organisms/action-dropdown-menu";
import ConfirmationDialog from "@/components/organisms/confirmation-dialog";
import { useRemoveAthlete } from "@/utils/removeAthlete";
import { useRouter } from "next/navigation";
import { Athlete } from "@/utils/fetchAthletes";

const AthleteRowActions = ({ athlete }: { athlete: Athlete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { mutate: deleteAthlete } = useRemoveAthlete();
  const router = useRouter();

  const handleDeleteAthlete = (id: string) => {
    deleteAthlete(id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ActionDropdownMenu
        onView={() =>
          router.push(`/dashboard/athletes/profile/${athlete.userId}`)
        }
        onAnalyze={() =>
          router.push(`/dashboard/athletes/analyze/${athlete.userId}`)
        }
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title="Delete Athlete"
        onConfirm={() => {
          handleDeleteAthlete(athlete.userId);
        }}
      />
    </>
  );
};

export default AthleteRowActions;
