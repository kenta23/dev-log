import { signupUser } from "@/actions/auth";
import { backgroundCSS } from "@/lib/utils";
import { Lock, ArrowRight, ShieldHalf, LogIn } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Sign Up - Dev Log",
  description: "Create a new account in your Dev Log",
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex flex-col gap-6 items-center h-auto mb-8">
      <section className="max-w-[440px] w-full mx-auto flex flex-col bg-accent border border-gray-200 p-8 relative">
        {/* Brutalist Decorative Corner Accent s */}
        <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#4edea3]"></div>
        <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#4edea3]"></div>

        <div className="mb-8">
          <h2 className="text-sm md:text-xl text-accent-foreground flex items-center gap-2 uppercase tracking-wide">
            Initiate New account
          </h2>
          <p className="text-muted-foreground">
            <span className="font-semibold uppercase">Status:</span> Waiting for
            input sequence
          </p>
          <div className="h-px w-full bg-[#3c4a42] mt-4"></div>
        </div>

        <SignUpForm />

        {/* Footer Actions */}
        <footer className="mt-8 w-full pt-4 border-t border-[#dbe9e1] flex items-center gap-4">
          <div className="flex gap-2 items-center w-full">
            <ShieldHalf size={32} color="#10b981" />

            <p className="text-[#cfe7e1] text-xs">
              Notice: All session data is stored under{" "}
              <span className="text-primary">Private Dev_Log Encryption</span>{" "}
              protocols. By initializing, you agree to the Node Usage terms.
            </p>
          </div>
        </footer>
      </section>

      <Link
        href="/login"
        className="font-mono text-sm text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group"
      >
        <span>Already authenticated? Return to Login</span>
        <LogIn size={16} />
      </Link>
    </main>
  );
}
