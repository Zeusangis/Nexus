import { HomeHashtag, User } from "iconsax-reactjs";
import { BarChart, MessageCircle } from "lucide-react";

export const SingleMenuItems = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: HomeHashtag,
  },
  {
    name: "Athletes",
    url: "/dashboard/athletes",
    icon: User,
  },
  {
    name: "Daily",
    url: "/dashboard/daily",
    icon: BarChart,
  },
  // i want to go to /dashboard/analyze/userid provided by user for analyze page
  {
    name: "Analyze",
    url: "/dashboard/analyze" + "/:id",
    icon: BarChart,
  },
  {
    name: "Chats",
    url: "/dashboard/chats",
    icon: MessageCircle,
  },
];
