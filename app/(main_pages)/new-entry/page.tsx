import type { Metadata } from "next";
import NewEntryForm from "./new_entry_form";

export const metadata: Metadata = {
  title: "New Entry - Dev Log",
  description: "Create a new entry in your Dev Log",
};

export default async function page() {
  return <NewEntryForm />;
}
