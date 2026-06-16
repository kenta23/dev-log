"use client";

import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { useQuery } from "@tanstack/react-query";

// const customTheme = createTheme({
//   level0: "#27272a", // bg-muted
//   level1: "#064e3b", // bg-primary/20
//   level2: "#047857", // bg-primary/60
//   level3: "#10b981", // bg-primary
//   level4: "#34d399", // bg-primary brighter
// });

const explicitTheme: ThemeInput = {
  light: ["#27272a", "#064e3b", "#047857", "#10b981", "#34d399"],
  dark: ["#27272a", "#064e3b", "#047857", "#10b981", "#34d399"],
};

export default function Contributions() {
  const data = [
    {
      date: "2024-06-23",
      count: 2,
      level: 1,
    },
    {
      date: "2024-08-02",
      count: 16,
      level: 4,
    },
    {
      date: "2024-11-29",
      count: 11,
      level: 3,
    },
    {
      date: "2025-11-29",
      count: 2,
      level: 1,
    },
    {
      date: "2025-11-29",
      count: 4,
      level: 2,
    },
    {
      date: "2025-03-29",
      count: 6,
      level: 3,
    },
    {
      date: "2025-04-29",
      count: 8,
      level: 4,
    },
  ];

  return (
    <div className="bg-muted/50 border rounded-xl p-8 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Contribution_Activity_Map
        </h3>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="w-full">
          <ActivityCalendar
            theme={explicitTheme}
            className="w-full"
            showColorLegend
            showWeekdayLabels={false}
            data={data}
            fontSize={14}
            maxLevel={4}
          />
        </div>
      </div>
    </div>
  );
}
