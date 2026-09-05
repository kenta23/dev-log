"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollection } from "@/actions/entries";
import { getCollections } from "@/actions/data";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function CollectionSwitcher() {
  const { isMobile } = useSidebar();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const {
    data: collections,
    isLoading: isLoadingCollections,
    isError: isErrorCollections,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => await getCollections(),
  });
  const params = useParams<{ collectionId: string }>();
  const {
    mutateAsync: mutateCreateCollection,
    isPending: isPendingCollection,
  } = useMutation({
    mutationKey: ["new-collection"],
    mutationFn: async (name: string) => await createCollection(name),
    onSuccess: (data) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        setDialogOpen(false);
        toast.success("Collection created successfully");
      } else if (data.error) {
        toast.error(data.error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const queryClient = useQueryClient();
  const { data: session, isPending: isLoadingSession } = useSession();

  function handleNewCollection(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("collection-name") as string;

    if (name.length < 3) {
      toast.error("Collection name must be at least 3 characters long");
      return;
    }

    mutateCreateCollection(name);
  }
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {isLoadingSession ? (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Loading...</span>
                  </div>
                ) : (
                  <div
                    key={session?.user?.id}
                    className="grid flex-1 text-left text-sm leading-tight"
                  >
                    <span className="truncate font-medium">
                      {session?.user?.name}
                    </span>
                  </div>
                )}

                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Collections
              </DropdownMenuLabel>
              {isLoadingCollections && (
                <DropdownMenuLabel>Loading...</DropdownMenuLabel>
              )}
              {isErrorCollections && (
                <DropdownMenuLabel>Error loading collections</DropdownMenuLabel>
              )}
              {collections
                ?.sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
                .map((collection) => (
                  <DropdownMenuItem
                    key={collection.id}
                    onClick={() => {}}
                    className="gap-2 p-2 cursor-pointer"
                  >
                    <Link
                      href={`/collections/${collection.id}`}
                      itemID="1"
                      className={`flex items-center justify-between w-full ${collection.id === Number(params.collectionId) ? "text-primary" : ""}`}
                    >
                      <p className="w-100">{collection.name}</p>

                      <DropdownMenuShortcut>
                        ⌘{collection._count.logs || 0}
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={(e) => {
                  e.preventDefault();
                  setDialogOpen(true);
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <span className="font-medium text-muted-foreground">
                  Add Collection
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleNewCollection}>
            <DialogHeader>
              <DialogTitle>Add Collection</DialogTitle>
              <DialogDescription>
                Add a new collection to your workspace.
              </DialogDescription>
            </DialogHeader>

            <Field className="py-4">
              <Label htmlFor="collection-name">Name</Label>
              <Input id="collection-name" name="collection-name" />
            </Field>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit">Add Collection</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
