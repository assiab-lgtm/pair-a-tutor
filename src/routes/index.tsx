import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, MessageSquareLock, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { TutorCard } from "@/components/tutor-card";
import { GRADES, rankTutors, TUTORS } from "@/lib/studypair";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyPair — Cours particuliers entre lycéens et collégiens" },
      {
        name: "description",
        content:
          "StudyPair met en relation des lycéens vérifiés et des collégiens de la 6ème à la 3ème. Réservation en 3 clics, dès 10 €/h, paiement sécurisé.",
      },
      { property: "og:title", content: "StudyPair — Tutorat entre pairs, simple et abordable" },
      {
        property: "og:description",
        content: "Trouvez un tuteur lycéen vérifié pour votre collégien. Dès 10 €/h, réservation instantanée.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: ShieldCheck,
    title: "Tuteurs vérifiés",
    text: "Relevé du Brevet avec mention Très Bien contrôlé avant la mise en ligne du profil.",
  },
  {
    icon: CalendarCheck,
    title: "Réservation en 3 clics",
    text: "Créneaux en temps réel, confirmation instantanée, rappel avant la séance.",
  },
  {
    icon: MessageSquareLock,
    title: "Messagerie protégée",
    text: "Filtre anti-contournement : numéros et liens externes sont automatiquement masqués.",
  },
  {
    icon: Wallet,
    title: "Paiement partagé",
    text: "80 % pour le tuteur, versés automatiquement après la séance. 20 % de commission plateforme.",
  },
];

function Home() {
  const featured = rankTutors(TUTORS).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="surface-hero border-b border-border/70">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div>
              <Badge variant="outline" className="gap-1.5 border-accent/40 text-accent">
                <Sparkles className="size-3.5" /> Tutorat entre pairs
              </Badge>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">
                Le lycéen qui a réussi <span className="text-gradient-brand">explique le mieux.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                StudyPair connecte les collégiens de la 6ème à la 3ème avec des lycéens vérifiés
                (mention Très Bien au Brevet). Cours en ligne, sans caméra obligatoire, dès 10 €/h.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/tutors">Trouver un tuteur</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/become-tutor">Devenir tuteur</Link>
                </Button>
              </div>
              <dl className="mt-10 flex flex-wrap gap-8">
                {[
                  ["1 200+", "séances réalisées"],
                  ["4,8 ★", "note moyenne"],
                  ["3 min", "pour réserver"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-2xl font-bold">{v}</dt>
                    <dd className="text-sm text-muted-foreground">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Card className="self-center">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Tarif automatique par niveau</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pas de négociation : le prix dépend uniquement de la classe.
                </p>
                <ul className="mt-5 divide-y divide-border">
                  {GRADES.map((g) => (
                    <li key={g.id} className="flex items-center justify-between py-3">
                      <span className="font-medium">{g.label}</span>
                      <span className="font-display text-xl font-bold text-accent">{g.price} €/h</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                  Paiement sécurisé, libéré au tuteur (80 %) une fois la séance terminée.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold">Une plateforme volontairement minimale</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="card-lift">
                <CardContent className="p-5">
                  <span className="grid size-10 place-items-center rounded-lg bg-accent/15 text-accent">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/70 bg-secondary/40 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold">Tuteurs les mieux notés</h2>
              <Button asChild variant="ghost">
                <Link to="/tutors">Tout voir</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {featured.map((t) => (
                <TutorCard key={t.id} tutor={t} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
