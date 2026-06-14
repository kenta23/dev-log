"use client";
"use no memo";

import { signupUser } from "@/actions/auth";
import { useActionState, useState } from "react";
import Form from "next/form";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function SignUpForm() {
  const [state, signUpUserAction, isPending] = useActionState(signupUser, null);
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const {
    data: session,
    isPending: isLoading, //loading state
    error, //error object
    refetch, //refetch the session
  } = useSession();

  const router = useRouter();

  const handleRedirectUser = () => {
    router.push("/");
  };

  const handleLogoutUser = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); //redirect to login page
        },
      },
    });
  };

  return (
    <Form action={signUpUserAction} className="space-y-6" id="loginForm">
      {state?.success && (
        <Alert
          className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-md text-sm font-mono"
          variant={"default"}
        >
          <AlertTitle>Successful</AlertTitle>
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}
      {state?.error && (
        <Alert
          className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm font-mono"
          variant={"destructive"}
        >
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
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
            type="text"
            id="username"
            name="username"
            placeholder="username@node"
            required
            defaultValue=""
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#e5e1e4] font-mono px-4 py-3 placeholder:opacity-20 text-[13px]"
          />
        </div>
      </div>

      {/**Email Field*/}
      <div className="space-y-2 group">
        <label
          htmlFor="email"
          className="font-mono text-[13px] text-[#bbcabf] group-focus-within:text-[#4edea3] transition-colors block"
        >
          &gt; Email
        </label>
        <div className="relative flex items-center border border-[#3c4a42] bg-[#131315] glow-border transition-all duration-200">
          <input
            type="email"
            id="email"
            name="email"
            aria-label="Email"
            placeholder="[EMAIL_ADDRESS]"
            required
            defaultValue=""
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
            defaultValue=""
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#e5e1e4] font-mono px-4 py-3 placeholder:opacity-20 text-[13px]"
          />
        </div>
      </div>

      {/* Confirm Password Field */}
      {/**SHOW ONLY CONFIRM PASSWORD IF THE PASSWORD IS NOT EMPTY */}
      {password.length > 6 && (
        <motion.div
          className="space-y-2 group"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <label
            htmlFor="confirm-password"
            className="font-mono text-[13px] text-[#bbcabf] group-focus-within:text-[#4edea3] transition-colors block"
          >
            &gt; Confirm_Access_Key
          </label>
          <div className="relative flex items-center border border-[#3c4a42] bg-[#131315] glow-border transition-all duration-200">
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="••••••••"
              required
              defaultValue=""
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#e5e1e4] font-mono px-4 py-3 placeholder:opacity-20 text-[13px]"
            />
          </div>
        </motion.div>
      )}

      {/* Sign In Button */}
      <button
        type="submit"
        className={`w-full font-mono cursor-pointer text-sm font-medium py-4 flex items-center justify-center gap-2 group transition-all duration-150 uppercase bg-[#4edea3] text-[#003824] hover:brightness-110 active:scale-[0.98]
                  `}
      >
        <span>SIGN_UP</span>
        <ArrowRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>

      <Dialog open={!!state?.success} modal>
        <DialogContent showCloseButton={false} className="justify-center">
          <DialogHeader>
            <div className="flex items-center justify-center">
              <Check size={32} className="text-primary text-center" />
            </div>
            <DialogTitle className="text-center">
              YOUR ACCOUNT HAS BEEN SUCCESSFULLY CREATED
            </DialogTitle>
            <DialogDescription className="text-center">
              We've successfully created your account, You can now login to your
              account
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="w-full flex flex-col gap-2">
              <Button
                type="button"
                className="w-full cursor-pointer"
                variant={"default"}
                onClick={handleRedirectUser}
              >
                LOGIN
              </Button>

              <Button
                type="button"
                onClick={handleLogoutUser}
                className="w-full cursor-pointer"
                variant={"secondary"}
              >
                GO BACK
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
