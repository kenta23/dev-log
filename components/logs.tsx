"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllLogs } from "@/actions/data";
import { Pencil, Plus, Trash } from "lucide-react";
import { deleteLog } from "@/actions/entries";
import { toast } from "sonner";
import LogsItem from "./logsitem";

export default function Logs() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getAllLogs(),
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <LogsItem logs={data} />
      </div>
    </div>
  );
}
