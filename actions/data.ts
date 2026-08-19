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
    lang,
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

export async function getAnalytics() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const logs = await prisma.logs.findMany({
    where: { userId: session.user.id },
    include: {
      classification: true,
      language: true,
    },
    orderBy: { createdAt: "desc" },
  });

  //aggregate total logs
  const totalLogs = logs.length;

  const countLanguages = logs
    .map((log) => {
      return {
        language: log.language.name,
        id: log.languageId,
      };
    })
    .reduce((acc: { language: string; id: number; count: number }[], log) => {
      const existing = acc.find((item) => item.id === log.id);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          language: log.language,
          id: log.id,
          count: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.id - b.id);

  const countClassification = logs
    .map((item) => {
      return {
        classification: item.classification.name,
        id: item.classificationId,
      };
    })
    .reduce(
      (acc: { classification: string; id: number; count: number }[], log) => {
        const existing = acc.find((item) => item.id === log.id);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({
            classification: log.classification,
            id: log.id,
            count: 1,
          });
        }
        return acc;
      },
      [],
    )
    .sort((a, b) => a.id - b.id);

  return {
    totalLogs,
    countClassification,
    countLanguages,
    logs,
  };
}

export async function contributionsData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const logs = await prisma.logs.findMany({
    where: { userId: session.user.id },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by YYYY-MM-DD and sum counts
  const countByDate = logs.reduce((acc: Record<string, number>, log) => {
    const dateStr = log.createdAt.toISOString().split("T")[0];
    acc[dateStr] = (acc[dateStr] ?? 0) + 1;
    return acc;
  }, {});

  const max = Math.max(...Object.values(countByDate), 1);

  function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    const ratio = count / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  const data = Object.entries(countByDate)
    .map(([date, count]) => ({
      date,
      count,
      level: getLevel(count),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return data;
}

export async function getLogById(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  if (!id) {
    throw new Error("Log not found");
  }

  const data = await prisma.logs.findFirst({
    where: {
      id,
      userId: session?.user.id,
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
  });

  if (!data) {
    throw new Error("Log not found");
  }

  return data;
}
