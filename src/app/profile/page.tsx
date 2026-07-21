"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRound, Receipt } from "lucide-react";
import { useSession } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/account/profile-form";
import { PaymentHistory } from "@/components/account/payment-history";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileInner />
    </Suspense>
  );
}

function ProfileInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "payments" ? "payments" : "profile";
  const { data: session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !session) router.replace("/login?next=/profile");
  }, [isLoading, session, router]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="eyebrow text-foreground/50">Akaun Saya</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">
            Helo, <span className="accent-lime">{session?.name?.split(" ")[0] ?? "Ahli"}</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Urus maklumat peribadi anda dan semak sejarah tempahan &amp; pembayaran anda di satu tempat.
          </p>

          {isLoading || !session ? (
            <Skeleton className="mt-8 h-96 w-full rounded-2xl" />
          ) : (
            <Tabs defaultValue={defaultTab} className="mt-8 gap-6">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="profile" className="flex-1 gap-1.5">
                  <UserRound className="h-4 w-4" aria-hidden /> Profil
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex-1 gap-1.5">
                  <Receipt className="h-4 w-4" aria-hidden /> Sejarah Pembayaran
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                  <h2 className="display text-2xl">Maklumat Peribadi</h2>
                  <p className="mt-1 mb-6 text-sm text-muted-foreground">
                    Kemas kini nama, emel dan nombor telefon anda.
                  </p>
                  <ProfileForm />
                </div>
              </TabsContent>

              <TabsContent value="payments">
                <PaymentHistory />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
