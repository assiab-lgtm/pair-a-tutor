import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MonitorUp, PhoneOff, Send, Star, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { filterMessage } from "@/lib/studypair";
import { getBooking, useBookings, type Booking } from "@/lib/store";

export const Route = createFileRoute("/session/$sessionId")({
  head: () => ({
    meta: [
      { title: "Salle de classe virtuelle — StudyPair" },
      {
        name: "description",
        content:
          "Visio, chat filtré, partage d'écran et minuteur : votre séance StudyPair d'une heure se déroule ici.",
      },
      { property: "og:title", content: "Salle de classe virtuelle — StudyPair" },
      { property: "og:description", content: "Cours en visio d'une heure avec évaluation à la fin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SessionRoom,
});

type Msg = { id: number; from: "me" | "tutor"; text: string };

function SessionRoom() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBookings();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "tutor", text: "Bonjour ! On commence par revoir l'exercice 3 ?" },
  ]);
  const [draft, setDraft] = useState("");
  const [ended, setEnded] = useState(false);
  const [rating, setRating] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBooking(getBooking(sessionId));
    setLoaded(true);
  }, [sessionId]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim().slice(0, 500);
    if (!text) return;
    const { masked, blocked } = filterMessage(text);
    if (blocked) toast.warning("Coordonnées masquées : les échanges restent sur StudyPair.");
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: masked }]);
    setDraft("");
  }

  function endSession() {
    setRunning(false);
    setEnded(true);
  }

  function submitRating() {
    if (rating === 0) {
      toast.error("Choisissez une note de 1 à 5 étoiles.");
      return;
    }
    if (booking) updateBooking(booking.id, { status: "done", rating });
    toast.success("Merci pour votre évaluation !");
    navigate({ to: "/dashboard" });
  }

  if (loaded && !booking) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Cette séance n'existe pas</h1>
          <p className="mt-2 text-muted-foreground">
            Elle a peut-être été annulée. Retrouvez vos séances ou réservez un nouveau créneau.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard">Mes séances</Link>
            </Button>
            <Button asChild>
              <Link to="/tutors">Trouver un tuteur</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">
              {booking ? `${booking.subject} avec ${booking.tutorName}` : "Séance en cours"}
            </h1>
            <span className="rounded-full bg-secondary px-3 py-1 font-mono text-sm tabular-nums">
              {mm}:{ss} / 60:00
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-black">
            <iframe
              title="Salle de classe virtuelle StudyPair"
              src={`https://meet.jit.si/studypair-${sessionId}#config.prejoinPageEnabled=false`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="aspect-video w-full"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setRunning((r) => !r)}>
              <Video className="size-4" /> {running ? "Mettre en pause" : "Reprendre"}
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Partage d'écran activé dans la fenêtre visio.")}
            >
              <MonitorUp className="size-4" /> Partager l'écran
            </Button>
            <Button variant="destructive" className="ml-auto" onClick={endSession}>
              <PhoneOff className="size-4" /> Terminer la séance
            </Button>
          </div>
        </div>

        <Card className="flex h-[32rem] flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col p-4">
            <h2 className="font-semibold">Chat de séance</h2>
            <p className="text-xs text-muted-foreground">
              Numéros, emails et liens sont masqués automatiquement.
            </p>
            <div ref={listRef} className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.from === "me"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={send} className="mt-3 flex gap-2">
              <Input
                value={draft}
                maxLength={500}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Écrire un message…"
              />
              <Button type="submit" size="icon" aria-label="Envoyer">
                <Send className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Dialog open={ended} onOpenChange={setEnded}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment s'est passée la séance ?</DialogTitle>
            <DialogDescription>
              Votre note aide la communauté : sous 3,5 ★ de moyenne, un tuteur est dépriorisé.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
              >
                <Star
                  className={`size-8 transition-transform hover:scale-110 ${
                    n <= rating ? "fill-warning text-warning" : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <Button size="lg" onClick={submitRating}>
            Envoyer mon évaluation
          </Button>
        </DialogContent>
      </Dialog>
      <SiteFooter />
    </div>
  );
}
