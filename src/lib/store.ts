import { useCallback, useEffect, useState } from "react";

export type Role = "student" | "tutor";

export type Account = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type Booking = {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  grade: string;
  slot: string;
  price: number;
  createdAt: string;
  status: "upcoming" | "done";
  rating?: number;
};

export type Payout = {
  holder: string;
  iban: string;
  bic: string;
  connected: boolean;
};

const KEYS = {
  account: "studypair-account",
  bookings: "studypair-bookings",
  payout: "studypair-payout",
  application: "studypair-application",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("studypair:store", { detail: key }));
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    const sync = () => setValue(read<T>(key, fallback));
    window.addEventListener("studypair:store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("studypair:store", sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T) => {
      write(key, next);
      setValue(next);
    },
    [key],
  );

  return [value, update] as const;
}

export function useAccount() {
  const [account, setAccount] = usePersisted<Account | null>(KEYS.account, null);

  const signIn = useCallback(
    (email: string, name: string, role: Role) => {
      setAccount({ id: crypto.randomUUID(), email, name, role });
    },
    [setAccount],
  );

  const signOut = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(KEYS.account);
    setAccount(null);
  }, [setAccount]);

  return { account, signIn, signOut };
}

export function useBookings() {
  const [bookings, setBookings] = usePersisted<Booking[]>(KEYS.bookings, []);

  const addBooking = useCallback(
    (booking: Omit<Booking, "id" | "createdAt" | "status">) => {
      const full: Booking = {
        ...booking,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: "upcoming",
      };
      setBookings([full, ...read<Booking[]>(KEYS.bookings, [])]);
      return full;
    },
    [setBookings],
  );

  const updateBooking = useCallback(
    (id: string, patch: Partial<Booking>) => {
      setBookings(
        read<Booking[]>(KEYS.bookings, []).map((b) => (b.id === id ? { ...b, ...patch } : b)),
      );
    },
    [setBookings],
  );

  const removeBooking = useCallback(
    (id: string) => {
      setBookings(read<Booking[]>(KEYS.bookings, []).filter((b) => b.id !== id));
    },
    [setBookings],
  );

  return { bookings, addBooking, updateBooking, removeBooking };
}

export function getBooking(id: string) {
  return read<Booking[]>(KEYS.bookings, []).find((b) => b.id === id) ?? null;
}

export function usePayout() {
  return usePersisted<Payout | null>(KEYS.payout, null);
}

export function useApplication() {
  return usePersisted<{ submittedAt: string; subjects: string[] } | null>(KEYS.application, null);
}
