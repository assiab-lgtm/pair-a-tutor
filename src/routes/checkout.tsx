import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { gradeLabel, priceFor, splitPayment, TUTORS, tutorName, type Grade } from "@/lib/studypair";
import { useAccount, useBookings } from "@/lib/store";

type Search = { tutorId: string; grade: Grade; slot: string; subject?: string | undefined };

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    tutorId: String(search['tutorId'] ?? ""),
    grade: (String(search['grade'] ?? "6eme") as Grade),
    slot: String(search['slot'] ?? ""),
    subject: search['subject'] ? String(search['subject']) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Confirmer et payer ma séance — StudyPair" },
      {
        name: "description",
        content:
          "Vérifiez le créneau, le tarif et la répartition 80/20, puis confirmez le paiement sécurisé de votre séance StudyPair.",
      },
      { property: "og:title", content: "Confirmer et payer ma séance — StudyPair" },
      { property: "og:description", content: "Paiement sécurisé, versement au tuteur après la séance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { tutorId, grade, slot, subject } = Route.useSearch();
  const tutor = TUTORS.find((t) => t.id === tutorId);
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { account } = useAccount();
  const [paying, setPaying] = useState(false);

  if (!tutor || !slot) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Réservation incomplète</h1>
          <p className="mt-2 text-muted-foreground">
            Choisissez un tuteur et un créneau pour continuer.
          </p>
          <Button asChild className="mt-6">
            <Link to="/tutors">Trouver un tuteur</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const price = priceFor(grade);
  const split = splitPayment(price);

  function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!account) {
      toast.error("Connectez-vous pour finaliser la réservation.");
      navigate({ to: "/auth" });
      return;
    }
    setPaying(true);
    const booking = addBooking({
      tutorId: tutor!.id,
      tutorName: tutorName(tutor!),
      subject: subject ?? tutor!.subjects[0]!,
      grade: gradeLabel(grade),
      slot,
      price,
    });
    setTimeout(() => {
      toast.success("Paiement confirmé — séance réservée !", {
        description: "Retrouvez-la dans « Mes séances ». Le tuteur reçoit 80 % après le cours.",
      });
      navigate({ to: "/dashboard", search: { booked: booking.id } as never });
    }, 700);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-4xl flex-1 gap-8 px-4 py-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="text-3xl font-bold">Confirmer et payer</h1>
          <p className="mt-2 text-muted-foreground">
            Débit à la réservation, versement au tuteur une fois la séance terminée.
          </p>

          {!account && (
            <p className="mt-5 rounded-lg bg-secondary p-4 text-sm">
              Vous n'êtes pas connecté.{" "}
              <Link to="/auth" className="font-medium underline">
                Créer un compte ou se connecter
              </Link>{" "}
              pour finaliser.
            </p>
          )}

          <Card className="mt-6">
            <CardContent className="p-5">
              <form onSubmit={pay} className="space-y-4">
                <div>
                  <Label htmlFor="card">Numéro de carte</Label>
                  <Input
                    id="card"
                    required
                    inputMode="numeric"
                    maxLength={19}
                    className="mt-1.5 font-mono"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exp">Expiration</Label>
                    <Input id="exp" required maxLength={5} className="mt-1.5 font-mono" placeholder="12/28" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" required maxLength={4} className="mt-1.5 font-mono" placeholder="123" />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={paying}>
                  <CreditCard className="size-4" />
                  {paying ? "Paiement en cours…" : `Payer ${price.toFixed(2)} €`}
                </Button>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5" /> Paiement sécurisé. Annulation gratuite jusqu'à 12 h
                  avant la séance.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-5 text-sm">
            <h2 className="text-lg font-semibold">Récapitulatif</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tuteur</span>
                <span className="font-medium">{tutorName(tutor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Matière</span>
                <span className="font-medium">{subject ?? tutor.subjects[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Créneau</span>
                <span className="font-medium">{slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-medium">{gradeLabel(grade)}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total (1 h)</span>
                <span>{price.toFixed(2)} €</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>Tuteur (80 %)</span>
                <span>{split.tutor.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>StudyPair (20 %)</span>
                <span>{split.platform.toFixed(2)} €</span>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-accent">
              <CheckCircle2 className="size-4" /> Tuteur vérifié (identité + relevé de notes).
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
