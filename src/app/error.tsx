"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold">Sesuatu telah tidak kena.</h1>
      <p className="max-w-md text-muted-foreground">
        Maaf, berlaku ralat semasa memuatkan halaman ini. Sila cuba lagi.
      </p>
      <Button onClick={reset} className="bg-primary hover:bg-primary/90">
        Cuba Semula
      </Button>
    </div>
  );
}
