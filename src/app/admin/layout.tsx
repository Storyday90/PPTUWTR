import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { LayoutDashboard, CalendarCheck, Layers, Ban } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Gambaran Keseluruhan", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Tempahan", icon: CalendarCheck },
  { href: "/admin/courts", label: "Gelanggang", icon: Layers },
  { href: "/admin/blocked-slots", label: "Slot Ditutup", icon: Ban },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-pitch">
      <aside className="hidden w-60 shrink-0 border-r border-pitch-foreground/10 bg-pitch text-pitch-foreground md:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-pitch-foreground/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-heading text-sm font-extrabold text-accent-foreground">
            P
          </span>
          <span className="font-heading text-sm font-extrabold uppercase tracking-tight">Panel Admin</span>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-pitch-foreground/70 transition-colors hover:bg-pitch-foreground/10 hover:text-accent"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-pitch-foreground/50 transition-colors hover:bg-pitch-foreground/10 hover:text-pitch-foreground"
          >
            ← Kembali ke Laman Utama
          </Link>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile admin nav — the sidebar is hidden on small screens */}
        <div className="sticky top-0 z-30 border-b border-border bg-pitch text-pitch-foreground md:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent font-heading text-sm font-extrabold text-accent-foreground">
                P
              </span>
              <span className="font-heading text-sm font-extrabold uppercase tracking-tight">Panel Admin</span>
            </div>
            <Link href="/" className="text-xs font-bold uppercase tracking-wide text-pitch-foreground/60">
              ← Laman Utama
            </Link>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-pitch-foreground/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-pitch-foreground/80 transition-colors hover:bg-pitch-foreground/10 hover:text-accent"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 bg-background p-4 sm:p-6">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
