"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Bagaimana cara membuat tempahan?",
    a: "Pilih kemudahan yang anda mahu, pilih tarikh dan slot masa yang kosong, isi butiran hubungan, dan selesaikan pembayaran. Anda akan menerima kod tempahan sebagai pengesahan.",
  },
  {
    q: "Adakah tempahan boleh bertindih dengan pengguna lain?",
    a: "Tidak. Sistem kami menggunakan kunci pangkalan data masa nyata — jika dua orang cuba menempah slot yang sama serentak, hanya seorang akan berjaya dan seorang lagi akan menerima notifikasi serta-merta.",
  },
  {
    q: "Berapa lama slot dikunci sebelum pembayaran?",
    a: "Slot yang anda pilih dikunci selama 10 minit untuk anda selesaikan pembayaran. Jika tidak selesai dalam masa tersebut, slot akan dibuka semula secara automatik.",
  },
  {
    q: "Bagaimana jika saya perlu membatalkan tempahan?",
    a: "Sila hubungi pentadbir PPUWTR atau semak status tempahan anda menggunakan kod tempahan di halaman 'Semak Tempahan'.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-center font-heading text-3xl font-bold">Soalan Lazim</h2>
      <div className="mt-8 space-y-3">
        {FAQS.map((item, i) => (
          <div key={item.q} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              className="flex w-full items-center justify-between gap-4 p-4 text-left font-medium"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.q}
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform", openIndex === i && "rotate-180")}
              />
            </button>
            {openIndex === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
