# Hello Capsule 仕様書

## 1. 目的

`hello-capsule` は **"Hello" 1語を過剰設計された方法で返すだけのアプリ**。

React フロントエンド、Python FastAPI バックエンド、SQLite データベース、runtime イントロスペクションを経由して1つの "Hello" を生成し、その経路を実タイムスタンプ付きのトレースとして可視化する。

キャッチコピー:

```
A tiny showcase capsule that says hello in a very complicated way.
```

## 2. プロダクトコンセプト

- 「capsule の説明」はしない。アプリは自身のパッケージ構造に言及しない。
- 見た目は「Say hello」ボタン1つのシングル画面。押すとデータ経路図がアニメーションする。
- ジョーク/スコア要素は入れない。データを淡々と、本物のタイムスタンプで見せる。

## 3. スタック

```
Frontend:
  Vite / React / TypeScript / Framer Motion / Tailwind CSS

Backend:
  Python / FastAPI / SQLite (default) / Postgres (optional via DATABASE_URL)

Robot:
  SVG (3 mood: idle / running / delivered)
```

## 4. API サーフェス

| Method | Path | 用途 |
|--------|------|------|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/runtime` | Python バージョン、platform、uptime |
| GET | `/api/database` | DB kind、URL label、hello_count |
| POST | `/api/hello` | Hello Engine — トレース付きレスポンス |
| GET | `/api/hello/history?limit=N` | 直近 N 件 |
| POST | `/api/reset` | hello_events 全削除 |

### POST /api/hello レスポンス

```json
{
  "message": "Hello from an over-engineered app.",
  "run_id": "7c2e3a4f9b1d",
  "started_at": "2026-06-08T08:42:11.237Z",
  "finished_at": "2026-06-08T08:42:11.243Z",
  "duration_ms": 6,
  "steps": [
    { "id": "request_received", "at": "2026-06-08T08:42:11.237Z", "delta_ms": 0, "label": "Server received request" },
    { "id": "runtime_read",     "at": "2026-06-08T08:42:11.238Z", "delta_ms": 1, "label": "Read runtime info" },
    { "id": "db_write",         "at": "2026-06-08T08:42:11.241Z", "delta_ms": 4, "label": "Wrote event to SQLite" },
    { "id": "db_count_read",    "at": "2026-06-08T08:42:11.242Z", "delta_ms": 5, "label": "Read event count" },
    { "id": "response_ready",   "at": "2026-06-08T08:42:11.243Z", "delta_ms": 6, "label": "Response assembled" }
  ],
  "runtime":  { "python": "3.11.x", "platform": "darwin", "arch": "arm64", "port": 8000, "uptime_seconds": 12 },
  "database": { "kind": "sqlite", "url_label": "data/hello.db", "hello_count": 8 }
}
```

`steps` の各 `at` はサーバ側で `time.time()` → ISO 8601 に変換。`delta_ms` はリクエスト開始からの累積ミリ秒で単調増加する。

`run_id` は `uuid4().hex[:12]` の12桁 hex。

## 5. データ経路図 (DataFlowDiagram)

SVG で描画。4 ノード構成:

```
[ Browser ]  ←──→  [ Server ]
                     ╱      ╲
              [ Runtime ]  [ SQLite ]
```

各ノード間のライン上を、対応する phase でパケット(<circle>)がアニメーションする。

### Phase 遷移

```
user click → client_send → server_recv → runtime_read
           → db_write → db_count → server_send
           → client_recv → done
```

各 phase の持続時間は固定(60-220ms)。合計 ~1360ms。

| Phase | 持続 | 見え方 |
|-------|------|--------|
| client_send | 220ms | Browser → Server ライン上をパケットが移動 |
| server_recv | 60ms  | Server ノードが点灯 |
| runtime_read | 200ms | Server → Runtime ラインにパケット |
| db_write | 200ms | Server → SQLite ラインにパケット |
| db_count | 200ms | SQLite → Server ラインにパケット |
| server_send | 220ms | Server → Browser ライン上をパケットが移動 |
| client_recv | 80ms  | Browser ノードにメッセージ表示 |
| done | — | ロボットが happy, History を再取得 |

### ノード表示

各ノードは白地で枠線がアクティブ時にカラーに変わる。内容:
- Browser: サブラベル "React"、完了時に `message` が表示される枠
- Server: サブラベル "FastAPI"、サーバ処理時間
- Runtime: サブラベル "inspector"、`phase === "runtime_read"` で "reading"
- SQLite: サブラベル "hello_events"、`phase === "db_write"` で "insert"、`phase === "db_count"` で "count"

## 6. トレース (TraceTimeline)

`POST /api/hello` のレスポンスから生成。8行のログ:

```
HH:MM:SS.mmm  +0ms   Client sent POST /api/hello              [client]
HH:MM:SS.mmm  +Nms   Server received request                  [server]
HH:MM:SS.mmm  +Nms   Read runtime info                        [server]
HH:MM:SS.mmm  +Nms   Wrote event to SQLite                    [server]
HH:MM:SS.mmm  +Nms   Read event count                         [server]
HH:MM:SS.mmm  +Nms   Response assembled                       [server]
HH:MM:SS.mmm  +Mms   Client received hello                    [client]
───
round trip Mms · server Nms
```

1-2行目はクライアント側で `performance.now()` から生成(Client sent / Client received)。3-7行目はサーバ応答の `steps`。

各行の `at` はサーバの実タイムスタンプ(ISO 8601)、`delta_ms` もサーバの実計測値。origin バッジで発行元(client/server)を区別。

下部にラウンドトリップ時間(client_recv − client_send)とサーバ処理時間(server finished − server started)を表示。

## 7. 画面構成

```
┌──────────────────────────────────────────────────────────────┐
│ Hello                              SQLite · 8 hellos · 12s   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│            [ SVG Robot  idle | running | delivered ]          │
│            "Press the button."                               │
│                                                              │
│            [      Say hello      ]                           │
│                                                              │
│  ┌──── DataFlowDiagram ────────────────────────────┐          │
│  │   Browser ←──→ Server → Runtime / SQLite        │          │
│  └─────────────────────────────────────────────────┘          │
│                                                              │
│  Trace                                        round trip ... │
│  HH:MM:SS.mmm  +Nms  Label  [client|server]                  │
│  ...                                                          │
│                                                              │
│  ┌─ RuntimeCard ──┐  ┌─ DatabaseCard ──┐                     │
│  │ Python 3.11.x  │  │ SQLite          │                     │
│  │ Port 8000      │  │ 8 hellos        │                     │
│  │ Uptime 12s     │  │ data/hello.db   │                     │
│  └────────────────┘  └─────────────────┘                     │
│                                                              │
│  Recent hellos                                               │
│  #3  HH:MM:SS  run_id                                        │
│  #2  HH:MM:SS  run_id                                        │
│  #1  HH:MM:SS  run_id                                        │
│                                    [ Reset history ]         │
└──────────────────────────────────────────────────────────────┘
```

### ロボット mood

| mood | 条件 | 見え方 |
|------|------|--------|
| `idle` | phase === "idle" | 青色、静止 |
| `running` | phase が進行中 | 橙色、`animate-pulse` |
| `delivered` | phase === "done" | 緑色、腕が開く、glow |

speech は固定「Press the button.」のみ。完了時はメッセージ "Hello from an over-engineered app." を表示。

## 8. Hello Engine 設計

`app/hello.py` は以下のフローで HelloResponse を生成する:

1. `time.time()` でスタート時刻 `t0` を取得
2. step #1: "request_received" — 即座に記録
3. `app.runtime.get_runtime_info()` を呼び出し → step #2: "runtime_read"
4. `uuid4().hex[:12]` で run_id 生成
5. `app.db.record_hello(run_id)` で insert + count → step #3: "db_write" (before call), step #4: "db_count_read" (after call)
6. step #5: "response_ready"
7. `time.time()` で終了時刻 `t1` を取得
8. HelloResponse に詰めて返す

各 step の `at` は `datetime.fromtimestamp(t, tz=timezone.utc).isoformat(timespec="milliseconds")`。

## 9. DB 仕様

SQLite のみ(Postgres は DATABASE_URL で切替可能だが、コード上は `record_hello`, `count_hellos`, `list_hellos`, `reset_hellos` の4関数だけの薄いラッパ)。

```sql
CREATE TABLE IF NOT EXISTS hello_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

`id` は内部的に使用。`run_id` は12桁の hex で UI に表示される。

`init_db()` 内で `DROP TABLE IF EXISTS notes` / `DROP TABLE IF EXISTS guide_events` を実行し、旧スキーマのテーブルを削除する。

## 10. フロントエンド構成

```
src/
  main.tsx               # Entry point (unused)
  index.css              # @import "tailwindcss"
  App.tsx                # Mounts <HelloMachine />
  api/
    client.ts            # fetch wrappers
    types.ts             # TS types matching backend Pydantic
  robot/
    SvgRobot.tsx         # SVG robot with 3 moods
  components/
    HelloMachine.tsx     # State machine + layout assembly
    DataFlowDiagram.tsx  # SVG node graph + packet animation
    Packet.tsx           # Animated <circle> for data path
    TraceTimeline.tsx    # rowsFromResponse() + UI
    RuntimeCard.tsx      # Runtime info panel
    DatabaseCard.tsx     # Database info panel
    HelloHistory.tsx     # Recent hello events list
    ResetButton.tsx      # Clear history button
    AppShell.tsx         # Page shell
    BackgroundStage.tsx  # Background gradient
    HeaderStatus.tsx     # dbKind + helloCount + uptime
    RobotStage.tsx       # SVG robot + speech bubble
    SpeechBubble.tsx     # Animated speech bubble
```

## 11. Backend 構成

```
app/
  __init__.py
  main.py            # FastAPI routes + static serve + self-heal build
  hello.py           # Hello Engine
  db.py              # SQLite hello_events
  models.py          # Pydantic schemas
  runtime.py         # Runtime info
  settings.py        # Environment config (DATABASE_URL, PORT)
```

FastAPI が `dist/` を static serve する。`dist/` が存在しない場合の自己修復ビルド機能あり。

## 12. capsule.toml 方針

```toml
schema_version = "0.3"
name = "hello-capsule"
version = "0.3.0"
type = "app"
default_target = "main"

[targets.main]
runtime = "source"
driver = "python"
runtime_version = "3.11"
runtime_tools = { node = "20" }
build = "npm install && npm run build"
run = "python -m uvicorn app.main:app --host 127.0.0.1"

[isolation]
allow_env = ["DATABASE_URL"]

[network]
egress_allow = ["localhost", "127.0.0.1"]
```

AI 関連の env (OPENAI_API_KEY など) と egress (api.openai.com) は削除。capsule は外部ネットワークに依存しない。

## 13. 実装履歴

- Phase 1: Backend rewrite — AI chat → Hello Engine (PR #2)
- Phase 2: Frontend rewrite — 8-scene guide → single-screen HelloMachine (PR #3)
- Phase 3: Manifest + docs — capsule.toml env trim, README/SPEC rewrite (PR #4)

## 14. 非目標

- ユーザー認証
- クラウド同期
- WebGPU / Wasm
- AI / LLM 統合
- Rive / Three.js 3D アバター
- "capsule" の自己言及
