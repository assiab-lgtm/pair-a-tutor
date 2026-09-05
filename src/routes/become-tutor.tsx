import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileUp, GraduationCap, Mic, ShieldCheck, Square } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GRADES, SUBJECTS, splitPayment } from "@/lib/studypair";
import { useApplication } from "@/lib/store";

export const Route = createFileRoute("/become-tutor")({
  head: () => ({
    meta: [
      { title: "Devenir tuteur — lycéens, étudiants et diplômés | StudyPair" },
      {
        name: "description",
        content:
          "Mention Bien ou Très Bien au Brevet et d'excellents résultats dans votre matière ? Candidatez sur StudyPair : identité vérifiée, relevé de notes, test audio de 2 minutes, et 80 % du tarif reversé.",
      },
      { property: "og:title", content: "Devenir tuteur — StudyPair" },
      {
        property: "og:description",
        content:
          "Ouvert aux lycéens, étudiants du supérieur et diplômés. Vérification d'identité et 80 % du tarif pour vous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BecomeTutor,
});

const MAX_SECONDS = 120;
const MIN_SECONDS = 20;

const PROFILES = [
  { id: "lycee", label: "Lycéen(ne)" },
  { id: "superieur", label: "Étudiant(e) du supérieur" },
  { id: "diplome", label: "Diplômé(e)" },
] as const;

const MENTIONS = [
  { id: "bien", label: "Mention Bien au Brevet" },
  { id: "tres-bien", label: "Mention Très Bien au Brevet" },
] as const;

function BecomeTutor() {
  const navigate = useNavigate();
  const [, setApplication] = useApplication();
  const [profile, setProfile] = useState<string>("lycee");
  const [mention, setMention] = useState<string>("tres-bien");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [idFile, setIdFile] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
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
    if (subjects.length === 0) {
      toast.error("Sélectionnez au moins une matière enseignée.");
      return;
    }
    if (grades.length === 0) {
      toast.error("Sélectionnez au moins un niveau d'élève.");
      return;
    }
    if (!idFile) {
      toast.error("La pièce d'identité (CNI ou passeport) est obligatoire.");
      return;
    }
    if (!transcript) {
      toast.error("Ajoutez votre relevé de notes ou votre diplôme.");
      return;
    }
    if (!recorded || seconds < MIN_SECONDS) {
      toast.error("Enregistrez votre présentation audio (20 secondes minimum, 2 minutes max).");
      return;
    }
    setApplication({ submittedAt: new Date().toISOString(), subjects });
    toast.success("Candidature envoyée !", {
      description: "Vérification sous 24 h. Renseignez vos coordonnées bancaires en attendant.",
    });
    navigate({ to: "/tutor/payouts" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 py-12 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Devenir tuteur</h1>
            <p className="mt-2 text-muted-foreground">
              Ouvert aux lycéens, étudiants du supérieur et diplômés. Votre profil reste anonyme :
              prénom + initiale du nom.
            </p>
          </div>

          <Card className="border-accent/40 bg-accent/5">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <GraduationCap className="size-4 text-accent" /> Critères d'éligibilité
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>· Lycéen, étudiant du supérieur ou diplômé.</li>
                <li>· Mention Bien ou Très Bien au Brevet des collèges.</li>
                <li>· Excellents résultats dans la ou les matières enseignées.</li>
                <li>· Pièce d'identité et justificatif académique vérifiés par notre équipe.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="font-semibold">1. Informations personnelles</h2>
              </div>
              <div>
                <Label htmlFor="first">Prénom</Label>
                <Input id="first" required maxLength={50} placeholder="Léa" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="initial">Initiale du nom</Label>
                <Input id="initial" required maxLength={1} placeholder="M" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  placeholder="vous@exemple.fr"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="birth">Date de naissance</Label>
                <Input id="birth" type="date" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="profile">Votre situation</Label>
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger id="profile" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILES.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mention">Résultat au Brevet</Label>
                <Select value={mention} onValueChange={setMention}>
                  <SelectTrigger id="mention" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MENTIONS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="level">Niveau d'études actuel / diplôme</Label>
                <Input
                  id="level"
                  required
                  maxLength={100}
                  placeholder="Terminale · Spé Maths — ou L2 Physique, Master…"
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bio">Votre approche (2 phrases)</Label>
                <Textarea
                  id="bio"
                  className="mt-1.5"
                  rows={3}
                  maxLength={400}
                  placeholder="J'explique pas à pas…"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold">Matières et niveaux</h2>
              <Label className="mt-4 block">Matières enseignées</Label>
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
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">2. Vérification d'identité</h2>
                <Badge variant="secondary">Obligatoire</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Carte nationale d'identité ou passeport, recto-verso lisible. Document confidentiel,
                supprimé après vérification.
              </p>
              <label
                htmlFor="idfile"
                className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm transition-colors hover:bg-secondary"
              >
                {idFile ? (
                  <CheckCircle2 className="size-5 text-accent" />
                ) : (
                  <FileUp className="size-5 text-muted-foreground" />
                )}
                <span>{idFile ?? "Téléverser ma CNI ou mon passeport"}</span>
              </label>
              <input
                id="idfile"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setIdFile(e.target.files?.[0]?.name ?? null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">3. Justificatifs académiques</h2>
                <Badge variant="secondary">Obligatoire</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Relevé de notes du Brevet (mention Bien ou Très Bien), bulletins récents ou diplôme
                dans vos matières.
              </p>
              <label
                htmlFor="transcript"
                className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm transition-colors hover:bg-secondary"
              >
                {transcript ? (
                  <CheckCircle2 className="size-5 text-accent" />
                ) : (
                  <FileUp className="size-5 text-muted-foreground" />
                )}
                <span>{transcript ?? "Téléverser mon relevé de notes ou diplôme"}</span>
              </label>
              <input
                id="transcript"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setTranscript(e.target.files?.[0]?.name ?? null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">4. Test audio de 2 minutes</h2>
                <Badge variant="secondary">Obligatoire</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Présentez votre pédagogie : comment expliquez-vous une notion difficile ? Cet extrait
                est diffusé sur votre profil (20 s minimum, 2 min maximum).
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
                  <CheckCircle2 className="size-4" /> Enregistrement prêt
                  {seconds < MIN_SECONDS ? " — trop court, refaites un essai." : " à être joint au profil."}
                </p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Envoyer ma candidature
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-accent" /> Vérification humaine sous 24 h avant mise
            en ligne du profil.
          </p>
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
            <p className="mt-4 text-xs text-muted-foreground">
              80 % du tarif vous revient, versés automatiquement après chaque séance.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
