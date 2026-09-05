import type { Metadata } from "next";
import NewEntryForm from "@/app/(main_pages)/new-entry/new_entry_form";

export const metadata: Metadata = {
  title: "New Entry - Dev Log",
  description: "Create a new entry in your Dev Log",
};

export default async function page({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  return <NewEntryForm collectionId={collectionId} />;
}
