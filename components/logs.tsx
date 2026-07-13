"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllLogs } from "@/actions/data";
import { Trash } from "lucide-react";
import { deleteLog } from "@/actions/entries";
import { toast } from "sonner";

export default function Logs() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getAllLogs(),
  });
  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => deleteLog(id),
  });
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});

  async function deleteLogFn(id: number) {
    try {
      await mutateAsync(id);
      toast.success("Log deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete log");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data?.map((item) => (
            <div
              key={item.id}
              className="aspect-video flex flex-col h-auto  items-center justify-start py-6 rounded-xl bg-muted/50"
            >
              <div className="flex flex-col gap-4 px-4 w-full h-auto rounded-lg">
                <div className="flex w-full items-start justify-start flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <Badge className="text-xs" variant={"secondary"}>
                      {item.classification.name}
                    </Badge>

                    <div className="items-end">
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full justify-between items-center">
                    <h3 className="text-[2.7rem] font-regular">{item.title}</h3>
                    <div className="w-full flex items-center justify-end w-4">
                      <button
                        type="button"
                        onClick={() => deleteLogFn(item.id)}
                        className="p-1 cursor-pointer"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex relative items-start flex-col justify-center gap-2 w-full">
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                  <div
                    className={`flex items-start justify-start overflow-hidden gap-2 w-full [&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm [&_pre]:w-full ${item.codes.length > 400 && !showMore[item.id] ? "max-h-[400px]" : ""}`}
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{ __html: item.codes }}
                  />

                  {item.codes.length > 500 && !showMore[item.id] && (
                    <button
                      type="button"
                      className="text-primary absolute bottom-1 right-1.5 text-sm font-medium cursor-pointer"
                      onClick={() =>
                        setShowMore((prev) => ({ ...prev, [item.id]: true }))
                      }
                    >
                      Show more
                    </button>
                  )}

                  {item.codes.length > 500 && showMore[item.id] && (
                    <button
                      type="button"
                      className="text-white absolute bottom-1 right-1.5 text-sm font-medium cursor-pointer"
                      onClick={() =>
                        setShowMore((prev) => ({ ...prev, [item.id]: false }))
                      }
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
