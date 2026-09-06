import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { sentinelClient } from "@better-auth/infra/client";

export const { signIn, signOut, useSession } = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [emailOTPClient(), sentinelClient()],
});
