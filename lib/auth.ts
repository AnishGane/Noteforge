import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "@/lib/mongodb";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import VerificationEmail from "@/components/emails/verification-email";
import PasswordResetEmail from "@/components/emails/reset-password";

const db = await connectDB();

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "NoteForge <onboarding@resend.dev>",
        to: [user.email],
        subject: "Email Verification",
        react: VerificationEmail({
          userName: user.name,
          userEmail: user.email,
          verificationLink: url,
        }),
      });
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "NoteForge <onboarding@resend.dev>",
        to: [user.email],
        subject: "Password Reset",
        react: PasswordResetEmail({
          userName: user.name,
          userEmail: user.email,
          resetLink: url,
          requestTime: new Date().toLocaleString(),
        }),
      });
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  database: mongodbAdapter(db),
  plugins: [nextCookies()],
});
