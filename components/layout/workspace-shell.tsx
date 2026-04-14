"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  SlidersHorizontal,
  GitCompare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ru } from "@/lib/i18n/ru";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { href: "/dashboard", label: ru.nav.dashboard, icon: LayoutDashboard },
  { href: "/onboarding", label: ru.nav.goals, icon: SlidersHorizontal },
  { href: "/compare", label: ru.nav.compare, icon: GitCompare },
] as const;

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-muted/30 lg:flex">
      <aside className="border-b bg-sidebar lg:w-[15.5rem] lg:min-w-0 lg:border-b-0 lg:border-r">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 px-4 py-4 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">{ru.brand.title}</div>
            <div className="truncate text-xs text-muted-foreground">{ru.brand.taglineWorkspace}</div>
          </div>
        </Link>
        <Separator />
        <nav className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-2 py-3 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (item.href === "/dashboard" && pathname.startsWith("/niches/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-10 shrink-0 snap-start items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors lg:min-h-0 lg:shrink lg:py-2",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-3 pb-4 lg:block">
          <div className="rounded-lg border bg-card p-3 text-xs text-muted-foreground">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <LineChart className="h-3.5 w-3.5" />
              {ru.brand.demoAsideTitle}
            </div>
            {ru.brand.demoAsideBody}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">Аналитика ниш маркетплейсов</div>
              <div className="truncate text-xs text-muted-foreground">{ru.brand.headerSubtitle}</div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {ru.brand.badgeDataset}
            </Badge>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1rem))] lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
