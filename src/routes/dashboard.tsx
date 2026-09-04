import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarX2, MessageSquareWarning, Star, Video } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { splitPayment } from "@/lib/studypair";
import { useBookings } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mes séances — StudyPair" },
      {
        name: "description",
        content:
          "Retrouvez vos séances StudyPair à venir et passées, rejoignez la salle de classe virtuelle et notez vos tuteurs.",
      },
      { property: "og:title", content: "Mes séances — StudyPair" },
      { property: "og:description", content: "Vos réservations, vos visios et vos évaluations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { bookings, removeBooking } = useBookings();
  const navigate = useNavigate();
  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status === "done");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Mes séances</h1>

        {bookings.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-secondary">
                <CalendarX2 className="size-6 text-muted-foreground" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Aucune séance prévue pour le moment</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choisissez un tuteur et un créneau : votre séance apparaîtra ici.
                </p>
              </div>
              <Button asChild size="lg">
                <Link to="/tutors">Chercher un tuteur</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <h2 className="mt-8 text-lg font-semibold">À venir ({upcoming.length})</h2>
            {upcoming.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Aucune séance à venir.{" "}
                <Link to="/tutors" className="underline">
                  Réserver une séance
                </Link>
              </p>
            )}
            <div className="mt-3 space-y-3">
              {upcoming.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex flex-wrap items-center gap-4 p-5">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {b.subject} avec {b.tutorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {b.slot} · {b.grade} · {b.price.toFixed(2)} € (dont{" "}
                        {splitPayment(b.price).tutor.toFixed(2)} € pour le tuteur)
                      </p>
                    </div>
                    <div className="ml-auto flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success("Litige transmis au support (réponse sous 24 h).")}
                      >
                        <MessageSquareWarning className="size-4" /> Litige
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeBooking(b.id);
                          toast.success("Séance annulée et remboursée.");
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate({ to: "/session/$sessionId", params: { sessionId: b.id } })}
                      >
                        <Video className="size-4" /> Rejoindre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {past.length > 0 && (
              <>
                <h2 className="mt-10 text-lg font-semibold">Terminées ({past.length})</h2>
                <div className="mt-3 space-y-3">
                  {past.map((b) => (
                    <Card key={b.id}>
                      <CardContent className="flex flex-wrap items-center gap-4 p-5">
                        <div>
                          <p className="font-semibold">
                            {b.subject} avec {b.tutorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {b.slot} · {b.price.toFixed(2)} €
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          {b.rating ? (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="size-3 fill-warning text-warning" /> {b.rating}/5
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate({ to: "/session/$sessionId", params: { sessionId: b.id } })
                              }
                            >
                              Noter la séance
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
