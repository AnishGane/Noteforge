"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";

function LogoutPage() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        credentials: "include",
      },
    });
    window.location.replace("/");
  };
  return (
    <Button variant={"outline"} onClick={handleLogout}>
      <LogOutIcon className="size-4" />
      Logout
    </Button>
  );
}

export default LogoutPage;
