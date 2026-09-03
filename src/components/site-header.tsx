import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { to: "/tutors", label: "Trouver un tuteur" },
  { to: "/how-it-works", label: "Comment ça marche" },
  { to: "/dashboard", label: "Mes séances" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4.5" />
          </span>
          StudyPair
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/become-tutor">Devenir tuteur</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/tutors">Réserver</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} StudyPair — mise en relation lycéens / collégiens.</p>
        <div className="flex gap-4">
          <Link to="/how-it-works" className="hover:text-foreground">
            Tarifs & commission
          </Link>
          <Link to="/become-tutor" className="hover:text-foreground">
            Devenir tuteur
          </Link>
        </div>
      </div>
    </footer>
  );
}
