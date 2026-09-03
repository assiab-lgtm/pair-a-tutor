import { Link } from "@tanstack/react-router";
import { AudioLines, BadgeCheck, Star, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { gradeLabel, isFlagged, tutorName, type Tutor } from "@/lib/studypair";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      <Star className="size-4 fill-warning text-warning" />
      {rating.toFixed(1)}
    </span>
  );
}

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const flagged = isFlagged(tutor);
  return (
    <Card className={`card-lift overflow-hidden ${flagged ? "opacity-80" : ""}`}>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground">
            {tutor.firstName[0]}
            {tutor.lastInitial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold">{tutorName(tutor)}</h3>
              {tutor.verified && <BadgeCheck className="size-4 text-accent" />}
            </div>
            <p className="truncate text-sm text-muted-foreground">{tutor.level}</p>
          </div>
          <div className="ml-auto text-right">
            <Stars rating={tutor.rating} />
            <p className="text-xs text-muted-foreground">{tutor.reviews} avis</p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{tutor.bio}</p>

        <div className="flex flex-wrap gap-1.5">
          {tutor.subjects.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
          {tutor.hasAudioIntro && (
            <Badge variant="outline" className="gap-1 text-accent">
              <AudioLines className="size-3" /> Audio
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Niveaux : {tutor.grades.map(gradeLabel).join(" · ")}
        </p>

        {flagged && (
          <p className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
            <TriangleAlert className="size-3.5" /> Qualité signalée (moins de 3,5 ★)
          </p>
        )}

        <Button asChild className="mt-auto w-full">
          <Link to="/tutors/$tutorId" params={{ tutorId: tutor.id }}>
            Voir le profil
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
