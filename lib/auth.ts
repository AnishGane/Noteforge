import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "@/lib/mongodb";
import { nextCookies } from "better-auth/next-js";

const db = await connectDB();

export const auth = betterAuth({
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     void sendEmail({
  //       to: user.email,
  //       subject: "Verify your email address",
  //       text: `Click the link to verify your email: ${url}`,
  //     });
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  database: mongodbAdapter(db),
  plugins: [nextCookies()],
});
