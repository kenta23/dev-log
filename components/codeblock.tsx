"use client";
import { JSX, useEffect, useLayoutEffect, useState } from "react";
import { highlight } from "@/lib/shared";
import type { BundledLanguage } from "shiki/bundle/web";

interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
}

export default function CodeBlock({ code, lang }: CodeBlockProps) {
  const [nodes, setNodes] = useState<JSX.Element | null>(null);

  useLayoutEffect(() => {
    let isMounted = true;

    highlight(code, lang).then((result) => {
      if (isMounted) setNodes(result);
    });

    return () => {
      isMounted = false;
    };
  }, [code, lang]);

  return (
    <div className="bg-zinc-950 p-4 rounded-md overflow-x-auto w-full text-sm border border-zinc-800 [&>pre]:bg-transparent!">
      {nodes ?? (
        <span className="text-muted-foreground">Highlighting code...</span>
      )}
    </div>
  );
}
