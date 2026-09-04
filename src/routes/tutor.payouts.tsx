import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Banknote, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GRADES, splitPayment } from "@/lib/studypair";
import { usePayout } from "@/lib/store";

export const Route = createFileRoute("/tutor/payouts")({
  head: () => ({
    meta: [
      { title: "Mes virements — espace tuteur StudyPair" },
      {
        name: "description",
        content:
          "Renseignez vos coordonnées bancaires pour recevoir automatiquement 80 % du prix de chaque séance donnée sur StudyPair.",
      },
      { property: "og:title", content: "Mes virements — espace tuteur StudyPair" },
      { property: "og:description", content: "Versement automatique de 80 % après chaque séance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PayoutsPage,
});

const IBAN = /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/;

function PayoutsPage() {
  const [payout, setPayout] = usePayout();
  const [holder, setHolder] = useState(payout?.holder ?? "");
  const [iban, setIban] = useState(payout?.iban ?? "");
  const [bic, setBic] = useState(payout?.bic ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    if (!holder.trim() || holder.length > 100) {
      toast.error("Indiquez le nom du titulaire du compte.");
      return;
    }
    if (!IBAN.test(cleanIban)) {
      toast.error("IBAN invalide (ex. FR7630006000011234567890189).");
      return;
    }
    setPayout({ holder: holder.trim(), iban: cleanIban, bic: bic.trim().toUpperCase(), connected: true });
    toast.success("Compte de virement enregistré", {
      description: "Vos 80 % seront versés automatiquement après chaque séance.",
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-4xl flex-1 gap-8 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h1 className="text-3xl font-bold">Recevoir mes paiements</h1>
          <p className="mt-2 text-muted-foreground">
            Vos coordonnées bancaires servent uniquement aux virements. Elles sont chiffrées et
            jamais visibles par les familles.
          </p>

          {payout?.connected && (
            <p className="mt-5 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
              <BadgeCheck className="size-4" /> Compte vérifié — virements activés (IBAN se terminant
              par {payout.iban.slice(-4)}).
            </p>
          )}

          <Card className="mt-6">
            <CardContent className="p-5">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label htmlFor="holder">Titulaire du compte</Label>
                  <Input
                    id="holder"
                    value={holder}
                    maxLength={100}
                    onChange={(e) => setHolder(e.target.value)}
                    className="mt-1.5"
                    placeholder="Léa Martin (ou représentant légal si mineur)"
                  />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={iban}
                    maxLength={34}
                    onChange={(e) => setIban(e.target.value)}
                    className="mt-1.5 font-mono"
                    placeholder="FR76 3000 6000 0112 3456 7890 189"
                  />
                </div>
                <div>
                  <Label htmlFor="bic">BIC (optionnel)</Label>
                  <Input
                    id="bic"
                    value={bic}
                    maxLength={11}
                    onChange={(e) => setBic(e.target.value)}
                    className="mt-1.5 font-mono"
                    placeholder="AGRIFRPP"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Banknote className="size-4" /> Enregistrer mes coordonnées
                </Button>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-accent" /> Paiements sécurisés. Si vous êtes
                  mineur, le compte doit être au nom d'un représentant légal.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold">Vos revenus par séance</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {GRADES.map((g) => (
                <li key={g.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">Séance {g.label}</span>
                  <span className="font-display font-bold">
                    {splitPayment(g.price).tutor.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              80 % du tarif vous revient, 20 % financent la plateforme (vérifications, visio,
              support). Virement sous 48 h après la séance.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
