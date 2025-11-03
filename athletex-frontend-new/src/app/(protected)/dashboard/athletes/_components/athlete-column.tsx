"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import AthleteRowAction from "./athlete-row-action";
import { Athlete } from "@/utils/fetchAthletes";

export const athleteColumn: ColumnDef<Athlete>[] = [
  {
    accessorKey: "athlete",
    header: "Athlete",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.user.fullName}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.user.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs capitalize">
        {row.original.gender}
      </Badge>
    ),
  },

  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => <div className="text-sm">{row.original.age}</div>,
  },
  {
    accessorKey: "bmi",
    header: "BMI",
    cell: ({ row }) => <div className="text-sm">{row.original.bmi}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const athlete = row.original;
      return <AthleteRowAction athlete={athlete} />;
    },
  },
];
