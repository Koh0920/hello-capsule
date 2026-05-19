import type { HealthResponse, RuntimeResponse, Note } from "./types";

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

export function getNotes() {
  return fetchJSON<Note[]>("/notes");
}

export function createNote(body: string) {
  return fetchJSON<Note>("/notes", {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}
