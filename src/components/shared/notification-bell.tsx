"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ms } from "date-fns/locale";
import { useNotifications, useMarkNotificationsRead } from "@/hooks/useNotifications";
import { useSession } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function NotificationBell({ className }: { className?: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.role === "ADMIN";
  const { data } = useNotifications(Boolean(session));
  const markRead = useMarkNotificationsRead();
  const unread = data?.unread ?? 0;
  const notifications = data?.notifications ?? [];

  if (!session) return null;

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open && unread > 0) markRead.mutate(undefined);
      }}
    >
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted",
              className,
            )}
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" aria-hidden />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-heading text-sm font-extrabold uppercase tracking-tight">Notifikasi</p>
          {notifications.length > 0 && (
            <button
              onClick={() => markRead.mutate(undefined)}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Tanda dibaca
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Bell className="h-6 w-6 text-muted-foreground/50" aria-hidden />
              <p className="text-sm text-muted-foreground">Tiada notifikasi lagi.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "border-b border-border px-4 py-3 last:border-b-0",
                  !n.readAt && "bg-accent/5",
                )}
              >
                <div className="flex items-start gap-2">
                  {!n.readAt && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />}
                  <div className={cn("min-w-0", n.readAt && "pl-4")}>
                    <p className="text-sm font-bold">{n.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ms })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <Link
          href={isAdmin ? "/admin/bookings" : "/profile?tab=payments"}
          className="block px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          {isAdmin ? "Ke pengurusan tempahan" : "Lihat sejarah tempahan"}
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
