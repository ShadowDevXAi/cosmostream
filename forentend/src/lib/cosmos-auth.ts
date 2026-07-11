// Simple local auth + sub-api-key management (Fully synchronized with production backend specs)
const USER_KEY = "cosmos_user";
const API_KEY = "cosmos_token"; // 🔥 UNIFIED CORES: Aligned perfectly with backend validation tokens key

export type CosmosUser = { email: string; name: string; createdAt: string };

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUser(): CosmosUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as CosmosUser) : null;
}

export function getApiKey(): string | null {
  if (!isBrowser()) return null;
  // Always pulls the fresh dynamic token parameter without key caching collisions
  return localStorage.getItem(API_KEY);
}

function generateKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `cosmos_sk_${hex}`;
}

export function signUp(email: string, name: string): { user: CosmosUser; apiKey: string } {
  const user: CosmosUser = { email, name, createdAt: new Date().toISOString() };
  const apiKey = generateKey();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(API_KEY, apiKey);
  window.dispatchEvent(new Event("cosmos-auth"));
  return { user, apiKey };
}

export function signIn(email: string): CosmosUser {
  const existing = getUser();
  const user: CosmosUser =
    existing && existing.email === email
      ? existing
      : { email, name: email.split("@")[0], createdAt: new Date().toISOString() };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (!getApiKey()) localStorage.setItem(API_KEY, generateKey());
  window.dispatchEvent(new Event("cosmos-auth"));
  return user;
}

export function signOut() {
  // Completely wipes out both user contexts and token signatures from disk channels
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(API_KEY);
  window.dispatchEvent(new Event("cosmos-auth"));
}

export function rotateApiKey(): string {
  const k = generateKey();
  localStorage.setItem(API_KEY, k);
  window.dispatchEvent(new Event("cosmos-auth"));
  return k;
}
