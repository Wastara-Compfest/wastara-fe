"use client";

import { createContext, useContext } from "react";

import { useInspectionSession } from "@/hooks/use-inspection-session";

type InspectionSessionValue = ReturnType<typeof useInspectionSession>;

const InspectionSessionContext = createContext<InspectionSessionValue | null>(
  null,
);

export function InspectionSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useInspectionSession();
  return (
    <InspectionSessionContext.Provider value={session}>
      {children}
    </InspectionSessionContext.Provider>
  );
}

export function useInspectionSessionContext() {
  const ctx = useContext(InspectionSessionContext);
  if (!ctx) {
    throw new Error("useInspectionSessionContext requires InspectionSessionProvider");
  }
  return ctx;
}

export function useOptionalInspectionSession() {
  return useContext(InspectionSessionContext);
}
