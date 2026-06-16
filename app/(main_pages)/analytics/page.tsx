import { TrendingUp, CheckCircle } from "lucide-react";
import Contributions from "./contributions";

export default function AnalyticsPage() {
  return (
    <div className="px-4 py-6 w-full h-full mx-auto">
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-wider">
          Session_Log_Query: All_Periods_Active
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* TOTAL WINS */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Total_Wins
            </span>
            <h2 className="text-6xl font-black text-primary tracking-tighter">
              142
            </h2>
          </div>
          <div className="mt-4 flex items-center text-primary text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last cycle
          </div>
        </div>

        {/* BUGS FIXED */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Bugs_Fixed
            </span>
            <h2 className="text-6xl font-black text-foreground tracking-tighter">
              89
            </h2>
          </div>
          <div className="mt-4 flex items-center text-muted-foreground text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Velocity: 2.4/day
          </div>
        </div>

        {/* UPTIME INDEX */}
        <div className="bg-muted/50 border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block mb-4">
              Uptime_Index
            </span>
            <h2 className="text-6xl font-black text-primary tracking-tighter">
              99.8%
            </h2>
          </div>
          <div className="mt-4 flex items-center text-primary text-sm">
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
            Operational
          </div>
        </div>
      </div>

      {/* ACTIVITY MAP */}
      <Contributions />

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MOST USED TAGS */}
        <div className="lg:col-span-2 bg-muted/50 border rounded-xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
            Most_Used_Tags
          </h3>
          <div className="space-y-4">
            {[
              { tag: "rust_lang", pct: 85 },
              { tag: "postgres", pct: 62 },
              { tag: "api_core", pct: 45 },
              { tag: "security", pct: 38 },
              { tag: "ui_v2", pct: 20 },
            ].map((item) => (
              <div key={item.tag} className="flex items-center">
                <div className="w-24 font-mono text-sm text-foreground/80">
                  {item.tag}
                </div>
                <div className="flex-1 h-2 bg-muted mx-4 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <div className="w-12 text-right font-mono text-muted-foreground text-xs">
                  {item.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT MILESTONES */}
        <div className="bg-muted/50 border rounded-xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
            Recent_Milestones
          </h3>
          <div className="space-y-6">
            <div className="border-l-2 border-primary pl-4 py-1">
              <div className="text-primary font-bold text-sm">
                System Optimization
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Memory usage reduced by 40MB
              </div>
              <div className="text-muted-foreground/60 text-[10px] mt-1 uppercase font-mono">
                02_JAN_2024
              </div>
            </div>
            <div className="border-l-2 border-border pl-4 py-1">
              <div className="text-foreground/80 font-bold text-sm">
                Auth Module Rewrite
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Migrated to Argon2id hashing
              </div>
              <div className="text-muted-foreground/60 text-[10px] mt-1 uppercase font-mono">
                28_DEC_2023
              </div>
            </div>
            <div className="border-l-2 border-border pl-4 py-1">
              <div className="text-foreground/80 font-bold text-sm">
                Bug Cleanse
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Closed 15 legacy tickets
              </div>
              <div className="text-muted-foreground/60 text-[10px] mt-1 uppercase font-mono">
                20_DEC_2023
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
