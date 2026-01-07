import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 text-xl self-center font-medium"
        >
          <Image
            src="/logo.png"
            alt="logo"
            className="size-8"
            width={24}
            height={24}
          />
          NoteForge
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
