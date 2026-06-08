import type {
  DatabaseResponse,
  HealthResponse,
  HelloHistoryItem,
  HelloResponse,
  RuntimeResponse,
} from "./types";

const BASE = "/api";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export function getHealth() {
  return fetchJSON<HealthResponse>("/health");
}

export function getRuntime() {
  return fetchJSON<RuntimeResponse>("/runtime");
}

export function getDatabase() {
  return fetchJSON<DatabaseResponse>("/database");
}

export function sayHello() {
  return fetchJSON<HelloResponse>("/hello", { method: "POST" });
}

export function getHelloHistory(limit = 20) {
  return fetchJSON<HelloHistoryItem[]>(`/hello/history?limit=${limit}`);
}

export async function resetState(): Promise<void> {
  await fetch(`${BASE}/reset`, { method: "POST" });
}
