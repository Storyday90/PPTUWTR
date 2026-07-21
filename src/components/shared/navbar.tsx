"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, useLogout } from "@/hooks/useAuth";

const links = [
  { href: "/", label: "Laman Utama" },
  { href: "/facilities", label: "Kemudahan" },
  { href: "/booking/lookup", label: "Semak Tempahan" },
];

function AuthArea({ onNavigate, mobile }: { onNavigate?: () => void; mobile?: boolean }) {
  const router = useRouter();
  const { data: session, isLoading } = useSession();
  const logout = useLogout();

  if (isLoading) return null;

  if (session) {
    return (
      <div className={mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}>
        {session.role === "ADMIN" && (
          <Button render={<Link href="/admin" onClick={onNavigate} />} variant="outline">
            Panel Admin
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            logout.mutate(undefined, {
              onSuccess: () => {
                onNavigate?.();
                router.push("/");
                router.refresh();
              },
            });
          }}
        >
          Log Keluar ({session.name.split(" ")[0]})
        </Button>
      </div>
    );
  }

  return (
    <div className={mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}>
      <Button render={<Link href="/login" onClick={onNavigate} />} variant={mobile ? "outline" : "ghost"}>
        Log Masuk
      </Button>
      <Button
        render={<Link href="/facilities" onClick={onNavigate} />}
        className="bg-accent font-semibold tracking-tight text-accent-foreground hover:bg-accent/90"
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
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-primary font-heading text-lg font-semibold text-primary-foreground">
            <span className="absolute inset-1 rounded-[3px] border border-accent/40" aria-hidden />P
          </span>
          <span className="font-heading text-xl font-semibold leading-none tracking-tight text-foreground">
            PPUWTR <span className="accent-italic text-accent">Arena</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-accent"
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
