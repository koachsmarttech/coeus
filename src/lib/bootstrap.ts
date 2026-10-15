import { createContext, useContext } from "react";
import type { FormSchema, Profile, Role, AppSettings } from "./types";
import { AI_MODELS } from "./types";

export type Bootstrap = {
  profile: Profile;
  effectiveRole: Role;
  schemas: FormSchema[];
  settings: AppSettings;
  aiAvailable: boolean;
  models: typeof AI_MODELS;
};

export const BootstrapContext = createContext<{
  data: Bootstrap | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  viewAs: Role | null;
  setViewAs: (r: Role | null) => void;
}>({
  data: null,
  loading: true,
  error: null,
  reload: () => {},
  viewAs: null,
  setViewAs: () => {},
});

export function useBootstrap() {
  return useContext(BootstrapContext);
}
