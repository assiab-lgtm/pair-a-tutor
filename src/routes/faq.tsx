import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — questions fréquentes sur StudyPair" },
      {
        name: "description",
        content:
          "Déroulé des cours, tarifs et modèle 80/20, vérification des tuteurs, sécurité des mineurs, paiements et litiges : toutes les réponses StudyPair.",
      },
      { property: "og:title", content: "FAQ — questions fréquentes sur StudyPair" },
      {
        property: "og:description",
        content: "Cours en visio, commission 20 %, vérifications d'identité et sécurité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

const SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Le déroulé des cours",
    items: [
      {
        q: "Comment se passe une séance ?",
        a: "Chaque séance dure 1 heure et se déroule en visio dans la salle de classe virtuelle StudyPair : caméra, micro, chat écrit, partage d'écran et minuteur intégré. Aucun logiciel à installer.",
      },
      {
        q: "Que se passe-t-il si l'élève ou le tuteur est en retard ?",
        a: "La salle reste ouverte pendant toute l'heure réservée. Au-delà de 15 minutes d'absence du tuteur, vous pouvez ouvrir un litige depuis « Mes séances » et le paiement est remboursé.",
      },
      {
        q: "Peut-on réserver plusieurs séances avec le même tuteur ?",
        a: "Oui, autant que vous le souhaitez. Retrouvez le profil du tuteur depuis « Mes séances » et choisissez un nouveau créneau en deux clics.",
      },
      {
        q: "Puis-je annuler une séance ?",
        a: "Une annulation jusqu'à 12 h avant le début est intégralement remboursée depuis la page « Mes séances ».",
      },
    ],
  },
  {
    title: "Tarifs et modèle 80/20",
    items: [
      {
        q: "Combien coûte une séance ?",
        a: "Le tarif dépend du niveau de l'élève : 10 € en 6ème, 12 € en 5ème, 14 € en 4ème et 16 € en 3ème, pour une heure de cours.",
      },
      {
        q: "Que signifie le modèle 80/20 ?",
        a: "Le tuteur reçoit 80 % du prix payé ; StudyPair conserve 20 % pour la mise en relation, la vérification des profils, la visio et le support. Aucun abonnement, aucun frais caché.",
      },
      {
        q: "Quand le tuteur est-il payé ?",
        a: "Le paiement est autorisé à la réservation puis versé automatiquement au tuteur après la séance, sur le compte bancaire qu'il a renseigné dans son espace de virements.",
      },
    ],
  },
  {
    title: "Sécurité et vérifications",
    items: [
      {
        q: "Qui sont les tuteurs ?",
        a: "Des lycéens, étudiants du supérieur et jeunes diplômés ayant obtenu une mention Bien ou Très Bien au Brevet et d'excellents résultats dans les matières qu'ils enseignent.",
      },
      {
        q: "Comment sont-ils vérifiés ?",
        a: "Chaque candidature exige une pièce d'identité (CNI ou passeport), un relevé de notes ou diplôme, et un enregistrement audio de 2 minutes présentant la pédagogie. Tout est contrôlé manuellement avant la mise en ligne du profil.",
      },
      {
        q: "Les profils sont-ils anonymes ?",
        a: "Oui : seuls le prénom et l'initiale du nom sont affichés. Les coordonnées personnelles ne sont jamais visibles.",
      },
      {
        q: "Pourquoi les messages sont-ils filtrés ?",
        a: "Numéros de téléphone, emails et liens externes sont masqués automatiquement pour protéger les mineurs et garantir que les séances restent encadrées par la plateforme.",
      },
      {
        q: "Que faire si une séance s'est mal passée ?",
        a: "Notez la séance de 1 à 5 étoiles et ouvrez un litige depuis « Mes séances ». Un tuteur dont la moyenne passe sous 3,5 ★ est dépriorisé, puis retiré des résultats.",
      },
    ],
  },
];

function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Foire aux questions</h1>
        <p className="mt-2 text-muted-foreground">
          Tout ce qu'il faut savoir avant de réserver ou de devenir tuteur.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-xl font-bold">{section.title}</h2>
            <Accordion type="single" collapsible className="mt-3">
              {section.items.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        <div className="mt-12 flex flex-wrap gap-3 rounded-xl bg-secondary p-6">
          <div className="mr-auto">
            <h2 className="font-semibold">Une autre question ?</h2>
            <p className="text-sm text-muted-foreground">
              Trouvez un tuteur ou découvrez le fonctionnement détaillé.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/how-it-works">Comment ça marche</Link>
          </Button>
          <Button asChild>
            <Link to="/tutors">Trouver un tuteur</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
