"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import LogoutPage from "@/app/logout/page";
import { Fragment } from "react";
import { ModeSwitcher } from "./mode-switcher";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PageWrapperProps {
  children: React.ReactNode;
  breadCrumbs: {
    label: string;
    path: string;
  }[];
  initials?: string;
}

export default function PageWrapper({
  children,
  breadCrumbs,
  initials,
}: PageWrapperProps) {
  const pathname = usePathname();

  // finding the deepest matching breadcrumb index
  const activeIndex = breadCrumbs.reduce<number | null>((acc, crumb, index) => {
    if (pathname === crumb.path || pathname.startsWith(`${crumb.path}/`)) {
      return index;
    }
    return acc;
  }, null);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center p-4 border-b">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumbs.map((breadcrumb, index) => (
                  <Fragment key={breadcrumb.path}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={breadcrumb.path}>
                        <BreadcrumbPage
                          className={cn({
                            "text-primary": index === activeIndex,
                          })}
                        >
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    {index !== breadCrumbs.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn png"
              />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <ModeSwitcher />
            <LogoutPage />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </div>
  );
}
