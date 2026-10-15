import { useSyncExternalStore } from "react";

type LocalUser = { id: string; name: string; email: string };
type Account = LocalUser & { salt: string; passwordHash: string };
const ACCOUNTS_KEY = "drp.local.accounts.v1";
const SESSION_KEY = "drp.local.session.v1";
const listeners = new Set<() => void>();
let localMode: boolean | null = null;
let currentUser: LocalUser | null = null;

function emit() { for (const listener of listeners) listener(); }
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); }
function getSnapshot() { return currentUser; }
function getServerSnapshot() { return null; }
function readAccounts(): Account[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as Account[]; }
  catch { return []; }
}
function readSession() {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    currentUser = id ? readAccounts().find((a) => a.id === id) ?? null : null;
  } catch { currentUser = null; }
}
export function isLocalAuthMode() { return localMode; }
export function initializeLocalAuth(enabled: boolean) {
  localMode = enabled;
  if (enabled) readSession();
  emit();
}
export function useLocalUser() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { user, isPending: localMode === null };
}
export function useLocalMode() {
  return useSyncExternalStore(subscribe, () => localMode, () => null);
}
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)), iterations: 120_000, hash: "SHA-256" }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}
function saveSession(user: LocalUser) {
  localStorage.setItem(SESSION_KEY, user.id);
  currentUser = user;
  emit();
}
export async function createLocalAccount(name: string, email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalized)) throw new Error("An account with this email already exists in this browser.");
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = btoa(String.fromCharCode(...saltBytes));
  const user = { id: crypto.randomUUID(), name: name.trim() || normalized.split("@")[0] || "Member", email: normalized };
  accounts.push({ ...user, salt, passwordHash: await hashPassword(password, salt) });
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  saveSession(user);
}
export async function signInLocalAccount(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === normalized);
  if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) throw new Error("Email or password is incorrect.");
  saveSession({ id: account.id, name: account.name, email: account.email });
}
export function signOutLocalAccount() {
  localStorage.removeItem(SESSION_KEY);
  currentUser = null;
  emit();
}
