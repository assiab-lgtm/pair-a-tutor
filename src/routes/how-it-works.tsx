import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GRADES, splitPayment } from "@/lib/studypair";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "Comment ça marche & tarifs — StudyPair" },
      {
        name: "description",
        content:
          "Tarifs par niveau de 10 à 16 €/h, répartition 80/20 automatique, vérification des tuteurs et classe virtuelle sans caméra.",
      },
      { property: "og:title", content: "Comment ça marche & tarifs — StudyPair" },
      {
        property: "og:description",
        content: "Réservation, paiement partagé 80/20 et classe virtuelle : le fonctionnement de StudyPair.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  ["1. Choisissez", "Filtrez par matière et niveau, comparez notes et avis."],
  ["2. Réservez", "Sélectionnez un créneau libre, payez de façon sécurisée."],
  ["3. Apprenez", "Classe virtuelle audio + tableau blanc, caméra facultative."],
  ["4. Notez", "Une note de 1 à 5 ★ à la fin de chaque séance."],
];

function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-14">
        <h1 className="text-4xl font-bold">Comment ça marche</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          StudyPair est une pure plateforme de mise en relation : nous facilitons le matching, le
          paiement et la qualité. Le reste se passe entre le tuteur et l'élève.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text]) => (
            <Card key={title} className="card-lift">
              <CardContent className="p-5">
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-bold">Tarifs et répartition</h2>
        <Card className="mt-5">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Niveau</th>
                  <th className="p-4 font-medium">Tarif horaire</th>
                  <th className="p-4 font-medium">Tuteur (80 %)</th>
                  <th className="p-4 font-medium">StudyPair (20 %)</th>
                </tr>
              </thead>
              <tbody>
                {GRADES.map((g) => {
                  const s = splitPayment(g.price);
                  return (
                    <tr key={g.id} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium">{g.label}</td>
                      <td className="p-4">{g.price.toFixed(2)} €</td>
                      <td className="p-4 font-semibold text-accent">{s.tutor.toFixed(2)} €</td>
                      <td className="p-4 text-muted-foreground">{s.platform.toFixed(2)} €</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p className="mt-4 text-sm text-muted-foreground">
          Le versement au tuteur est libéré automatiquement une fois la séance marquée comme
          terminée. En cas de séance non assurée, le bouton « Litige » suspend le versement.
        </p>

        <div className="mt-12 flex gap-3">
          <Button asChild size="lg">
            <Link to="/tutors">Trouver un tuteur</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/become-tutor">Devenir tuteur</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
