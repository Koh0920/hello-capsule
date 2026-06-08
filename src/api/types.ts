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
  kind: "sqlite";
  url_label: string;
  hello_count: number;
}

export interface HelloStep {
  id: string;
  at: string;
  delta_ms: number;
  label: string;
}

export interface HelloResponse {
  message: string;
  run_id: string;
  started_at: string;
  finished_at: string;
  duration_ms: number;
  steps: HelloStep[];
  runtime: RuntimeResponse;
  database: DatabaseResponse;
}

export interface HelloHistoryItem {
  id: number;
  run_id: string;
  created_at: string;
}
