import Logs from "@/components/logs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Log",
  description: "Dev Log Dashboard",
};

export default function Home() {
  return <Logs />;
}
