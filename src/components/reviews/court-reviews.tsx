"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { ms } from "date-fns/locale";
import { toast } from "sonner";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useSession } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const px = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className="inline-flex" aria-label={`${value} daripada 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(px, i <= Math.round(value) ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30")}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function CourtReviews({ courtId }: { courtId: string }) {
  const { data, isLoading } = useReviews(courtId);
  const { data: session } = useSession();
  const create = useCreateReview();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  function submit() {
    if (rating < 1) {
      toast.error("Sila pilih penilaian bintang.");
      return;
    }
    create.mutate(
      { courtId, rating, comment: comment.trim() || undefined, authorName: session ? undefined : name.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Terima kasih atas ulasan anda!");
          setRating(0);
          setComment("");
          setName("");
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-foreground/50">Ulasan</p>
          <h2 className="display mt-1 text-3xl">Apa kata pemain</h2>
        </div>
        {data && data.summary.count > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-heading text-3xl font-extrabold">{data.summary.average.toFixed(1)}</span>
            <div>
              <Stars value={data.summary.average} />
              <p className="text-xs text-muted-foreground">{data.summary.count} ulasan</p>
            </div>
          </div>
        )}
      </div>

      {/* Submit form */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-bold">Beri penilaian anda</p>
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="cursor-pointer p-0.5"
              aria-label={`${i} bintang`}
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  i <= (hover || rating) ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30",
                )}
              />
            </button>
          ))}
        </div>
        {!session && (
          <div className="mt-3 space-y-1.5">
            <Label htmlFor="review-name">Nama anda</Label>
            <Input id="review-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Aiman" />
          </div>
        )}
        <div className="mt-3 space-y-1.5">
          <Label htmlFor="review-comment">Ulasan (pilihan)</Label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Kongsi pengalaman anda bermain di sini…"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <Button
          onClick={submit}
          disabled={create.isPending}
          className="mt-4 rounded-full bg-primary px-6 font-bold uppercase tracking-wide hover:bg-primary/90"
        >
          {create.isPending ? "Menghantar…" : "Hantar Ulasan"}
        </Button>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
        ) : data && data.reviews.length > 0 ? (
          data.reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{r.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(r.createdAt), "d MMM yyyy", { locale: ms })}
                </span>
              </div>
              <div className="mt-1">
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>}
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            Belum ada ulasan. Jadilah yang pertama!
          </p>
        )}
      </div>
    </section>
  );
}
