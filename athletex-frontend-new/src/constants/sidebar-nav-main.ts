import { MoneySend, Profile2User, Setting2 } from "iconsax-reactjs";

export const sidebarNavMain = [
  {
    title: "Families",
    url: "/dashboard/families",
    icon: Profile2User,
    items: [
      { title: "All Families", url: "/dashboard/families" },
      {
        title: "Quick Registration",
        url: "/dashboard/families/add",
      },
      { title: "Family Reports", url: "/dashboard/families/reports" },
    ],
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: MoneySend,
    items: [
      { title: "Accounts", url: "/dashboard/transactions/accounts" },
      { title: "Transactions", url: "/dashboard/transactions/transactions" },
      { title: "Petty Cash", url: "/dashboard/transactions/petty-cash" },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Setting2,
    items: [
      {
        title: "Organization Settings",
        url: "/dashboard/settings/organization",
      },
      { title: "Categories", url: "/dashboard/settings/categories" },
      {
        title: "Tuition & Discount",
        url: "/dashboard/settings/tuition-discount",
      },
      { title: "Domain Settings", url: "/dashboard/settings/domain" },
      {
        title: "Registration Fee",
        url: "/dashboard/settings/registration-fee",
      },
      {
        title: "E-Payment Settings",
        url: "/dashboard/settings/e-payment",
      },
      { title: "Policies", url: "/dashboard/settings/policies" },
      { title: "Branches", url: "/dashboard/settings/branches" },
    ],
  },
];
