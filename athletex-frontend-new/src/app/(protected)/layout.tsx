"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import PageLoader from "@/components/molecules/page-loader";
import { useIsLoggedIn } from "@/hooks/use-is-logged-in"; // ✅ import your new hook
import { useRouter } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isLoading, isLoggedIn } = useIsLoggedIn();
  const router = useRouter();

  if (isLoading) return <PageLoader />;
  if (!isLoggedIn) {
    router.push("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-50">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-0 pt-0 mx-auto w-full max-w-[1300px] !px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
