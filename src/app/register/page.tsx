"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema, type RegisterFormInput } from "@/lib/validation/auth.schema";
import { useRegister } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) });

  function onSubmit(values: RegisterFormInput) {
    registerUser.mutate(values, {
      onSuccess: () => {
        router.push("/");
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
                <h1 className="display mt-2 text-3xl">Daftar Akaun</h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama Penuh</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Emel</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefon (pilihan)</Label>
                  <Input id="phone" {...register("phone")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Kata Laluan</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={registerUser.isPending}
                  className="w-full rounded-full bg-primary font-bold uppercase tracking-wide hover:bg-primary/90"
                >
                  {registerUser.isPending ? "Memproses…" : "Daftar"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground">
                Sudah ada akaun?{" "}
                <Link href="/login" className="font-bold text-foreground underline-offset-4 hover:underline">
                  Log Masuk
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
