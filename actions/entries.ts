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

export async function createEntry(
  prevState: unknown,
  formData: FormData | null,
) {
  if (!formData) {
    return { message: "", error: undefined };
  }

  const title = formData.get("title");
  const classification = formData.get("classification");
  const language = formData.get("language");
  const notes = formData.get("notes");
  const content = formData.get("content");

  console.log("data", {
    title,
    classification,
    language,
    notes,
    content,
  });

  //session checker
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User not found" };
  }

  if (!title || !classification || !notes || !content) {
    return {
      error:
        "Missing required fields. Please ensure title, classification, and content are provided.",
    };
  }

  //validate data first
  const validateData = z.object({
    title: z.string().min(1, "Title is required"),
    classification: z.string().min(1, "Classification is required"),
    language: z.string().min(1, "Language is required"),
    notes: z.string().min(1, "Notes is required"),
    content: z.string().min(1, "Content is required"),
  });

  const result = validateData.safeParse({
    title,
    classification,
    language,
    notes,
    content,
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
        notes: result.data.notes,
        codes: result.data.content,
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

  //invalidate data from the dashboard

  revalidatePath("/");

  return { message: "Entry successfully created!" };
}
