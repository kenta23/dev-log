"use server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type dataCreateEntry = {
  title: string;
  classification: string;
  language: string;
  notes: string | null;
  logs: string;
};

export async function createEntry(data: {
  title: string;
  classification: string;
  language: string;
  notes: string | null;
  logs: string;
  collectionId?: string;
}) {
  if (!data) {
    return { message: "", error: undefined };
  }

  const title = data.title;
  const classification = data.classification;
  const language = data.language;
  const notes = data.notes;
  const logs = data.logs;
  const collectionId = data.collectionId;

  console.log("data to submit", {
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
        collection: collectionId
          ? {
              connect: {
                id: parseInt(collectionId, 10),
              },
            }
          : undefined,
        language: {
          connect: {
            name: result.data.language,
          },
        },
      },
    });

    console.log("LOGS", logs);

    return { message: "Entry successfully created!" };
  } catch (error) {
    // Prisma throws a "P2025" error if a record to connect isn't found
    return { error: "Classification or Language not found." };
  }
}

export async function editNewEntry(id: number, data: dataCreateEntry) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const title = data.title;
  const classification = data.classification;
  const language = data.language;
  const notes = data.notes;
  const logs = data.logs;

  if (!session?.user) {
    return { error: "User not found" };
  }

  if (!id) {
    return { error: "Invalid ID" };
  }

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
    const log = await prisma.logs.update({
      where: {
        id: id,
      },
      data: {
        title: result.data.title,
        notes: result.data.notes || "",
        codes: result.data.logs,
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
    console.log("UPDATED LOG", log);
  } catch (error) {
    return { error: "Failed to edit log" };
  }
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

export async function createCollection(name: string) {
  const result = z
    .string()
    .min(3, "Collection name must be at least 3 characters")
    .safeParse(name);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User not found" };
  }

  const newcollection = await prisma.collections.create({
    data: {
      name: result.data,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  if (!newcollection) {
    return { error: "Failed to create collection" };
  }

  return { message: "Collection created successfully" };
}

export async function getLogsByCollectionId(collectionId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User not found" };
  }

  if (!collectionId) {
    return { error: "Invalid ID" };
  }

  try {
    const logs = await prisma.logs.findMany({
      where: {
        collectionId: collectionId,
        userId: session.user.id,
      },
      include: {
        language: true,
        classification: true,
        collection: true,
      },
    });

    console.log("LOGS", logs);
    return logs;
  } catch (error) {
    return { error: "Failed to get logs" };
  }
}

export async function editCollection(data: {
  name: string;
  collectionId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User not found" };
  }

  if (!data.collectionId) {
    return { error: "Invalid Collection ID" };
  }

  try {
    const collection = await prisma.collections.update({
      where: {
        id: parseInt(data.collectionId),
        userId: session.user.id,
      },
      data: {
        name: data.name,
      },
    });

    if (collection.id) {
      return { message: "Collection updated successfully" };
    }
  } catch (error) {
    return { error: "Failed to update collection" };
  }
}
