"use client";
import { useEffect, useState, useRef } from "react";
import type { JSX } from "react";
import { highlight } from "@/lib/shared";
import type { BundledLanguage } from "shiki/bundle/web";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  lang: BundledLanguage;
  placeholder?: string;
  name?: string;
}

export default function CodeEditor({
  value,
  onChange,
  lang,
  placeholder,
  name,
}: CodeEditorProps) {
  const [nodes, setNodes] = useState<JSX.Element | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (!value) {
      setNodes(null);
      return;
    }

    highlight(value, lang).then((result) => {
      if (isMounted) setNodes(result);
    });

    return () => {
      isMounted = false;
    };
  }, [value, lang]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = e.currentTarget.scrollTop;
      scrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const sharedStyles =
    "font-mono text-sm leading-relaxed tracking-normal text-left whitespace-pre [tab-size:2]";

  return (
    <div className="relative focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 w-full h-[500px] bg-zinc-950/50 focus-within:bg-zinc-950 rounded-md border border-zinc-800 transition-all overflow-hidden">
      {/* Background: Syntax Highlighted Code */}
      <div
        ref={scrollRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none p-4 ${sharedStyles} **:font-sans! [&>pre]:bg-transparent! [&>pre]:m-0! [&>pre]:p-0!`}
        aria-hidden="true"
      >
        {nodes ?? (
          <div className="text-zinc-500">{value ? value : placeholder}</div>
        )}
      </div>

      {/* Foreground: Textarea */}
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        wrap="off"
        className={`absolute inset-0 w-full h-full p-4 resize-none bg-transparent text-transparent caret-zinc-100 outline-none border-none focus:ring-0 m-0 ${sharedStyles}`}
      />
    </div>
  );
}
