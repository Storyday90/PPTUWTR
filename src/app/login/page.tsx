"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormInput } from "@/lib/validation/auth.schema";
import { useLogin } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginFormInput) {
    login.mutate(values, {
      onSuccess: () => {
        router.push(searchParams.get("next") ?? "/");
        router.refresh();
      },
      onError: (err: Error) => toast.error(err.message),
    });
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-secondary/40">
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
          <Card className="rounded-3xl">
            <CardContent className="space-y-5 p-8">
              <div className="text-center">
                <p className="eyebrow text-foreground/50">PPUWTR Club</p>
                <h1 className="display mt-2 text-3xl">Log Masuk</h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Emel</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Kata Laluan</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full rounded-full bg-primary font-bold uppercase tracking-wide hover:bg-primary/90"
                >
                  {login.isPending ? "Memproses…" : "Log Masuk"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground">
                Belum ada akaun?{" "}
                <Link href="/register" className="font-bold text-foreground underline-offset-4 hover:underline">
                  Daftar
                </Link>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Demo admin: admin@ppuwtr.org / Admin123! · Demo pelanggan: demo@ppuwtr.org / Demo123!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
