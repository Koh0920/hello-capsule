# Capsule Guide 仕様書

## 1. 目的

`hello-capsule` を、単なる静的HTMLサンプルから **Atoの機能を体験的に紹介するインタラクティブ capsule** に拡張する。

ユーザーはロボットガイドと対話しながら、次を理解できる。

1. GitHub repo から capsule を起動できる
2. Python backend が起動している
3. HTML frontend が backend API を叩いている
4. SQLite / Postgres に state を保存できる
5. Demo AI / Local AI / API AI を切り替えられる
6. この構成を capsule として共有できる

## 2. プロダクトコンセプト

名称は **Capsule Guide**。

キャッチコピー:

```
A tiny guided app that shows what a capsule can do.
```

画面は固定ダッシュボードではなく、**ロボットが中央で案内するインタラクティブなステージ** とする。

## 3. 推奨スタック

```
Frontend:
  Vite / React / TypeScript / Framer Motion / Tailwind CSS / Rive React runtime (後続導入)

Backend:
  Python / FastAPI / SQLite (default) / Postgres (optional) / Ollama (optional) / OpenAI-compatible API (optional)

Avatar:
  v0.1 inline SVG + CSS animation
  v0.2 Rive
  v0.3 Three.js experimental
```

## 4. ロボット表現

### v0.1

SVG + CSS animation。以下の状態を持つ:

```
idle / hello / talking / thinking / pointing_left / pointing_right / happy / error
```

### v0.2

Rive に置き換え。State Machine: `GuideRobot`

### GIF / MP4 / WebM

主役のロボットには使わない。補助的用途に限定。

## 5. 画面構成

```
AppShell
  BackgroundStage
  HeaderStatus
  RobotStage
    RobotAvatar
    SpeechBubble
  FloatingObjectsLayer
    CommandSnippet / RuntimeCard / FrontendCard / DatabaseFlow / AiModesPanel / CapsulePackageCard
  BottomInteractionBar
```

### レイアウト原則

- 中央: ロボット
- 周辺: scene ごとの浮遊オブジェクト (Framer Motion で表示)
- 右上: status chips
- 下部: 入力欄 + Ask me + Next
- 背景: 白〜薄いグレー、余白多め

## 6. シーン設計

```typescript
type SceneId =
  | "intro" | "command" | "backend" | "frontend"
  | "database" | "ai" | "capsule" | "finish";
```

| Scene | 目的 | 表示 |
|-------|------|------|
| intro | ロボット登場 | RobotAvatar + SpeechBubble |
| command | GitHub repo から起動 | CommandSnippet |
| backend | Python backend 稼働確認 | RuntimeCard + ApiPulse |
| frontend | Frontend↔Backend 通信 | FrontendCard + BrowserPreview |
| database | State 保存 | DatabaseFlow + NoteForm + SavedNotes |
| ai | Demo/Local/API AI | AiModesPanel + ChatInput |
| capsule | 構成全体を共有 | CapsulePackageCard + Checklist |
| finish | 再実行・共有・拡張へ誘導 | RunCommand + CopyButton |

## 7. Floating Object 一覧

```
command / runtime / apiPulse / frontend / database / noteForm / aiModes / chat / capsulePackage
```

アニメーション:

```
initial: { opacity: 0, y: 16, scale: 0.96 }
animate: { opacity: 1, y: 0, scale: 1 }
exit: { opacity: 0, y: -8, scale: 0.98 }
transition: { duration: 0.36, ease: "easeOut" }
```

## 8. Bottom Interaction Bar

常時表示。構成:

```
[Robot mini face] [Ask me anything...] [Ask me] [Next]
```

## 9. Backend API

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/health` | Health check |
| GET | `/api/runtime` | Runtime info |
| GET | `/api/database` | DB 種類・状態 |
| GET | `/api/notes` | Note一覧 |
| POST | `/api/notes` | Note作成 |
| POST | `/api/chat` | AIチャット |
| POST | `/api/reset` | Stateリセット |

## 10. DB 仕様

デフォルト: SQLite (`sqlite:///data/hello-capsule.db`)

`DATABASE_URL` 設定時: Postgres

```sql
create table if not exists notes (
  id integer primary key,
  body text not null,
  created_at text not null
);

create table if not exists guide_events (
  id integer primary key,
  event_type text not null,
  payload_json text,
  created_at text not null
);
```

## 11. AI 仕様

初回起動は必ず `demo` モード。

- **demo**: 固定応答、外部接続なし
- **local**: Ollama-compatible API
- **api**: OpenAI-compatible API (要 `OPENAI_API_KEY`)

優先順位: 明示指定 > API key > Ollama > demo

## 12. フロントエンド構成

```
src/
  main.tsx
  App.tsx
  api/        client.ts, types.ts
  guide/      scenes.ts, scene-machine.ts
  robot/      RobotAdapter.tsx, SvgRobot.tsx, RiveRobot.tsx
  components/ AppShell, HeaderStatus, BackgroundStage, RobotStage,
              SpeechBubble, FloatingObjectsLayer, CommandSnippet,
              RuntimeCard, FrontendCard, DatabaseFlow, AiModesPanel,
              CapsulePackageCard, BottomInteractionBar
```

## 13. Backend 構成

```
app/
  main.py, db.py, models.py, ai.py, runtime.py, settings.py
data/
  .gitkeep
```

FastAPI が frontend build output を static serve する。

## 14. capsule.toml 方針

```toml
schema_version = "0.3"
name = "hello-capsule"
version = "0.2.0"
type = "app"
default_target = "main"

[targets.main]
runtime = "source"
driver = "python"
runtime_version = "3.11"
run = "app.main:app"
port = 8000

[isolation]
allow_env = ["DATABASE_URL", "OPENAI_API_KEY", "OPENAI_BASE_URL", "OPENAI_MODEL", "OLLAMA_BASE_URL", "OLLAMA_MODEL"]

[network]
egress_allow = ["api.openai.com", "localhost", "127.0.0.1"]
```

## 15. 実装フェーズ

| Phase | 内容 | 成功条件 |
|-------|------|---------|
| 1 | Scene UI skeleton (Vite + React + TS + Tailwind + Framer Motion + SVG robot) | Next で全 scene 遷移、ロボット表情変化、アニメーション表示 |
| 2 | FastAPI backend (health, runtime, static serve) | Backend scene で実API結果表示 |
| 3 | SQLite state (notes CRUD) | Note保存・永続化・保存演出 |
| 4 | Demo AI (POST /api/chat) | Ask me でロボット応答 |
| 5 | Optional Local/API AI | 未設定でも壊れない、設定時のみ有効 |
| 6 | Postgres optional (DATABASE_URL) | DB種別に応じた自動切替 |
| 7 | Rive robot | RobotAvatar の差し替えが既存 scene と独立 |

最初のPRでは **Phase 1〜3** を目標とする。

## 16. 非目標 (初期版)

- 本格的な3D avatar
- WebGPU依存
- ブラウザ内Wasm DB完結
- 複雑なAI agent workflow
- ユーザー認証
- クラウド同期
- Ato Desktop native UI化

## 17. 判断まとめ

**採用**: React + Framer Motion / Python + FastAPI / SQLite (default) / Postgres (optional) / Demo AI (default) / Ollama/API (optional) / SVG robot (first) / Rive robot (later)

**不採用**: GIF/動画を主avatarにする / 初手からThree.js 3D / Wasm中心構成 / Native GPUI capsule化
