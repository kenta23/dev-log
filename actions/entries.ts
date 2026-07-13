"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type dataCreateEntry = {
  title: string;
  classification: string;
  language: string;
  notes: string;
  logs: string;
};

export async function createEntry(data: {
  title: string;
  classification: string;
  language: string;
  notes: string | null;
  logs: string;
}) {
  if (!data) {
    return { message: "", error: undefined };
  }

  const title = data.title;
  const classification = data.classification;
  const language = data.language;
  const notes = data.notes;
  const logs = data.logs;

  console.log("data", {
    title,
    classification,
    language,
    notes,
    logs,
  });

  //session checker
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User not found" };
  }

  if (!title || !classification || !logs) {
    return {
      error:
        "Missing required fields. Please ensure title, classification, and logs are provided.",
    };
  }

  //validate data first
  const validateData = z.object({
    title: z.string().min(1, "Title is required"),
    classification: z.string().min(1, "Classification is required"),
    language: z.string().min(1, "Language is required"),
    notes: z.string().nullable(),
    logs: z.string().min(1, "Logs is required"),
  });

  const result = validateData.safeParse({
    title,
    classification,
    language,
    notes,
    logs,
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    const logs = await prisma.logs.create({
      data: {
        title: result.data.title,
        notes: result.data.notes || "",
        codes: result.data.logs,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        isDraft: false,
        classification: {
          connect: {
            id: parseInt(result.data.classification, 10),
          },
        },
        language: {
          connect: {
            name: result.data.language,
          },
        },
      },
    });

    console.log("LOGS", logs);
  } catch (error) {
    // Prisma throws a "P2025" error if a record to connect isn't found
    return { error: "Classification or Language not found." };
  }

  return { message: "Entry successfully created!" };
}

export async function deleteLog(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User not found" };
  }

  if (!id) {
    return { error: "Invalid ID" };
  }

  try {
    const log = await prisma.logs.delete({
      where: {
        id: id,
      },
    });
    console.log("LOGS", log);
  } catch (error) {
    return { error: "Failed to delete log" };
  }
}
