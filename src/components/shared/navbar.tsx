"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, UserRound, Receipt, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, useLogout } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/shared/notification-bell";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/", label: "Laman Utama" },
  { href: "/facilities", label: "Kemudahan" },
  { href: "/media", label: "Media" },
  { href: "/booking/lookup", label: "Semak Tempahan" },
];

function AuthArea({ onNavigate, mobile }: { onNavigate?: () => void; mobile?: boolean }) {
  const router = useRouter();
  const { data: session, isLoading } = useSession();
  const logout = useLogout();

  if (isLoading) return null;

  const firstName = session?.name.split(" ")[0];

  function doLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        onNavigate?.();
        router.push("/");
        router.refresh();
      },
    });
  }

  if (session) {
    // Mobile: flat stacked links inside the sheet.
    if (mobile) {
      return (
        <div className="flex flex-col gap-1">
          <Link href="/profile" onClick={onNavigate} className="flex items-center gap-2.5 py-2 text-base font-semibold">
            <UserRound className="h-4 w-4" aria-hidden /> Profil Saya
          </Link>
          <Link
            href="/profile?tab=payments"
            onClick={onNavigate}
            className="flex items-center gap-2.5 py-2 text-base font-semibold"
          >
            <Receipt className="h-4 w-4" aria-hidden /> Sejarah Pembayaran
          </Link>
          {session.role === "ADMIN" && (
            <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 py-2 text-base font-semibold">
              <LayoutDashboard className="h-4 w-4" aria-hidden /> Panel Admin
            </Link>
          )}
          <button
            onClick={doLogout}
            className="flex items-center gap-2.5 py-2 text-left text-base font-semibold text-destructive"
          >
            <LogOut className="h-4 w-4" aria-hidden /> Log Keluar
          </button>
        </div>
      );
    }

    // Desktop: notification bell + account dropdown.
    return (
      <div className="flex items-center gap-2">
        <NotificationBell isAdmin={session.role === "ADMIN"} />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex cursor-pointer items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 transition-colors hover:bg-muted">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {firstName?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm font-bold">{firstName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-bold">{session.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/profile" />}>
            <UserRound className="h-4 w-4" aria-hidden /> Profil Saya
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/profile?tab=payments" />}>
            <Receipt className="h-4 w-4" aria-hidden /> Sejarah Pembayaran
          </DropdownMenuItem>
          {session.role === "ADMIN" && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <LayoutDashboard className="h-4 w-4" aria-hidden /> Panel Admin
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={doLogout} className="text-destructive">
            <LogOut className="h-4 w-4" aria-hidden /> Log Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    );
  }

  return (
    <div className={mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}>
      <Button
        render={<Link href="/login" onClick={onNavigate} />}
        variant={mobile ? "outline" : "ghost"}
        className="rounded-full font-bold uppercase tracking-wide"
      >
        Log Masuk
      </Button>
      <Button
        render={<Link href="/facilities" onClick={onNavigate} />}
        className="rounded-full bg-accent px-5 font-bold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
      >
        Tempah Sekarang
      </Button>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-accent font-heading text-lg font-extrabold text-accent-foreground">
            P
          </span>
          <span className="font-heading text-xl font-extrabold uppercase leading-none tracking-tight text-foreground">
            PPUWTR <span className="text-foreground/40">Club</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-bold uppercase tracking-wide text-foreground/60 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <AuthArea />
        </div>

        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-base font-semibold" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2">
              <AuthArea mobile onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
