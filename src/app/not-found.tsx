import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="font-heading text-6xl font-bold text-primary">404</p>
        <h1 className="font-heading text-xl font-bold">Halaman Tidak Dijumpai</h1>
        <p className="max-w-md text-muted-foreground">Halaman yang anda cari tidak wujud atau telah dipindahkan.</p>
        <Button render={<Link href="/" />} className="bg-primary hover:bg-primary/90">
          Kembali ke Laman Utama
        </Button>
      </main>
      <Footer />
    </>
  );
}
