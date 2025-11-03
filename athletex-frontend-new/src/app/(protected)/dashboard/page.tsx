import CardContainer from "@/components/atoms/card-container";
import { DashboardCard } from "./_components/dashboard-card";
import {
  Firstline,
  Layer,
  MoneyAdd,
  MoneyRecive,
  Profile2User,
} from "iconsax-reactjs";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Combined Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1 Left */}
        <CardContainer className="w-full bg-white p-4 rounded-lg shadow-sm h-fit">
          <DashboardCard
            icon={MoneyRecive}
            title="Total Transactions"
            value="$0.00"
            iconBgClass="bg-indigo-100"
            iconTextClass="text-indigo-600"
            change={{ percentage: "-100%", type: "decrease" }}
          />
        </CardContainer>
        <CardContainer className="w-full bg-white p-4 rounded-lg shadow-sm h-fit">
          <DashboardCard
            icon={Profile2User}
            title="Total Families"
            value="0"
            iconBgClass="bg-purple-100"
            iconTextClass="text-purple-600"
            change={{ percentage: "-100%", type: "decrease" }}
          />
        </CardContainer>
        <CardContainer className="w-full bg-white p-4 rounded-lg shadow-sm h-fit">
          <DashboardCard
            icon={Firstline}
            title="Total Enrollment"
            value="0"
            iconBgClass="bg-orange-100"
            iconTextClass="text-orange-600"
            change={{ percentage: "-100%", type: "decrease" }}
          />
        </CardContainer>

        {/* Row 2 Left */}
        <CardContainer className="w-full rounded-lg shadow-sm bg-purple-100 border-0">
          <DashboardCard
            icon={MoneyAdd}
            title="Unpaid Invoices"
            value="0"
            iconBgClass="bg-purple-200"
            iconTextClass="text-purple-700"
            valueColorClass="text-purple-800"
          />
        </CardContainer>
        <CardContainer className="w-full rounded-lg shadow-sm bg-orange-100 border-0">
          <DashboardCard
            icon={Layer}
            title="Total Classes"
            value="0"
            iconBgClass="bg-orange-200"
            iconTextClass="text-orange-700"
            valueColorClass="text-orange-800"
          />
        </CardContainer>
        <CardContainer className="w-full rounded-lg shadow-sm bg-green-100 border-0">
          <DashboardCard
            className="!h-fit"
            icon={Profile2User}
            title="Total Staffs"
            value="0"
            iconBgClass="bg-green-200"
            iconTextClass="text-green-700"
            valueColorClass="text-green-800"
          />
        </CardContainer>
      </div>

      {/* <RevenueCollectionChart /> */}
    </div>
  );
}
