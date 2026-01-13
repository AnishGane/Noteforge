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
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";

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
  const [openNotebook, setOpenNotebook] = useState<string | null>(null);

  const [search] = useQueryState("search", { defaultValue: "" });
  const query = search.toLowerCase();
  const pathname = usePathname();

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
  const router = useRouter();

  return (
    <>
      {filteredData.map((item) => (
        <Collapsible
          key={item?.title}
          open={openNotebook === item!.title}
          onOpenChange={(open) => setOpenNotebook(open ? item!.title : null)}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                <div
                  className="flex gap-2 items-center"
                  onClick={() => {
                    router.push(item!.url);
                  }}
                >
                  <FolderIcon className="h-4 w-4" />
                  {item?.title}
                </div>
                {item?.items?.length! > 0 && (
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item?.items.map((note) => (
                    <SidebarMenuItem key={note.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === note.url}
                      >
                        <Link
                          href={note.url}
                          className="pl-6 flex items-center gap-2"
                        >
                          <FileIcon className="h-4 w-4" />
                          {note.title}
                        </Link>
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
