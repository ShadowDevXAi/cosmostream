import axios, { type AxiosError } from "axios";
import { getApiKey } from "./cosmos-auth";

export const COSMOS_API_URL = "https://shadowapiweb.onrender.com";

type WakeListener = (state: { active: boolean; secondsLeft: number; attempt: number }) => void;
const listeners = new Set<WakeListener>();
export function onCosmosWake(fn: WakeListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
function emit(state: { active: boolean; secondsLeft: number; attempt: number }) {
  listeners.forEach((l) => l(state));
}

export const cosmos = axios.create({
  baseURL: COSMOS_API_URL,
  timeout: 60_000,
});

// 🔥 DYNAMIC RE-ALIGNMENT INTERCEPTOR: Destroys the stale memory storage loop
cosmos.interceptors.request.use((config) => {
  // 1. Force read the absolute latest token directly from disk storage context
  const directToken = typeof window !== "undefined" ? localStorage.getItem("cosmos_token") : null;
  
  if (directToken) {
    // Synchronized header key signature mapping
    config.headers.set("X-API-Key", directToken);
  } else {
    // 2. Fallback to default helper module if localStorage array state is unallocated
    const backupKey = getApiKey();
    if (backupKey) config.headers.set("X-API-Key", backupKey);
  }
  return config;
});

const MAX_RETRIES = 2;

cosmos.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const config = error.config as (typeof error.config & { __retry?: number }) | undefined;
    const status = error.response?.status;
    if (!config) throw error;
    const isWake = status === 503 || error.code === "ECONNABORTED" || !error.response;
    config.__retry = config.__retry ?? 0;
    if (isWake && config.__retry < MAX_RETRIES) {
      config.__retry += 1;
      const attempt = config.__retry;
      const total = 50;
      for (let s = total; s > 0; s--) {
        emit({ active: true, secondsLeft: s, attempt });
        await new Promise((r) => setTimeout(r, 1000));
      }
      emit({ active: false, secondsLeft: 0, attempt });
      return cosmos.request(config);
    }
    emit({ active: false, secondsLeft: 0, attempt: 0 });
    throw error;
  },
);
