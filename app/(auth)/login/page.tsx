import {
  Lock,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import LoginForm from "./loginform";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <section className="max-w-[440px] w-full mx-auto flex flex-col bg-accent border border-gray-200 p-8 relative">
      {/* Brutalist Decorative Corner Accent s */}
      <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#4edea3]"></div>
      <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#4edea3]"></div>

      <div className="mb-8">
        <h2 className="font-mono text-sm font-medium text-[#e5e1e4] flex items-center gap-2 uppercase tracking-wide">
          <Lock size={18} />
          DEV LOGS
        </h2>
        <div className="h-px w-full bg-[#3c4a42] mt-4"></div>
      </div>

      <LoginForm />

      {/* Footer Actions */}
      <footer className="mt-auto pt-6 border-t border-[#3c4a42] flex flex-col items-center gap-4">
        <Link
          href="/sign-up"
          className="font-mono text-[13px] text-[#bbcabf] hover:text-[#4edea3] transition-colors flex items-center gap-2 group"
        >
          <PlusCircle size={16} />
          <span>Request Access</span>
        </Link>
      </footer>
    </section>
  );
}
