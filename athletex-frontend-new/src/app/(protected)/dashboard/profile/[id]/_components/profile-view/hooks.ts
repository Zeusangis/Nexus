import { useState, useEffect, useRef } from "react";
import type { UserData } from "./types";

export const useProfileEdit = (initialUser: UserData | null) => {
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [isEditingAthleteProfile, setIsEditingAthleteProfile] = useState(false);
  const userIdRef = useRef<string | null>(null);

  // Only update when user ID actually changes
  useEffect(() => {
    if (initialUser && initialUser.id !== userIdRef.current) {
      userIdRef.current = initialUser.id;
      setEditedUser(null);
      setIsEditingAthleteProfile(false);
    }
  }, [initialUser]);

  const handleStartEdit = () => {
    if (!initialUser) return;
    setEditedUser(initialUser);
    setIsEditingAthleteProfile(true);
  };

  const handleCancelEdit = () => {
    setEditedUser(null);
    setIsEditingAthleteProfile(false);
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedUser((prev) => {
      if (!prev || !prev.athleteProfile) return prev;
      return {
        ...prev,
        athleteProfile: { ...prev.athleteProfile, [field]: value },
      };
    });
  };

  const reset = () => {
    setEditedUser(null);
    setIsEditingAthleteProfile(false);
  };

  return {
    editedUser,
    isEditingAthleteProfile,
    handleStartEdit,
    handleCancelEdit,
    handleFieldChange,
    reset,
  };
};
