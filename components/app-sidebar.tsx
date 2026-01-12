import * as React from "react";

import { SearchForm } from "@/components/search-form";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNoteBooks } from "@/server/notebook";
import Image from "next/image";
import SidebarData from "./sidebar-data";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const notebooks = await getNoteBooks();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const username = session?.user?.name;

  const data = {
    navMain:
      notebooks.success && notebooks.data.notebooks
        ? notebooks.data.notebooks.map((notebook) => {
            // Filter notes for this notebook
            const notebookNotes =
              notebooks.data.notes?.filter(
                (note) => note.notebookId.toString() === notebook._id.toString()
              ) || [];

            return {
              title: notebook.name,
              url: `/dashboard/notebook/${notebook._id.toString()}`,
              items: notebookNotes.map((note) => ({
                title: note.title,
                url: `/dashboard/notebook/${notebook._id.toString()}/note/${note._id.toString()}`,
              })),
            };
          })
        : [],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="w-full">
          <Link href="/" className="w-max py-3 flex items-center gap-2 pl-2">
            <Image
              src="/Logo.png"
              alt="logo"
              className="size-8"
              width={24}
              height={24}
            />
            <h2 className="text-lg font-medium">NoteForge</h2>
          </Link>
        </div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0 mt-2">
        <SidebarData data={data} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {username || "User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <User2 />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
