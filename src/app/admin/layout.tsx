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
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
            P
          </span>
          <span className="font-heading text-sm font-bold">Panel Admin</span>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            ← Kembali ke Laman Utama
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
