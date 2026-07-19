"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailsSchema, type ContactDetailsInput } from "@/lib/validation/booking.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: ContactDetailsInput) => void;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactDetailsInput>({
    resolver: zodResolver(contactDetailsSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="contactName">Nama Penuh</Label>
        <Input id="contactName" placeholder="Ahmad bin Ali" {...register("contactName")} />
        {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactPhone">Nombor Telefon</Label>
        <Input id="contactPhone" placeholder="012-3456789" {...register("contactPhone")} />
        {errors.contactPhone && <p className="text-xs text-destructive">{errors.contactPhone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactEmail">Emel</Label>
        <Input id="contactEmail" type="email" placeholder="nama@emel.com" {...register("contactEmail")} />
        {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purpose">Tujuan (pilihan)</Label>
        <Input id="purpose" placeholder="Cth: Latihan berpasukan" {...register("purpose")} />
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90">
        {submitting ? "Menempah…" : "Teruskan ke Pembayaran"}
      </Button>
    </form>
  );
}
