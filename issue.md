i have this flow as i am in dashboard : localhost:3000/. so i have this side bar data component: "use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import { useQueryState } from "nuqs";

interface SidebarDataProps {
  data: {
    navMain: {
      title: string;
      url: string;
      items: {
        title: string;
        url: string;
      }[];
    }[];
  };
}

export default function SidebarData({ data }: SidebarDataProps) {
  const [search] = useQueryState("search", { defaultValue: "" });
  const query = search.toLowerCase();

  const filteredData = data.navMain
    .map((notebook) => {
      const notebookMatches = notebook.title.toLowerCase().includes(query);

      const filteredNotes = notebook.items.filter((note) =>
        note.title.toLowerCase().includes(query)
      );

      if (!notebookMatches && filteredNotes.length === 0) {
        return null;
      }

      return {
        ...notebook,
        items: notebookMatches ? notebook.items : filteredNotes,
      };
    })
    .filter(Boolean);

  return (
    <>
      {filteredData.map((item) => (
        <Collapsible
          key={item?.title}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                <div className="flex gap-2 items-center">
                  <FolderIcon className="h-4 w-4" />
                  {item?.title}
                </div>
                {item?.items?.length > 0 && (
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item?.items.map((note) => (
                    <SidebarMenuItem key={note.url}>
                      <SidebarMenuButton asChild>
                        <a
                          href={note.url}
                          className="pl-6 flex items-center gap-2"
                        >
                          <FileIcon className="h-4 w-4" />
                          {note.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  );
}

as i click on thenotes from dashoard it routes to http://localhost:3000/dashboard/notebook/6960a98346a4ba28209f0085/note/6960abc746a4ba28209f0086, which is fine , so when i am in notebook page: 6960a98346a4ba28209f0085 and if i click on the notes when i am in notebook page it routes to: http://localhost:3000/dashboard/notebook/dashboard/notebook/6960a98346a4ba28209f0085/note/6960abc746a4ba28209f0086 so page not found problem is there.
 and also see this: import * as React from "react";
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
