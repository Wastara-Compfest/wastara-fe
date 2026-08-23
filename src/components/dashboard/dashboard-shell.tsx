import { AppSidebar } from "@/components/dashboard/app-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <aside className="hidden h-full w-[240px] shrink-0 md:block">
        <div className="flex h-full flex-col px-5 py-6">
          <AppSidebar />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-2 md:p-3">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
