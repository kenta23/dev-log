"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { devicons } from "@/lib/devicons";
import { Button } from "./ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "./ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLog } from "@/actions/entries";
import { toast } from "sonner";
import { useParams, usePathname } from "next/navigation";

type logsData =
  | {
      codes: string;
      classification: {
        id: number;
        name: string;
      };
      language: {
        id: number;
        name: string;
      };
      collection?: {
        id: number;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
      } | null;
      id: number;
      collectionId: number | null;
      title: string;
      notes: string;
      classificationId: number;
      languageId: number;
      userId: string;
      isDraft: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[]
  | undefined
  | { error: string };

export default function LogsItem({ data }: { data: logsData }) {
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => deleteLog(id),
  });
  const pathname = usePathname();
  const { collectionId } = useParams<{ collectionId: string }>();

  async function deleteLogFn(id: number) {
    try {
      toast.promise(mutateAsync(id), {
        loading: "Deleting log...",
        success: "Log deleted successfully",
        error: "Failed to delete log",
      });
      queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete log");
    }
  }

  return (
    <>
      {Array.isArray(data) && data.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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

                  <div className="flex gap-2 mt-2 items-center w-full">
                    <i className={devicons[item.language.name]}></i>
                    <p className="font-medium text-sm capitalize">
                      {item.language.name}
                    </p>
                  </div>

                  <div className="flex w-full justify-between items-center">
                    <h3 className="text-[2.7rem] font-regular">{item.title}</h3>

                    <div className="flex items-center justify-end w-auto">
                      <Link
                        href={`${
                          pathname === "/collections"
                            ? pathname.replace("collections", "edit-entry")
                            : "/edit-entry"
                        }/${item.id}`}
                      >
                        <Pencil
                          size={18}
                          className="text-primary cursor-pointer"
                        />
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger
                          type="button"
                          className="p-1 cursor-pointer text-red-500"
                        >
                          <Trash size={18} />
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your "{item.title}" entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteLogFn(item.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
          <p className="text-gray-500">No collections added yet</p>
          <Link
            href={`${pathname.includes("/collections") ? `/collections/new-entry/${collectionId}` : "/new-entry"}`}
          >
            <Button size={"lg"} className="cursor-pointer" type="button">
              <Plus /> Add New
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
