"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.86-.08-1.68-.22-2.47H12v4.68h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.83Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29V6.62H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4.01-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.09C6.23 6.87 8.88 4.76 12 4.76Z"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M16.37 12.78c.03 3.18 2.79 4.24 2.82 4.25-.02.07-.44 1.51-1.45 2.99-.87 1.28-1.78 2.55-3.21 2.58-1.4.03-1.86-.83-3.46-.83-1.6 0-2.11.8-3.44.86-1.38.05-2.43-1.38-3.31-2.66-1.8-2.62-3.18-7.4-1.33-10.63.92-1.6 2.56-2.62 4.34-2.65 1.36-.03 2.64.91 3.47.91.83 0 2.39-1.13 4.03-.96.69.03 2.62.28 3.86 2.1-.1.06-2.3 1.35-2.28 4.01M13.76 3.5c.73-.89 1.22-2.12 1.09-3.35-1.05.04-2.32.7-3.08 1.58-.68.78-1.27 2.04-1.11 3.24 1.17.09 2.37-.59 3.1-1.47" />
    </svg>
  );
}

export function SocialAuthButtons({ mode = "register" }: { mode?: "register" | "login" }) {
  const verb = mode === "register" ? "Daftar" : "Log masuk";

  function notReady(provider: string) {
    toast.info(`${verb} dengan ${provider} akan disambungkan tidak lama lagi.`);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={() => notReady("Google")}
          className="h-11 w-full gap-2.5 rounded-full border-border font-bold uppercase tracking-wide"
        >
          <GoogleLogo />
          {verb} dengan Google
        </Button>
        <Button
          type="button"
          onClick={() => notReady("Apple ID")}
          className="h-11 w-full gap-2.5 rounded-full bg-foreground font-bold uppercase tracking-wide text-background hover:bg-foreground/90"
        >
          <AppleLogo />
          {verb} dengan Apple ID
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Atau guna emel</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
