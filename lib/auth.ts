import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, organization } from "better-auth/plugins";
import { dash, sendEmail } from "@better-auth/infra";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    dash(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `http://localhost:3000/accept-invitation/${data.id}`;
        await sendEmail({
          template: "invitation",
          to: data.email,
          variables: {
            inviteLink,
            inviterName: data.inviter.user.name,
            inviterEmail: data.inviter.user.email,
            organizationName: data.organization.name,
            appName: "Dev Log",
          },
        });
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        template: "reset-password",
        to: user.email,
        variables: {
          resetLink: url,
          userEmail: user.email,
          userName: user.name,
          appName: "Dev Log",
        },
      });
    },
  },
  trustedOrigins: ["http://localhost:3000", "https://devlog.vercel.app"],
});
