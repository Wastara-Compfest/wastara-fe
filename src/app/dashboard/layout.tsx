import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { InspectionSessionProvider } from "@/components/dashboard/inspection-session-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <InspectionSessionProvider>{children}</InspectionSessionProvider>
    </DashboardShell>
  );
}
