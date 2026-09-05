"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCollections } from "@/actions/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Folder, Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { editCollection } from "@/actions/entries";
import { toast } from "sonner";
import { useState } from "react";

export default function CollectionsPage() {
  const { data, isError } = useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollections(),
  });
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync: editFn } = useMutation({
    mutationFn: async (data: { collectionId: string; name: string }) =>
      await editCollection(data),
    onSuccess: (res) => {
      if (!res?.error) {
        toast.success(res?.message);
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        setShowEditDialog(false);
      } else {
        toast.error(res.message);
      }
    },
    onError: () => {
      toast.error("Failed to edit collection");
    },
  });

  const pathname = usePathname();

  console.log(pathname);

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    collectionId: string,
  ) {
    e.preventDefault();

    //get the form
    const formData = new FormData(e.currentTarget);
    const collectionName = formData.get("collectionName") as string;

    if (!collectionName || collectionName.trim() === "") {
      return;
    }

    try {
      await editFn({ collectionId: collectionId, name: collectionName });
    } catch (error) {
      toast.error("Failed to edit collection");
    }
  }
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {data?.length ? (
          <div className="gap-4 flex flex-wrap">
            {data.map((item) => (
              <Link
                key={item.id}
                href={`${pathname}/${item.id}`}
                className="flex flex-row justify-between h-auto items-start w-2xs py-6 px-4 rounded-xl bg-muted/50"
              >
                <div className="flex flex-row items-center justify-between gap-2">
                  <Folder />
                  <p>{item.name}</p>

                  <div className="rounded-full bg-primary text-white size-4 flex items-center justify-center">
                    <p className="text-xs font-semibold">{item._count.logs}</p>
                  </div>
                </div>

                {/* biome-ignore lint/a11y/noStaticElementInteractions: propagation firewall only */}
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: propagation firewall only */}
                <div
                  className="flex flex-row items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <Dialog
                          defaultOpen={false}
                          open={showEditDialog}
                          onOpenChange={setShowEditDialog}
                        >
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="w-full cursor-pointer"
                            >
                              <Pencil />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Collection</DialogTitle>
                              <DialogDescription>
                                Edit your collection here. Click save when
                                you&apos;re done.
                              </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={(e) => handleSubmit(e, item.id)}>
                              <FieldGroup>
                                <Field>
                                  <Label htmlFor="collection-name">Name</Label>
                                  <Input
                                    id="collection-name"
                                    name="collectionName"
                                    defaultValue={item.name}
                                  />
                                </Field>
                              </FieldGroup>
                              <DialogFooter className="mt-4">
                                <DialogClose
                                  render={
                                    <Button variant="outline">Cancel</Button>
                                  }
                                />
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild className="w-100">
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-2">
            <p className="text-gray-500">No collections added yet</p>
            <Link href={``}>
              <Button size={"lg"} className="cursor-pointer" type="button">
                <Plus /> Add New
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
