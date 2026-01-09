import * as React from "react";
import { ChevronRight, FileIcon } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNoteBooks } from "@/server/notebook";
import Image from "next/image";
import SidebarData from "./sidebar-data";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const notebooks = await getNoteBooks();

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
              url: `dashboard/${notebook._id.toString()}`,
              items: notebookNotes.map((note) => ({
                title: note.title,
                url: `dashboard/notebook/${notebook._id.toString()}/note/${note._id.toString()}`,
              })),
            };
          })
        : [],
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 w-full mx-auto">
          <Image
            src="/Logo.png"
            alt="logo"
            className="size-8"
            width={24}
            height={24}
          />
          <h2 className="text-lg font-medium">NoteForge</h2>
        </div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarData data={data} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
