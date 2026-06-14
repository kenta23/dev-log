"use client";

import Form from "next/form";
import { loginUser } from "@/actions/auth";
import { useActionState } from "react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  return (
    <Form action={formAction} className="space-y-6" id="loginForm">
      {state?.error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm font-mono">
          {state.error}
        </div>
      )}

      {/* Username Field */}
      <div className="space-y-2 group">
        <label
          htmlFor="username"
          className="font-mono text-[13px] text-[#bbcabf] group-focus-within:text-[#4edea3] transition-colors block"
        >
          &gt; Root_User
        </label>
        <div className="relative flex items-center border border-[#3c4a42] bg-[#131315] glow-border transition-all duration-200">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="[EMAIL_ADDRESS]"
            required
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#e5e1e4] font-mono px-4 py-3 placeholder:opacity-20 text-[13px]"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2 group">
        <label
          htmlFor="password"
          className="font-mono text-[13px] text-[#bbcabf] group-focus-within:text-[#4edea3] transition-colors block"
        >
          &gt; Access_Key
        </label>
        <div className="relative flex items-center border border-[#3c4a42] bg-[#131315] glow-border transition-all duration-200">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#e5e1e4] font-mono px-4 py-3 placeholder:opacity-20 text-[13px]"
          />
        </div>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isPending}
        className={`w-full cursor-pointer font-mono text-sm font-medium py-4 flex items-center justify-center gap-2 group transition-all duration-150 uppercase bg-[#4edea3] text-[#003824] hover:brightness-110 active:scale-[0.98]`}
      >
        <span>SIGN_IN</span>
        <ArrowRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </Form>
  );
}
