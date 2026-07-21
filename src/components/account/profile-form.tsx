"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema, type ProfileFormInput } from "@/lib/validation/account.schema";
import { useProfile, useUpdateProfile } from "@/hooks/useAccount";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { name: profile.name, email: profile.email, phone: profile.phone ?? "" }
      : undefined,
  });

  function onSubmit(values: ProfileFormInput) {
    update.mutate(values, {
      onSuccess: (user) => {
        toast.success("Profil dikemas kini.");
        reset({ name: user.name, email: user.email, phone: user.phone ?? "" });
      },
      onError: (err: Error) => toast.error(err.message),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
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
        <Label htmlFor="phone">No. Telefon</Label>
        <Input id="phone" placeholder="cth. 012-3456789" {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <Button
        type="submit"
        disabled={update.isPending || !isDirty}
        className="rounded-full bg-primary px-6 font-bold uppercase tracking-wide hover:bg-primary/90"
      >
        {update.isPending ? "Menyimpan…" : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
