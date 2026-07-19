"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Bagaimana cara membuat tempahan?",
    a: "Pilih kemudahan yang anda mahu, buka kalendar dan pilih slot masa yang kosong, isi butiran hubungan, dan selesaikan pembayaran. Anda akan menerima kod tempahan sebagai pengesahan.",
  },
  {
    q: "Apakah maksud slot berwarna merah pada kalendar?",
    a: "Slot merah bermaksud waktu tersebut telah penuh ditempah. Hanya slot kosong (bergaris hijau) boleh dipilih — status kalendar dikemas kini secara automatik setiap beberapa saat.",
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
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-center font-heading text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Soalan Lazim
      </p>
      <h2 className="mt-2 text-center font-heading text-4xl font-bold uppercase leading-none sm:text-5xl">
        Ada Pertanyaan?
      </h2>
      <div className="mt-10 space-y-3">
        {FAQS.map((item, i) => (
          <div key={item.q} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left font-semibold"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              {item.q}
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform", openIndex === i && "rotate-180")}
                aria-hidden
              />
            </button>
            {openIndex === i && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
