import { TrendingUp, CheckCircle } from "lucide-react";
import Contributions from "./contributions";
import { getAnalytics } from "@/actions/data";
import { Metadata } from "next";
import Analytics from "./analytics_client";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics & Insights",
};

export default async function AnalyticsPage() {
  return (
    <div className="px-4 py-6 w-full h-full mx-auto">
      <Analytics />
    </div>
  );
}
