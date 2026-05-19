export interface HealthResponse {
  status: "ok";
  service: string;
  time: string;
}

export interface RuntimeResponse {
  python: string;
  platform: string;
  arch: string;
  server: string;
  port: number;
  uptime_seconds: number;
}

export interface DatabaseResponse {
  kind: "sqlite" | "postgres";
  url_label: string;
  notes_count: number;
  postgres_enabled: boolean;
}

export interface Note {
  id: number;
  body: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  mode: "demo" | "local" | "api";
}

export interface ChatResponse {
  mode: "demo" | "local" | "api";
  reply: string;
  provider: string;
}

export interface AiMode {
  id: "demo" | "local" | "api";
  label: string;
  available: boolean;
  description: string;
}

export interface AiModesResponse {
  modes: AiMode[];
  default: "demo" | "local" | "api";
}
