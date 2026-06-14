"use client";

import { useState, useActionState, useEffect } from "react";
import Form from "next/form";
import { createEntry, createNewEntry } from "@/actions/entries";
import { containerStyles, toggleStyles } from "@/lib/utils";
import { Bug, Medal, SquareDashedBottomCode, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import CodeEditor from "@/components/code-editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bundledLanguages } from "shiki/bundle/web";
import type { BundledLanguage } from "shiki/bundle/web";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "@/actions/data";

interface Draft {
  title: string | null;
  notes: string | null;
  logs: string | null;
}
[];

export default function NewEntryForm() {
  const [classificationSelected, setClassificationSelected] =
    useState<string>("");
  const [languageSelected, setLanguageSelected] =
    useState<BundledLanguage>("typescript");
  const [codeBlockText, setCodeBlockText] = useState<string>("");
  const [state, formAction, isPending] = useActionState(createEntry, null);
  const [saveDraft, setSaveDraft] = useState<Draft>({
    title: null,
    logs: null,
    notes: null,
  });

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state?.message) {
      setSaveDraft({
        title: "",
        notes: "",
        logs: "",
      });

      setCodeBlockText("");
    }
  }, [state]);

  const {
    data: progLangs,
    isPending: isGettingProgLangs,
    isError: isGettingProgLangsError,
  } = useQuery({
    queryKey: ["proglanguages"],
    queryFn: async () => {
      const data = await getLanguages();
      return data;
    },
  });

  function handleDraftSaving() {
    const newDraft: Draft = {
      title: "",
      notes: "",
      logs: "",
    };

    //TODO: DRAFT DATA TO SERVER FN
  }
  return (
    <div className="px-8 w-full space-y-3 mb-6">
      <div className="flex w-full justify-between">
        <div className="flex items-start justify-between w-full flex-col">
          <h1 className="text-2xl font-semibold font-display uppercase">
            New Entry
          </h1>
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`text-nowrap px-4 py-2 ${containerStyles}`}
            onClick={handleDraftSaving}
          >
            <span>Save Draft</span>
          </button>

          <button
            type="submit"
            form="new-entry-form"
            disabled={isPending}
            className="bg-primary text-black cursor-pointer font-medium px-4 text-nowrap py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isPending ? "Publishing..." : "Publish Log"}</span>
          </button>
        </div>
      </div>

      {state?.message && (
        <Alert
          className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-md text-sm font-mono"
          variant={"default"}
        >
          <AlertTitle>Successful</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state?.error && (
        <Alert
          className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm font-mono"
          variant={"destructive"}
        >
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Form action={formAction} id="new-entry-form">
        <main className="space-y-8">
          <input
            type="hidden"
            name="classification"
            value={classificationSelected}
          />
          <input type="hidden" name="language" value={languageSelected} />
          <div className={`p-6 ${containerStyles}`}>
            <div className="space-y-3">
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
                onChange={(e) =>
                  setSaveDraft({ ...saveDraft, title: e.target.value })
                }
              />

              <label
                htmlFor="title"
                className="block font-mono text-sm font-medium text-zinc-500 uppercase mb-3"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                autoComplete="off"
                className="w-full bg-zinc-950 border resize-none overflow-y-auto border-zinc-800 focus:border-emerald-500 focus:ring-0 text-foreground py-3 px-4 placeholder:text-muted transition-all outline-none"
                placeholder="Specify clear, descriptive intent..."
                rows={4}
                aria-label="Notes"
                onChange={(e) =>
                  setSaveDraft({ ...saveDraft, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/** CLASSIFICATION */}
          <div className={`${containerStyles} p-6 `}>
            <div className="flex w-full flex-col gap-2 justify-between">
              <div className="space-y-2">
                <h2 className="font-display font-bold text-xl">
                  Classification
                </h2>
                <p className="text-muted-foreground font-mono text-sm">
                  Select Classsification
                </p>
              </div>

              <div className="flex w-full gap-2 items-center">
                <ToggleGroup
                  onValueChange={setClassificationSelected}
                  variant={"default"}
                  type="single"
                  className="w-full flex flex-wrap"
                >
                  <ToggleGroupItem
                    className={toggleStyles}
                    value="1"
                    aria-label="BUG"
                    size={"lg"}
                  >
                    <SquareDashedBottomCode size={18} className="mr-2" />
                    <span className="text-md">BUG</span>
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    className={toggleStyles}
                    value="2"
                    aria-label="FEATURE"
                    size={"lg"}
                  >
                    <Bug size={18} className="mr-2" />
                    <span className="text-md">FEATURE</span>
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    className={toggleStyles}
                    value="3"
                    aria-label="WIN"
                    size={"lg"}
                  >
                    <Medal size={18} className="mr-2" />
                    <span className="text-md">WIN</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          {/** LOGS ENTRIES */}
          <div className={`bg-card p-6 ${containerStyles}`}>
            <div className="space-y-6">
              <div className="flex w-full justify-between">
                <div className="space-y-2">
                  <h2 className="font-display font-bold text-xl">Logs here</h2>
                </div>

                <Select
                  onValueChange={(val) =>
                    setLanguageSelected(val as BundledLanguage)
                  }
                  value={languageSelected}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {progLangs
                        ?.filter((l) =>
                          Object.keys(bundledLanguages).includes(l.name),
                        )
                        .map((l) => (
                          <SelectItem key={l.id} value={l.id.toString()}>
                            {l.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <CodeEditor
                name="content"
                placeholder="Enter Logs here...."
                value={codeBlockText}
                onChange={(val) => setCodeBlockText(val)}
                lang={
                  (progLangs?.find((l) => l.id.toString() === languageSelected)
                    ?.name as BundledLanguage) || ("" as BundledLanguage)
                }
              />
            </div>
          </div>

          {/** LOG GUIDELINES */}
          <div className={`p-6 ${containerStyles}`}>
            <h3 className="font-mono text-zinc-500 uppercase mb-4 border-b border-zinc-800 pb-2 text-sm font-medium">
              Log Guidelines
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-zinc-400 font-mono">
                <span className="text-primary">01</span>
                <span>Be specific about the environment and dependencies.</span>
              </li>
              <li className="flex gap-3 text-sm text-zinc-400 font-mono">
                <span className="text-primary">02</span>
                <span>Include code snippets for reusability.</span>
              </li>
              <li className="flex gap-3 text-sm text-zinc-400 font-mono">
                <span className="text-primary">03</span>
                <span>Clearly mark 'Wins' for team visibility.</span>
              </li>
            </ul>
          </div>
        </main>
      </Form>
    </div>
  );
}
