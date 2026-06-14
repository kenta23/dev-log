"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signupUser(prevState: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const data = await auth.api.signUpEmail({
      body: {
        name: username,
        email: email,
        password: password,
      },
      headers: await headers(),
    });

    if (!data?.user) {
      return { error: "User not found" };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to sign up" };
  }

  return { success: "User created successfully" };
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all the fields" };
  }

  try {
    const data = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
        rememberMe: true,
      },
      headers: await headers(),
    });

    if (!data?.user) {
      return { error: "User not found" };
    }
  } catch (error: any) {
    return { error: error.message || "Invalid email or password" };
  }

  redirect("/dashboard");
}
