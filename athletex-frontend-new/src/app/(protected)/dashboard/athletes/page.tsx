"use client";

import React, { Suspense } from "react";
import { Add } from "iconsax-reactjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import PageLoader from "@/components/molecules/page-loader";

import Heading from "@/components/atoms/heading";
import AthleteTable from "./_components/athlete-table";
import useGetRole from "@/utils/getRole";
import { unauthorized } from "next/navigation";

const AthletePage = () => {
  const role = useGetRole().normalizedRole;

  if (role === "ATHELETE") {
    return unauthorized();
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex items-center justify-between">
        <Heading className="mb-2" text="Athlete Management" />
        <Link href={"/dashboard/athletes/add"}>
          <Button
            iconLeft={<Add className="size-6" />}
            className="rounded-full"
          >
            Add Athlete
          </Button>
        </Link>
      </div>
      <AthleteTable />
    </Suspense>
  );
};

export default AthletePage;
