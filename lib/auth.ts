import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "@/lib/mongodb";

const db = await connectDB();

export const auth = betterAuth({
  database: mongodbAdapter(db),
});
