import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileUp, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GRADES, SUBJECTS, splitPayment } from "@/lib/studypair";

export const Route = createFileRoute("/become-tutor")({
  head: () => ({
    meta: [
      { title: "Devenir tuteur lycéen — StudyPair" },
      {
        name: "description",
        content:
          "Lycéen avec mention Très Bien au Brevet ? Créez votre profil StudyPair, choisissez vos matières et gagnez 80 % du tarif de chaque séance.",
      },
      { property: "og:title", content: "Devenir tuteur lycéen — StudyPair" },
      {
        property: "og:description",
        content: "Inscription en 2 minutes : matières, créneaux, vérification du relevé du Brevet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BecomeTutor,
});

const MAX_SECONDS = 120;

function BecomeTutor() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!recording) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_SECONDS) {
          setRecording(false);
          setRecorded(true);
          return MAX_SECONDS;
        }
        return s + 1;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [recording]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName) {
      toast.error("Ajoutez votre relevé de notes du Brevet pour la vérification.");
      return;
    }
    if (subjects.length === 0) {
      toast.error("Sélectionnez au moins une matière.");
      return;
    }
    toast.success("Candidature envoyée !", {
      description: "Vérification du relevé sous 24 h, puis mise en ligne de votre profil.",
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 py-12 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Devenir tuteur</h1>
            <p className="mt-2 text-muted-foreground">
              Inscription en 2 minutes. Votre profil reste anonyme : prénom + initiale du nom.
            </p>
          </div>

          <Card>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="first">Prénom</Label>
                <Input id="first" required placeholder="Léa" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="initial">Initiale du nom</Label>
                <Input id="initial" required maxLength={1} placeholder="M" className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="level">Classe actuelle</Label>
                <Input id="level" required placeholder="Terminale · Spé Maths" className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bio">Votre approche (2 phrases)</Label>
                <Textarea id="bio" className="mt-1.5" rows={3} placeholder="J'explique pas à pas…" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Label>Matières enseignées</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={subjects.includes(s) ? "default" : "outline"}
                    onClick={() => toggle(subjects, setSubjects, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
              <Label className="mt-6 block">Niveaux acceptés</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {GRADES.map((g) => (
                  <Button
                    key={g.id}
                    type="button"
                    size="sm"
                    variant={grades.includes(g.id) ? "default" : "outline"}
                    onClick={() => toggle(grades, setGrades, g.id)}
                  >
                    {g.label} · {g.price} €/h
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Label htmlFor="brevet">Relevé de notes du Brevet (mention Très Bien)</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF ou photo. Document confidentiel, utilisé uniquement pour la vérification.
              </p>
              <label
                htmlFor="brevet"
                className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm transition-colors hover:bg-secondary"
              >
                {fileName ? (
                  <CheckCircle2 className="size-5 text-accent" />
                ) : (
                  <FileUp className="size-5 text-muted-foreground" />
                )}
                <span>{fileName ?? "Cliquez pour téléverser votre relevé"}</span>
              </label>
              <input
                id="brevet"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Label>Test audio rapide</Label>
                <Badge variant="outline">Optionnel</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                2 minutes maximum pour présenter votre approche. Les profils avec audio reçoivent
                plus de réservations.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Button
                  type="button"
                  variant={recording ? "destructive" : "outline"}
                  onClick={() => {
                    if (recording) {
                      setRecording(false);
                      setRecorded(true);
                    } else {
                      setSeconds(0);
                      setRecorded(false);
                      setRecording(true);
                    }
                  }}
                >
                  {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
                  {recording ? "Arrêter" : recorded ? "Réenregistrer" : "Enregistrer"}
                </Button>
                <div className="flex-1">
                  <Progress value={(seconds / MAX_SECONDS) * 100} />
                </div>
                <span className="w-14 text-right font-mono text-sm tabular-nums">
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </span>
              </div>
              {recorded && (
                <p className="mt-3 flex items-center gap-2 text-sm text-accent">
                  <CheckCircle2 className="size-4" /> Enregistrement prêt à être joint au profil.
                </p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Envoyer ma candidature
          </Button>
        </form>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold">Ce que vous gagnez</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {GRADES.map((g) => (
                <li key={g.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">Séance {g.label}</span>
                  <span className="font-display font-bold text-accent">
                    {splitPayment(g.price).tutor.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
              80 % du tarif vous revient, versé automatiquement après chaque séance terminée. 20 %
              couvrent la plateforme, le paiement et le support.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
