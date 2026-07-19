"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BookingLookupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/booking/${trimmed}`);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
          <Card>
            <CardContent className="space-y-4 p-8">
              <h1 className="text-center font-heading text-xl font-bold">Semak Tempahan</h1>
              <p className="text-center text-sm text-muted-foreground">
                Masukkan kod tempahan anda (cth: PPUWTR-20260719-4F2K) untuk melihat status.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="code">Kod Tempahan</Label>
                  <Input
                    id="code"
                    placeholder="PPUWTR-20260719-4F2K"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Semak
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
