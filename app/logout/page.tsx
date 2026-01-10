"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function LogoutPage() {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  return (
    <Button variant={"outline"} onClick={handleLogout}>
      <LogOutIcon className="size-4" />
      Logout
    </Button>
  );
}

export default LogoutPage;
