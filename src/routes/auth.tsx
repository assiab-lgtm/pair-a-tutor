import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useAccount, type Role } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion & inscription — StudyPair" },
      {
        name: "description",
        content:
          "Créez votre compte élève/parent ou tuteur StudyPair en quelques secondes et retrouvez vos séances.",
      },
      { property: "og:title", content: "Connexion & inscription — StudyPair" },
      {
        property: "og:description",
        content: "Accédez à vos séances, vos réservations et votre espace tuteur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn } = useAccount();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<"signin" | "signup">("signup");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const name = String(form.get("name") ?? "").trim() || email.split("@")[0]!;
    const password = String(form.get("password") ?? "");
    if (!email.includes("@") || password.length < 6) {
      toast.error("Email valide et mot de passe d'au moins 6 caractères requis.");
      return;
    }
    signIn(email, name, role);
    toast.success(mode === "signup" ? "Compte créé !" : "Content de vous revoir !");
    navigate({ to: role === "tutor" ? "/tutor/payouts" : "/dashboard" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-14">
        <h1 className="text-center text-3xl font-bold">Bienvenue sur StudyPair</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Un compte suffit pour réserver, discuter et rejoindre vos séances.
        </p>

        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Créer un compte</TabsTrigger>
            <TabsTrigger value="signin">Se connecter</TabsTrigger>
          </TabsList>

          {(["signup", "signin"] as const).map((m) => (
            <TabsContent key={m} value={m}>
              <Card className="mt-4">
                <CardContent className="p-5">
                  <Label>Je suis…</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={role === "student" ? "default" : "outline"}
                      onClick={() => setRole("student")}
                    >
                      <Users className="size-4" /> Élève / Parent
                    </Button>
                    <Button
                      type="button"
                      variant={role === "tutor" ? "default" : "outline"}
                      onClick={() => setRole("tutor")}
                    >
                      <GraduationCap className="size-4" /> Tuteur
                    </Button>
                  </div>

                  <form onSubmit={submit} className="mt-5 space-y-4">
                    {m === "signup" && (
                      <div>
                        <Label htmlFor={`${m}-name`}>Prénom</Label>
                        <Input id={`${m}-name`} name="name" className="mt-1.5" placeholder="Camille" />
                      </div>
                    )}
                    <div>
                      <Label htmlFor={`${m}-email`}>Email</Label>
                      <Input
                        id={`${m}-email`}
                        name="email"
                        type="email"
                        required
                        maxLength={255}
                        className="mt-1.5"
                        placeholder="vous@exemple.fr"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${m}-password`}>Mot de passe</Label>
                      <Input
                        id={`${m}-password`}
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="mt-1.5"
                        placeholder="6 caractères minimum"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      {m === "signup" ? "Créer mon compte" : "Se connecter"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}
