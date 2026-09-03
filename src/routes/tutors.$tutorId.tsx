import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { AudioLines, BadgeCheck, Clock, ShieldCheck, Star, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Stars } from "@/components/tutor-card";
import {
  gradeLabel,
  GRADES,
  isFlagged,
  priceFor,
  splitPayment,
  TUTORS,
  tutorName,
  type Grade,
} from "@/lib/studypair";

export const Route = createFileRoute("/tutors/$tutorId")({
  loader: ({ params }) => {
    const tutor = TUTORS.find((t) => t.id === params.tutorId);
    if (!tutor) throw notFound();
    return { tutor };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Profil indisponible — StudyPair" }, { name: "robots", content: "noindex" }] };
    }
    const name = tutorName(loaderData.tutor);
    const desc = `${name} · ${loaderData.tutor.level} · ${loaderData.tutor.subjects.join(", ")} — réservez une séance dès 10 €/h sur StudyPair.`;
    return {
      meta: [
        { title: `${name}, tuteur ${loaderData.tutor.subjects[0]} — StudyPair` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — tuteur StudyPair` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TutorProfile,
});

const REVIEWS = [
  { author: "Parent de Jules (5ème)", rating: 5, text: "Très patient, mon fils a repris confiance en maths." },
  { author: "Parent de Manon (3ème)", rating: 5, text: "Séances bien structurées, progrès visibles avant le brevet." },
  { author: "Parent de Sacha (4ème)", rating: 4, text: "Bonne pédagogie, un peu court sur les exercices." },
];

function TutorProfile() {
  const { tutor } = Route.useLoaderData();
  const navigate = useNavigate();
  const [grade, setGrade] = useState<Grade>(tutor.grades[0]!);
  const [slot, setSlot] = useState<string | null>(null);

  const price = priceFor(grade);
  const split = splitPayment(price);
  const flagged = isFlagged(tutor);

  function book() {
    if (!slot) {
      toast.error("Choisissez d'abord un créneau.");
      return;
    }
    toast.success(`Séance réservée — ${slot} · ${price} €`, {
      description: "Paiement autorisé. Le tuteur reçoit 80 % après la séance.",
    });
    navigate({ to: "/session/$sessionId", params: { sessionId: tutor.id } });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-start gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-secondary font-display text-2xl font-bold text-secondary-foreground">
              {tutor.firstName[0]}
              {tutor.lastInitial}
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                {tutorName(tutor)}
                {tutor.verified && <BadgeCheck className="size-5 text-accent" />}
              </h1>
              <p className="text-muted-foreground">{tutor.level}</p>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <Stars rating={tutor.rating} />
                <span>{tutor.reviews} avis</span>
                <span>· {tutor.sessions} séances</span>
              </div>
            </div>
          </div>

          {flagged && (
            <p className="mt-5 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <TriangleAlert className="size-4" /> Profil signalé : note moyenne inférieure à 3,5 ★.
              Il est dépriorisé dans les résultats de recherche.
            </p>
          )}

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="font-semibold">Approche pédagogique</h2>
              <p className="mt-2 text-sm text-muted-foreground">{tutor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tutor.subjects.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
                {tutor.grades.map((g) => (
                  <Badge key={g} variant="outline">
                    {gradeLabel(g)}
                  </Badge>
                ))}
              </div>
              {tutor.hasAudioIntro && (
                <div className="mt-5 flex items-center gap-3 rounded-lg bg-accent/10 p-3">
                  <span className="grid size-9 place-items-center rounded-full bg-accent/20 text-accent">
                    <AudioLines className="size-4" />
                  </span>
                  <div className="text-sm">
                    <p className="font-medium">Présentation audio (1 min 48)</p>
                    <p className="text-muted-foreground">Écoutez la méthode du tuteur avant de réserver.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => toast("Lecture de la présentation audio…")}
                  >
                    Écouter
                  </Button>
                </div>
              )}
              <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-accent" /> Relevé du Brevet vérifié — mention Très Bien.
              </p>
            </CardContent>
          </Card>

          <h2 className="mt-10 text-xl font-bold">Avis récents</h2>
          <div className="mt-4 space-y-3">
            {REVIEWS.map((r) => (
              <Card key={r.author}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                        />
                      ))}
                    </span>
                    <span className="text-sm font-medium">{r.author}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold">Réserver une séance</h2>

            <label className="mt-4 block text-sm font-medium">Classe de l'élève</label>
            <Select value={grade} onValueChange={(v) => setGrade(v as Grade)}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRADES.filter((g) => tutor.grades.includes(g.id)).map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label} — {g.price} €/h
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="mt-5 text-sm font-medium">Créneaux disponibles</p>
            <div className="mt-2 space-y-3">
              {tutor.slots.map((d) => (
                <div key={d.day}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{d.day}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {d.times.map((t) => {
                      const id = `${d.day} ${t}`;
                      return (
                        <Button
                          key={id}
                          size="sm"
                          variant={slot === id ? "default" : "outline"}
                          onClick={() => setSlot(id)}
                        >
                          <Clock className="size-3.5" /> {t}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-secondary p-4 text-sm">
              <div className="flex justify-between">
                <span>Séance 1 h ({gradeLabel(grade)})</span>
                <span className="font-semibold">{price.toFixed(2)} €</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>Reversé au tuteur (80 %)</span>
                <span>{split.tutor.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Commission StudyPair (20 %)</span>
                <span>{split.platform.toFixed(2)} €</span>
              </div>
            </div>

            <Button className="mt-4 w-full" size="lg" onClick={book}>
              Réserver — {price.toFixed(2)} €
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Débit à la réservation, versement au tuteur après la séance.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
