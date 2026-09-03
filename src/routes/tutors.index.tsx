import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { TutorCard } from "@/components/tutor-card";
import { GRADES, rankTutors, SUBJECTS, TUTORS, type Grade } from "@/lib/studypair";

export const Route = createFileRoute("/tutors/")({
  head: () => ({
    meta: [
      { title: "Trouver un tuteur lycéen — StudyPair" },
      {
        name: "description",
        content:
          "Parcourez les tuteurs lycéens vérifiés par matière et par niveau (6ème à 3ème) et réservez une séance en ligne en quelques clics.",
      },
      { property: "og:title", content: "Trouver un tuteur lycéen — StudyPair" },
      {
        property: "og:description",
        content: "Filtrez par matière et niveau, comparez les notes et réservez en 3 clics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TutorsPage,
});

function TutorsPage() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [grade, setGrade] = useState<Grade | "all">("all");

  const results = useMemo(() => {
    const filtered = TUTORS.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        t.firstName.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.bio.toLowerCase().includes(q);
      const matchS = subject === "all" || t.subjects.includes(subject);
      const matchG = grade === "all" || t.grades.includes(grade);
      return matchQ && matchS && matchG;
    });
    return rankTutors(filtered);
  }, [query, subject, grade]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Trouver un tuteur</h1>
        <p className="mt-2 text-muted-foreground">
          Profils anonymisés (prénom + initiale), tous vérifiés via le relevé du Brevet.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Matière, mot-clé…"
              className="pl-9"
            />
          </div>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="sm:w-52">
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={grade} onValueChange={(v) => setGrade(v as Grade | "all")}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              {GRADES.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.label} — {g.price} €/h
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Badge variant="secondary">{results.length} tuteur(s)</Badge>
          <span className="text-xs text-muted-foreground">
            Les profils sous 3,5 ★ sont dépriorisés automatiquement.
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
        {results.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            Aucun tuteur ne correspond à ces critères.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
