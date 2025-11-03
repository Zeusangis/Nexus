"use client";

import React from "react";
import CardContainer from "@/components/atoms/card-container";
import PaginationComponent from "@/components/molecules/pagination-component";
import SearchBar from "@/components/molecules/search-bar";
import CommonTable from "@/components/templates/common-table";
import { athleteColumn } from "./athlete-column";
import { useFetchAthletes } from "@/utils/fetchAthletes";

const AthleteTable = () => {
  const athletes = useFetchAthletes();

  return (
    <CardContainer className="mb-6">
      <div className="flex items-start justify-between mb-4">
        <SearchBar />
      </div>

      <CommonTable
        columns={athleteColumn}
        data={athletes.data?.data.athletes ?? []}
        isLoading={athletes.isLoading}
      />
      <div className="flex justify-end mt-3">
        <PaginationComponent />
      </div>
    </CardContainer>
  );
};

export default AthleteTable;
