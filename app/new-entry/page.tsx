import React from "react";
import { Metadata } from "next";
import Form from "next/form";
import { newEntryLogs } from "@/lib/actions";

const metadata: Metadata = {
  title: "New Entry - Dev Log",
  description: "Create a new entry in your Dev Log",
};

export default async function page() {
  return (
    <div className="px-8 w-full space-y-3">
      <div className="flex items-start justify-between w-full flex-col">
        <h1 className="text-2xl font-semibold font-display">New Entry</h1>
        <p className="text-muted-foreground font-display font-medium">
          <span className="uppercase">
            TIMESTAMP{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </div>

      <Form action={newEntryLogs}>
        <div className="bg-card border border-zinc-800 p-6">
          <label
            htmlFor="title"
            className="block font-mono text-sm font-medium text-zinc-500 uppercase mb-3"
          >
            Log Title
          </label>
          <input
            id="title"
            name="title"
            autoComplete="off"
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-0 text-foreground py-3 px-4 placeholder:text-muted transition-all outline-none"
            placeholder="Specify clear, descriptive intent..."
            type="text"
          />
        </div>
      </Form>
    </div>
  );
}
