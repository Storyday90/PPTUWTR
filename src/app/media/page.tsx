import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MediaGallery } from "@/components/media/media-gallery";

export const metadata: Metadata = {
  title: "Media — PPUWTR Arena",
  description:
    "Galeri fasiliti, peserta dan aktiviti di Dewan Dato' Haji Samsudin bin Haji Abu Hassan, PPUWTR.",
};

export default function MediaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow text-foreground/50">Galeri</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">
            Media &amp; <span className="accent-lime">momen</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Lihat fasiliti yang ada dalam dewan, gambar peserta beraksi, dan momen aktiviti komuniti PPUWTR —
            semuanya di satu galeri.
          </p>

          <div className="mt-10">
            <MediaGallery />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
