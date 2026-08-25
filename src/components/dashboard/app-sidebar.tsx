"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ClipboardCheck, LayoutDashboard, ScanEye } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/live", label: "Live View", icon: ScanEye },
  { href: "/dashboard/review", label: "Review", icon: ClipboardCheck },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col">
      <Link href="/dashboard" className="flex gap-2 items-center mb-4 px-2">
        <Image
          src={"/logo-main.svg"}
          alt="Wastara"
          width={40}
          height={40}
          className="w-auto h-8 rounded-sm"
        />
        <span className="text-[18px] font-semibold tracking-[-0.01em] text-heading">Wastara</span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[14px] transition-colors",
                isActive
                  ? "bg-white font-medium text-accent-dark"
                  : "text-muted hover:bg-white/80 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
