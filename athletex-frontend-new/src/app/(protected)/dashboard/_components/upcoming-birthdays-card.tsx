"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

const birthdays = [
  { name: "Gopal Pokhrel", date: "September 12" },
  { name: "Aarav Sharma", date: "September 15" },
  { name: "Sita Thapa", date: "September 18" },
  { name: "Nabin Shrestha", date: "September 20" },
  { name: "Rita Karki", date: "September 21" },
  { name: "Prakash Gurung", date: "September 23" },
  { name: "Mina Rai", date: "September 25" },
  { name: "Keshav Adhikari", date: "September 26" },
  { name: "Sunita Lama", date: "September 28" },
  { name: "Rajesh KC", date: "September 30" },
];

export function UpcomingBirthdaysCard() {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Upcoming Birthdays
      </h3>

      <ScrollArea className="h-[199px] pr-2">
        <div className="space-y-3">
          {birthdays.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-gray-100 text-sm font-medium">
                {b.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-gray-500">{b.date}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
