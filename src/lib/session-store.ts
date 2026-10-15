import { create } from "zustand";
import type { Role } from "./types";

const KEY = "Coeus.viewAs";

function readViewAs(): Role | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "submitter" || v === "analyst" || v === "admin") return v;
  } catch {
    /* ignore */
  }
  return null;
}

type Store = {
  viewAs: Role | null;
  setViewAs: (role: Role | null) => void;
  hydrated: boolean;
  hydrate: () => void;
};

export const useViewAs = create<Store>((set) => ({
  viewAs: null,
  hydrated: false,
  hydrate: () => set({ viewAs: readViewAs(), hydrated: true }),
  setViewAs: (role) => {
    try {
      if (role) window.localStorage.setItem(KEY, role);
      else window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    set({ viewAs: role });
  },
}));
