import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useAccount } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres — StudyPair" },
      {
        name: "description",
        content:
          "Gérez votre compte StudyPair, l'apparence claire ou sombre et vos préférences de notifications.",
      },
      { property: "og:title", content: "Paramètres — StudyPair" },
      { property: "og:description", content: "Thème, compte et préférences StudyPair." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { account, signOut } = useAccount();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [emails, setEmails] = useState(true);

  useEffect(() => {
    setDark(localStorage.getItem("studypair-theme") === "dark");
  }, []);

  function toggleTheme(next: boolean) {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("studypair-theme", next ? "dark" : "light");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Paramètres</h1>

        <Card className="mt-6">
          <CardContent className="p-5">
            <h2 className="font-semibold">Apparence</h2>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-secondary">
                  {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </span>
                <div>
                  <Label htmlFor="dark">Mode sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Idéal pour les séances du soir.
                  </p>
                </div>
              </div>
              <Switch id="dark" checked={dark} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="p-5">
            <h2 className="font-semibold">Notifications</h2>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="emails">Rappels de séance par email</Label>
                <p className="text-sm text-muted-foreground">Un rappel 1 h avant chaque cours.</p>
              </div>
              <Switch id="emails" checked={emails} onCheckedChange={setEmails} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="p-5">
            <h2 className="font-semibold">Compte</h2>
            {account ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="font-medium">{account.name}</p>
                  <p className="text-muted-foreground">
                    {account.email} · {account.role === "tutor" ? "Tuteur" : "Élève / Parent"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut();
                    toast.success("Vous êtes déconnecté.");
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="size-4" /> Se déconnecter
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Vous n'êtes pas connecté.</p>
                <Button asChild>
                  <Link to="/auth">Se connecter</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
