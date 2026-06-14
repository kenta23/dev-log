"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createEntry(prevState: unknown, formData: FormData) {
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
        userId: session.user.id,
        isDraft: false,
        classificationId: parseInt(result.data.classification, 10),
        languageId: parseInt(result.data.language, 10),
      },
    });
    console.log("LOGS", logs);
  } catch (error) {
    // Prisma throws a "P2025" error if a record to connect isn't found
    return { error: "Classification or Language not found." };
  }

  revalidatePath("/dashboard");

  return { message: "Entry successfully created!" };
}

type dataCreateEntry = {
  title: string;
  classification: string;
  language: string;
  notes: string;
  logs: string;
};

export async function createNewEntry(data: dataCreateEntry) {
  if (!data.title || !data.classification || !data.logs) {
    return {
      error:
        "Missing required fields. Please ensure title, classification, and content are provided.",
    };
  }

  // TODO: Actual database mutation using Prisma

  // const classificationFound = await prisma.classification.findUnique({
  //   where: {
  //     name: classification as string,
  //   },
  // });

  // const languageFound = await prisma.lang.findUnique({
  //   where: {
  //     name: language as string,
  //   },
  // });

  console.log({
    title: data.title as string,
    classification: data.classification as string,
    language: data.language as string,
    logs: data.logs as string,
  });
  // const logs = await prisma.logs.create({
  //   data: {
  //     title: title as string,
  //     classificationId: classificationFound?.id,
  //     languageId: languageFound?.id,
  //     notes: content as string,
  //     codes: content as string,
  //     userId: "dummy-user-id",
  //     id: crypto.randomUUID(),
  //   },
  // });

  revalidatePath("/dashboard");

  return { message: "Entry successfully created!" };
}
