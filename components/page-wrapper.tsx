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
import { ModeToggle } from "./mode-toggle";

interface PageWrapperProps {
  children: React.ReactNode;
  breadCrumbs: {
    label: string;
    path: string;
  }[];
}

export default function PageWrapper({
  children,
  breadCrumbs,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col gap-4 ">
      <header className="flex items-center p-4 border border-b ">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumbs.map((breadcrumb) => (
                  <BreadcrumbItem key={breadcrumb.path}>
                    <BreadcrumbLink href={breadcrumb.path}>
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3">
<ModeToggle/>
          <LogoutPage />
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </div>
  );
}
