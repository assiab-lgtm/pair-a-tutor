export type Grade = "6eme" | "5eme" | "4eme" | "3eme";

export const GRADES: { id: Grade; label: string; price: number }[] = [
  { id: "6eme", label: "6ème", price: 10 },
  { id: "5eme", label: "5ème", price: 12 },
  { id: "4eme", label: "4ème", price: 14 },
  { id: "3eme", label: "3ème", price: 16 },
];

export const PLATFORM_FEE = 0.2;
export const TUTOR_SHARE = 0.8;
export const MIN_RATING = 3.5;

export function priceFor(grade: Grade) {
  return GRADES.find((g) => g.id === grade)?.price ?? 10;
}

export function gradeLabel(grade: Grade) {
  return GRADES.find((g) => g.id === grade)?.label ?? grade;
}

export function splitPayment(total: number) {
  return {
    tutor: Math.round(total * TUTOR_SHARE * 100) / 100,
    platform: Math.round(total * PLATFORM_FEE * 100) / 100,
  };
}

export const SUBJECTS = [
  "Mathématiques",
  "Français",
  "Anglais",
  "Physique-Chimie",
  "SVT",
  "Histoire-Géo",
  "Espagnol",
] as const;

export type Tutor = {
  id: string;
  firstName: string;
  lastInitial: string;
  level: string;
  subjects: string[];
  grades: Grade[];
  rating: number;
  reviews: number;
  sessions: number;
  verified: boolean;
  hasAudioIntro: boolean;
  bio: string;
  slots: { day: string; times: string[] }[];
};

export const TUTORS: Tutor[] = [
  {
    id: "lea-m",
    firstName: "Léa",
    lastInitial: "M",
    level: "Terminale · Spé Maths",
    subjects: ["Mathématiques", "Physique-Chimie"],
    grades: ["6eme", "5eme", "4eme", "3eme"],
    rating: 4.9,
    reviews: 42,
    sessions: 118,
    verified: true,
    hasAudioIntro: true,
    bio: "J'explique pas à pas, avec beaucoup d'exercices guidés et zéro jargon. Objectif : que ça clique avant la fin de la séance.",
    slots: [
      { day: "Lun", times: ["17:00", "18:00"] },
      { day: "Mer", times: ["14:00", "15:00", "16:00"] },
      { day: "Sam", times: ["10:00", "11:00"] },
    ],
  },
  {
    id: "yanis-b",
    firstName: "Yanis",
    lastInitial: "B",
    level: "Première · Spé SVT",
    subjects: ["SVT", "Mathématiques"],
    grades: ["6eme", "5eme", "4eme"],
    rating: 4.6,
    reviews: 27,
    sessions: 61,
    verified: true,
    hasAudioIntro: false,
    bio: "Je travaille surtout la méthode : fiches courtes, schémas, et quiz de fin de séance.",
    slots: [
      { day: "Mar", times: ["17:30", "18:30"] },
      { day: "Jeu", times: ["17:30"] },
      { day: "Dim", times: ["11:00", "15:00"] },
    ],
  },
  {
    id: "camille-r",
    firstName: "Camille",
    lastInitial: "R",
    level: "Terminale · Spé HLP",
    subjects: ["Français", "Histoire-Géo"],
    grades: ["5eme", "4eme", "3eme"],
    rating: 4.8,
    reviews: 35,
    sessions: 94,
    verified: true,
    hasAudioIntro: true,
    bio: "Rédaction, analyse de texte et préparation au brevet. On écrit ensemble, je corrige en direct.",
    slots: [
      { day: "Lun", times: ["18:00"] },
      { day: "Ven", times: ["17:00", "18:00"] },
      { day: "Sam", times: ["09:00", "14:00"] },
    ],
  },
  {
    id: "noah-k",
    firstName: "Noah",
    lastInitial: "K",
    level: "Première · Section euro",
    subjects: ["Anglais", "Espagnol"],
    grades: ["6eme", "5eme", "4eme", "3eme"],
    rating: 4.4,
    reviews: 19,
    sessions: 40,
    verified: true,
    hasAudioIntro: true,
    bio: "Séances 100% orales, on parle dès la première minute. Vocabulaire utile, pas de listes interminables.",
    slots: [
      { day: "Mer", times: ["16:00", "17:00"] },
      { day: "Jeu", times: ["18:00"] },
    ],
  },
  {
    id: "sarah-d",
    firstName: "Sarah",
    lastInitial: "D",
    level: "Terminale · Spé Physique",
    subjects: ["Physique-Chimie", "Mathématiques"],
    grades: ["4eme", "3eme"],
    rating: 3.2,
    reviews: 11,
    sessions: 17,
    verified: true,
    hasAudioIntro: false,
    bio: "Exercices type brevet, correction détaillée et rappels de cours ciblés.",
    slots: [{ day: "Mar", times: ["19:00"] }],
  },
  {
    id: "adam-t",
    firstName: "Adam",
    lastInitial: "T",
    level: "Première · Spé Maths/NSI",
    subjects: ["Mathématiques", "Anglais"],
    grades: ["6eme", "5eme"],
    rating: 4.7,
    reviews: 23,
    sessions: 52,
    verified: true,
    hasAudioIntro: true,
    bio: "Je rends les maths visuelles : dessins, whiteboard partagé et petits défis chronométrés.",
    slots: [
      { day: "Lun", times: ["17:00"] },
      { day: "Mer", times: ["15:00", "16:00"] },
      { day: "Dim", times: ["10:00"] },
    ],
  },
];

export function tutorName(t: Pick<Tutor, "firstName" | "lastInitial">) {
  return `${t.firstName} ${t.lastInitial}.`;
}

export function isFlagged(t: Pick<Tutor, "rating">) {
  return t.rating < MIN_RATING;
}

export function rankTutors(list: Tutor[]) {
  return [...list].sort((a, b) => {
    const flagDiff = Number(isFlagged(a)) - Number(isFlagged(b));
    if (flagDiff !== 0) return flagDiff;
    return b.rating - a.rating;
  });
}

/** Anti-circumvention filter: masks phone numbers, emails and external links. */
const PHONE = /(?:\+?\d[\s.\-()]?){8,}/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]{2,}/g;
const LINK = /\b((https?:\/\/|www\.)\S+|\S+\.(com|fr|net|io|me|org)\b\S*)/gi;
const HANDLE = /(?:^|\s)@[\w.]{3,}/g;

export function filterMessage(text: string) {
  let masked = text;
  let blocked = false;
  const mask = (m: string) => {
    blocked = true;
    return "•".repeat(Math.min(Math.max(m.trim().length, 4), 12));
  };
  masked = masked
    .replace(EMAIL, mask)
    .replace(LINK, mask)
    .replace(PHONE, mask)
    .replace(HANDLE, (m) => (m.startsWith(" ") ? " " : "") + mask(m));
  return { masked, blocked };
}
