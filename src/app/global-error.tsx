"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ms">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold">PPUWTR Arena tidak dapat dimuatkan.</h1>
          <p className="max-w-md text-gray-500">Berlaku ralat kritikal. Sila muat semula halaman.</p>
          <button
            onClick={reset}
            className="rounded-lg bg-[#0D3C8C] px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Muat Semula
          </button>
        </div>
      </body>
    </html>
  );
}
