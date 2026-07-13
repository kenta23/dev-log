"use client";

import { TrendingUp, CheckCircle, Bug, Plus, Medal } from "lucide-react";
import Contributions from "./contributions";
import { getAnalytics } from "@/actions/data";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Analytics() {
  const { data, isSuccess, isPending, isError } = useQuery({
    queryFn: async () => await getAnalytics(),
    gcTime: 1000 * 60 * 5,
    queryKey: ["analytics-data"],
    staleTime: 1000 * 60 * 5, //5 minutes
  });

  return (
    <>
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-wider">
          Session_Log_Query: All_Periods_Active
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* TOTAL LOGS */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Total_Logs
            </span>
            <h2 className="text-6xl font-black text-primary tracking-tighter">
              {data?.totalLogs}
            </h2>
          </div>
          <div className="mt-4 flex items-center text-primary text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />+
            {
              data?.logs.filter(
                (i) => new Date(i.createdAt).getDay() === new Date().getDay(),
              ).length
            }{" "}
            this day
          </div>
        </div>

        {/* BUGS FIXED */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Bugs
            </span>
            <h2 className="text-6xl font-black text-foreground tracking-tighter">
              {data?.countClassification?.find((item) => item.id === 1)
                ?.count || 0}
            </h2>
          </div>
          <div className="mt-4 flex items-center text-muted-foreground text-sm">
            <Bug className="w-4 h-4 mr-1" />
            {
              data?.logs?.filter(
                (i) =>
                  new Date(i.createdAt).getDay() === new Date().getDay() &&
                  i.classificationId === 1,
              ).length
            }{" "}
            this day
          </div>
        </div>

        {/* Feature */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Feature
            </span>
            <h2 className="text-6xl font-black text-primary tracking-tighter">
              {data?.countClassification?.find((item) => item.id === 2)
                ?.count || 0}
            </h2>
          </div>
          <div className="mt-4 flex items-center text-primary text-sm">
            <Plus className="w-4 h-4 mr-1" />
            {
              data?.logs?.filter(
                (i) =>
                  new Date(i.createdAt).getDay() === new Date().getDay() &&
                  i.classificationId === 2,
              ).length
            }{" "}
            this day
          </div>
        </div>

        {/* Win */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Win
            </span>
            <h2 className="text-6xl font-black text-primary tracking-tighter">
              {data?.countClassification?.find((item) => item.id === 3)
                ?.count || 0}
            </h2>
          </div>
          <div className="mt-4 flex items-center text-primary text-sm">
            <Medal className="w-4 h-4 mr-1 text-primary" />
            {
              data?.logs?.filter(
                (i) =>
                  new Date(i.createdAt).getDay() === new Date().getDay() &&
                  i.classificationId === 3,
              ).length
            }{" "}
            this day
          </div>
        </div>
      </div>

      {/* ACTIVITY MAP */}
      {/* <Contributions /> */}

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MOST USED PROGRAMMING LANGUAGES */}
        <div className="lg:col-span-2 bg-muted/50 border rounded-xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
            Most Used Programming Languages
          </h3>
          <div className="space-y-4">
            {data?.countLanguages.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-24 font-mono text-sm text-foreground/80">
                  {item.language}
                </div>
                <div className="flex-1 h-2 bg-muted mx-4 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(item.count / data.totalLogs) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right font-mono text-muted-foreground text-xs">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT MILESTONES */}
        <div className="bg-muted/50 border rounded-xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
            Recent_Logs
          </h3>
          {data?.logs?.slice(0, 6).map((item, index) => (
            <div key={item.id} className="space-y-6">
              <div
                className={`border-l-2 ${index === 0 ? "border-primary" : "border-border"} pl-4 py-1`}
              >
                <div className="text-primary font-bold text-sm">
                  {item.title}
                </div>
                <div className="text-muted-foreground text-xs mt-1">
                  {item.notes}
                </div>
                <div className="text-muted-foreground/60 text-[10px] mt-1 uppercase font-mono">
                  {new Date(item.createdAt)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "_")
                    .toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
