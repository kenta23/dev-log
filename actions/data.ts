"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHighlighter } from "shiki";

export async function getLanguages() {
  //session checker

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const proglangs = await prisma.lang.findMany();

  return proglangs;
}

async function getCodeTokens(lang: string, code: string) {
  const highlighter = await createHighlighter({
    themes: ["github-dark"],
    langs: [lang],
  });

  const tokens = highlighter.codeToHtml(code, {
    theme: "github-dark",
    lang: lang,
  });

  return tokens;
}
export async function getAllLogs() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const logs = await prisma.logs.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      classification: {
        select: {
          id: true,
          name: true,
        },
      },
      language: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  //modified logs to include code tokens using shiki
  const newLogs = await Promise.all(
    logs.map(async (log) => {
      const tokens = await getCodeTokens(log.language.name, log.codes);
      return {
        ...log,
        codes: tokens,
      };
    }),
  );

  return newLogs;
}
