"use client";

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
import { ChevronRight, FileIcon } from "lucide-react";
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
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                {item?.title}
                {item?.items.length > 0 && (
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
                        <a href={note.url} className="pl-4 flex items-center gap-2">
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
