# Research Copilot — Frontend build instructions

This is the frontend counterpart to the root `instruction.md` (architecture/
stack) — it documents the **exact, already-implemented** backend contract in
`Research-Copilot-Backend` so frontend work wires up correctly on the first
try instead of guessing at shapes. Treat this as the source of truth for API
calls; if it ever disagrees with the backend code, the backend code wins —
update this file to match.

Backend status as of this writing: all 38 endpoints below exist and were
live-verified (routing, auth/RBAC guards, validation, OpenAPI schema) via
FastAPI's TestClient. DB-backed flows (register→create project→upload→chat)
are code-complete and unit-tested but not yet exercised against a running
Postgres/Qdrant/Neo4j/Redis stack from this machine — see the backend
README's "Known environment issues" before assuming a fully live backend.

## 1. Current frontend state (don't rebuild what's already here)

Already scaffolded, UI-only (no backend wiring yet):
- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind, shadcn/ui-style
  components (`components/ui/*`), `next-themes` (dark by default).
- Landing page (`app/page.tsx`, `components/landing/*`) and about page — done, leave alone.
- Auth pages (`app/(auth)/{login,signup,forgot-password}/page.tsx`) — forms
  exist with a `// TODO: wire up to POST /api/v1/auth/login` comment; this
  doc is that wiring.
- Dashboard shell (`app/dashboard/layout.tsx`, `components/dashboard/
  {sidebar,topbar,prompt-composer}.tsx`) — static/mocked nav and project
  list; needs real data.
- `@tanstack/react-query` 5.62, `zustand` 5.0, `reactflow` 11.11, `@tiptap/
  react` (manuscript editor) already installed. `services/api.ts` only has
  `API_BASE_URL` so far. `stores/`, `hooks/`, `types/` are empty.

## 2. Additional dependencies to add

```
npm install cytoscape react-cytoscapejs elkjs zod sonner
npm install -D @types/cytoscape
```
- **cytoscape + react-cytoscapejs** — Knowledge Graph view (instruction.md
  §24: Cytoscape.js, separate from the mind map).
- **elkjs** — auto-layout for the Knowledge Map (React Flow + ELK, already
  have `reactflow`).
- **zod** — validate/parse API responses and form input; pairs with
  `@hookform/resolvers` if you also add `react-hook-form` (optional; plain
  controlled forms are fine given the existing auth-page style).
- **sonner** — toast notifications (job completion, errors) — shadcn/ui's
  usual toast pick, matches the existing component style.

## 3. Backend contract fundamentals

- Base URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000` in
  `services/api.ts`), all routes under `/api/v1`.
- **Auth**: JWT bearer. `Authorization: Bearer <token>` on every request
  except `POST /auth/register` and `POST /auth/login`. No refresh-token
  endpoint exists — token lifetime is `ACCESS_TOKEN_EXPIRE_MINUTES` (60,
  configurable server-side); on a 401, clear the stored token and redirect
  to `/login`.
- **Project scoping — read this carefully, it's easy to get wrong**: almost
  every resource is nested under a project via an RBAC dependency
  (`ProjectViewerDep`/`ProjectEditorDep`/`ProjectOwnerDep`), not a path
  segment. Because that dependency resolves `project_id` as a plain
  function parameter (not part of any path template), FastAPI always binds
  it from the **query string** — including on `POST` routes that also take
  a JSON body. `project_id` is *never* a field inside a request body
  anywhere in this API, even where it'd read more naturally there (`POST
  /chat`, `/literature-review`, `/comparisons`, `/research-gaps`, `/papers`,
  `/references`, `/exports`, `/figures/generate*` all take it as
  `?project_id=...` alongside their JSON body). Every endpoint below that
  needs it shows `?project_id` explicitly — if it's missing from an
  endpoint's line here, that endpoint doesn't need it (e.g. `/search`,
  `/projects` itself). A wrong or missing one that the user isn't a member
  of returns `404` (not `403`, to avoid leaking existence).
- **Errors**: FastAPI default shape `{"detail": "..." | [...]}` — string
  for most errors, a Pydantic validation-error array (`422`) for bad
  request bodies. An upstream LLM provider failure surfaces as `502
  {"detail": "Upstream model provider error: ..."}`.
- **Pagination**: `GET` list endpoints accept `?limit=50&offset=0`
  (`limit` max 200) and return a plain JSON array (not a wrapper object).
- **IDs**: every resource id is a UUID string.
- **Async jobs**: document upload, literature review, comparisons, and
  research-gap analysis are Celery jobs — the POST returns `{"job_id": "..."}`
  (some also return `document_id`) with `202 Accepted`. Poll
  `GET /jobs/{job_id}` until `status` is `"succeeded"` or `"failed"`; the
  job's `progress` field carries pipeline-specific interim/result data (see
  §5's per-endpoint notes).

## 4. Auth & session

```
POST /auth/register  {email, password, full_name?}      -> {access_token, token_type}
POST /auth/login     {email, password}                  -> {access_token, token_type}
GET  /auth/me         (bearer)                           -> {id, email, full_name}
```
`password` must be 8-72 bytes (bcrypt's hard limit — enforce client-side
too so a too-long password doesn't just 500).

Store the token in a Zustand store persisted to `localStorage` (via
zustand's `persist` middleware) — e.g. `stores/auth-store.ts`:
```ts
type AuthState = {
  token: string | null;
  user: { id: string; email: string; full_name: string | null } | null;
  setSession: (token: string, user: AuthState["user"]) => void;
  clear: () => void;
};
```
Build the TanStack Query client's default `fetch` wrapper (`services/
api.ts`) to read the token from this store and attach the header; on a 401
response, call `clear()` and redirect to `/login`. Wrap `app/dashboard/*`
in a client-side guard (redirect to `/login` if `token` is null) since
there's no middleware-based auth here.

## 5. Complete endpoint reference

Grouped by resource. Request/response field names are exact (from the
Pydantic models) — don't rename when defining TS types, it'll save you
mapping bugs.

### Projects — `/projects`
```
POST   /projects                              {name, description?}           -> Project
GET    /projects?limit&offset                                                -> Project[]
GET    /projects/{id}                                                        -> Project
PATCH  /projects/{id}                          {name?, description?}          -> Project
DELETE /projects/{id}
POST   /projects/{id}/members                  {user_id, role}               -> Member   (role: "owner"|"editor"|"viewer")
GET    /projects/{id}/members                                                -> Member[]
DELETE /projects/{id}/members/{user_id}
```
`Project = {id, name, description, owner_id}`. `Member = {user_id, role}`.
Role gates: viewing (project + members) needs viewer+, updating the project
needs editor+, deleting the project and adding/removing members needs
owner.

### Documents — `/documents` (PDF upload, always async)
```
POST   /documents          multipart/form-data: file  (+ project_id query)   -> {job_id, document_id}   [202]
GET    /documents?project_id&limit&offset                                    -> Document[]
GET    /documents/{id}?project_id                                            -> Document
DELETE /documents/{id}?project_id
POST   /documents/{id}/reprocess?project_id                                  -> {job_id, document_id}   [202]
```
`Document = {id, project_id, paper_id, title, filename, mime_type,
page_count, status, processing_error}`. `status`: `"uploaded" |
"processing" | "parsed" | "failed"`. Upload flow: `POST /documents` →
poll `GET /jobs/{job_id}` → on success, `GET /documents/{id}` to get final
`page_count`/`status`. Max 50MB / 500 pages, PDF only — mirror those limits
in the client-side file picker before uploading (server rejects with `400`
otherwise, magic-byte + extension checked, not just Content-Type).

### Papers — `/papers` (bibliographic records)
```
POST   /papers?project_id    {title, authors[], abstract?, doi?, arxiv_id?, url?, venue?, publication_year?, source?}  -> Paper
GET    /papers?project_id&limit&offset                                       -> Paper[]
GET    /papers/{id}?project_id                                               -> Paper
DELETE /papers/{id}?project_id
```
`source`: `"upload" | "search" | "import"` (default `"import"` if you
`POST` one manually — normally papers come from `/documents` upload or
`/search` + import, not this route directly).

### Search — `/search` (Semantic Scholar + OpenAlex + Crossref + arXiv)
```
POST /search  {query, limit_per_provider?: 20}   -> {results: PaperResult[]}
```
`PaperResult = {title, authors[], year, abstract, venue, doi, arxiv_id,
url, pdf_url, citation_count, source, external_ids}` — already deduplicated
across providers server-side. This is a *preview* — nothing is persisted;
to add a result to a project, `POST /papers` with its fields (map
`PaperResult` → `PaperCreate`).

### Chat — `/chat` (STEP-18, the core feature)
```
POST /chat?project_id          {conversation_id?, message, citation_style?: "ieee"}   -> ChatResponse   (non-streaming)
POST /chat/stream?project_id    same body                                              -> SSE stream
```
`ChatResponse = {conversation_id, answer, citations[], evidence[], sources[],
knowledge_graph, verification}`.

**Use `/chat/stream` for the actual chat UI** — SSE via `EventSource` isn't
usable here since it needs a `POST` body; use `fetch` with
`Accept: text/event-stream` and read the body as a stream (or the
`fetch-event-source` pattern), or a small SSE-over-POST helper. Events, in
order:
```
event: conversation   data: {"conversation_id": "..."}          — fires immediately, use to update the URL/sidebar
event: node            data: {"node": "router"|"retrieval"|...}  — one per LangGraph node completing; drive a progress indicator
...repeated node events...
event: final            data: {answer, citations, evidence, sources, knowledge_graph, verification}
```
Render `answer` as markdown. Each citation in `citations` is
`{evidence_id, reference_id, marker, page, document_id}` — `marker` is the
literal `[n]` text already formatted server-side; render it as a clickable
element that opens the evidence panel via `GET /evidence/{evidence_id}`
(evidence_id here **is a chunk id**, see §evidence below). `sources` is the
numbered bibliography: `{reference_id, number, marker}` — render as the
reference list under the answer, formatted separately via `GET
/references/{id}/format` if you want the full citation string (chat itself
doesn't return formatted reference text, only the marker).

`citation_style` accepts `"ieee" | "apa" | "vancouver" | "chicago" |
"harvard"` — surface as a project or per-message setting.

Note on `knowledge_graph` in `ChatResponse`/the SSE `final` event: this is
**not** the same `{nodes, edges}` shape as the dedicated `GET
/knowledge-graph` endpoint below — it's mostly `{}` and only populated
(`{"research_gaps": [...]}`) for `RESEARCH_GAP`-intent questions on the
Complex path. Don't render it as a graph; if you want the actual project
graph, call `GET /knowledge-graph` separately.

### Conversations — `/conversations`
```
GET /conversations?project_id&limit&offset          -> {id, project_id, title}[]
GET /conversations/{id}?project_id                   -> {..., messages: {id, role, content}[]}
```
`role`: `"user" | "assistant" | "system" | "tool"`. No message-send route
here — sending happens via `/chat`, which creates the conversation
implicitly if `conversation_id` is omitted.

### Evidence — `/evidence/{evidence_id}` (the citation click-through)
```
GET /evidence/{evidence_id}?project_id   -> {document_id, page, block_id, type, text, image_url?, caption?}
```
`evidence_id` is a **chunk id** (from `citations[].evidence_id` in a chat
response). `type`: `"text" | "figure" | "table" | "equation"`. `image_url`
is a presigned MinIO URL (1hr expiry) present when the evidence is a
figure/table/equation crop — render it inline in the evidence panel next
to `text`/`caption`. This is the "Source → Page → Exact evidence" panel
instruction.md calls for.

### Figures — `/figures`
```
GET  /figures?project_id&document_id?&limit&offset                 -> {id, document_id, page_number, caption, vision_description, image_url}[]
POST /figures/generate?project_id              {kind: "mermaid"|"graphviz", nodes: {id,label}[], edges: {source,target,label?}[]}  -> {kind, source}
POST /figures/generate/illustration?project_id  {prompt}                -> image/png binary
```
`/generate` returns **source text** (Mermaid syntax or Graphviz DOT), not
an image — render Mermaid client-side (add `mermaid` npm package) or DOT
via a WASM Graphviz renderer if you need it as an image; otherwise just
show the source in a code block with a copy button. `/generate/illustration`
returns raw PNG bytes (`Response(content=..., media_type="image/png")`) —
fetch as a blob and `URL.createObjectURL`.

### Knowledge Graph — `/knowledge-graph` (Cytoscape.js)
```
GET /knowledge-graph?project_id   -> {nodes: {id,label,name,confidence,evidence}[], edges: {source,target,relation,confidence,evidence}[]}
```
`label` is the Neo4j node type: `Paper | Author | Method | Dataset | Model
| Task | Metric | Finding | Limitation | ResearchGap | Topic`. `evidence`
is `{chunk_ids: string[]}` — clicking a node/edge should let the user open
one of those via `/evidence/{chunk_id}`. Feed directly into
`react-cytoscapejs`'s `elements` prop (map `nodes`→`{data: {id, label,
...}}`, `edges`→`{data: {source, target, ...}}`).

### Knowledge Map — `/knowledge-map` (React Flow + ELK, deliberately separate from the graph above)
```
GET /knowledge-map?project_id   -> {roots: MapNode[]}
```
`MapNode = {id, label, name, confidence, evidence, children: MapNode[]}` —
already hierarchical (Paper → entities it mentions). Flatten to React
Flow's `{nodes, edges}` shape yourself, run through `elkjs` for layout
(mind-map style, not the graph's force-directed feel), then render with
`reactflow`.

### Literature Review — `/literature-review` (async)
```
POST /literature-review?project_id   {topic, style?: "ieee", paper_count?: 20}   -> {job_id}   [202]
```
Poll `/jobs/{job_id}`. On success, the job has no direct "result" field —
the pipeline creates a `GeneratedDocument` (DOCX); list a project's
generated docs isn't exposed as its own route, so **on success, fetch it
via** the export flow: the pipeline writes a `GeneratedDocument` row but
there's currently no `GET /generated-documents` list route — if you need
this in the UI before that route exists, ask the backend to add
`GET /literature-review/{job_id}/result` or extend `/jobs/{id}` to embed
the `GeneratedDocument`. **Known gap, flag before building this screen.**

### Comparisons — `/comparisons` (async)
```
POST /comparisons?project_id   {paper_ids: string[], question?}   -> {job_id}   [202]
```
Poll `/jobs/{job_id}` — **result lands in the job's `progress` field**
(`{question, papers: [{paper_id, title, year, findings[], methods[],
limitations[], evidence_ids[]}]}`) once `status == "succeeded"`. Render as
a comparison table: one column per paper, one row per
finding/method/limitation.

### Research Gaps — `/research-gaps` (async)
```
POST /research-gaps?project_id   {topic?}   -> {job_id}   [202]
```
Poll `/jobs/{job_id}` — result in `progress` field:
`{research_gaps: [{statement, supporting_papers[], evidence[],
existing_solutions[], remaining_problem, future_direction}]}`.

### Jobs — `/jobs` (generic polling, used by all four flows above)
```
GET /jobs?project_id&limit&offset   -> Job[]
GET /jobs/{id}?project_id           -> Job
```
`Job = {id, job_type, status, resource_type, resource_id, progress, error}`.
`job_type`: `"document_processing" | "comparison" | "literature_review" |
"research_gap"`. `status`: `"pending" | "running" | "succeeded" |
"failed"`. Poll on a 2-3s interval with `@tanstack/react-query`'s
`refetchInterval`, stop when status is terminal. Surface `error` in a toast
on failure.

### Citations & References — `/citations`, `/references`
```
GET    /citations?project_id&message_id?&generated_document_id?    -> Citation[]
POST   /references?project_id    {title, authors[], year?, venue?, volume?, issue?, pages?, publisher?, doi?, url?}   -> Reference
GET    /references?project_id&limit&offset                          -> Reference[]
GET    /references/{id}?project_id                                  -> Reference
DELETE /references/{id}?project_id
GET    /references/{id}/format?project_id&style=ieee                -> {formatted: string}
GET    /references/export/{fmt}?project_id     fmt: "bibtex"|"ris"   -> raw text (Content-Type set accordingly)
```
Build the project's "References" page off `GET /references`, with a style
picker calling `/format` per row (or batch-render client-side if you'd
rather not fire N requests — there's no batch-format route yet). Export
buttons hit `/references/export/{fmt}` and trigger a file download from the
response body.

### Exports — `/exports` (export one chat answer as DOCX/PDF)
```
POST /exports?project_id   {message_id, format: "docx"|"pdf", style?: "ieee", title?}   -> {id, type, title, download_url}   [201]
GET  /exports/{id}?project_id                                                            -> same shape
```
`download_url` is a presigned MinIO URL — trigger download via
`window.open(download_url)` or an `<a download>`. Wire this to a "Download"
button on each assistant chat message.

### Analytics — `/analytics`
```
GET /analytics?project_id   -> {model_usage: [{provider, model_name, calls, total_prompt_tokens, total_completion_tokens, total_cost_usd, avg_latency_ms, error_count}], retrieval: {total_queries, avg_latency_ms}}
```
A simple usage dashboard — bar chart of calls/cost by model, a latency
number. Low priority; build after the core chat/document flows.

### Users — `/users/{id}`
```
GET /users/{id}   (bearer)   -> {id, email, full_name}
```
For resolving a project member's display name in the members list.

## 6. Data layer architecture

- `services/api.ts`: a single typed `apiFetch<T>(path, init?)` wrapping
  `fetch`, injecting the bearer token, `API_BASE_URL` prefix, JSON
  parsing, and 401→logout handling. All hooks below call through it — no
  component calls `fetch` directly.
- `services/` per-resource modules (`projects.ts`, `documents.ts`, `chat.ts`,
  etc.) exporting typed functions (`listProjects()`, `createProject(body)`,
  ...) built on `apiFetch`. `chat.ts` additionally exports
  `streamChat(body, { onNode, onFinal })` wrapping the SSE POST.
- `hooks/` — one `useXyz` per resource using TanStack Query
  (`useQuery`/`useMutation`), query keys as `["projects"]`,
  `["documents", projectId]`, `["jobs", jobId]` (with `refetchInterval` for
  jobs), etc. Invalidate the right keys on mutation success (e.g.
  uploading a document invalidates `["documents", projectId]` and
  `["jobs", projectId]`).
- `stores/` — Zustand for **client-only** state: `auth-store.ts` (token/
  user, persisted), `project-store.ts` (currently-selected project id,
  persisted), `chat-store.ts` (in-flight SSE state per conversation, not
  persisted — TanStack Query owns anything server-fetched).
- `types/` — hand-written TS interfaces mirroring §5's shapes exactly
  (or generate them from the backend's OpenAPI schema at
  `GET /openapi.json` via `openapi-typescript` if you'd rather not
  hand-maintain them — recommended once the backend stabilizes).

## 7. Page-by-page build plan

Build in this order — each depends on the previous working:

1. **Auth** (`app/(auth)/*`) — wire the existing login/signup forms to
   `POST /auth/login` / `/register`, store the token, redirect to
   `/dashboard`.
2. **Project switcher** — replace the sidebar's hardcoded `PROJECTS` array
   with `GET /projects`, add a "New research" modal calling
   `POST /projects`, persist selection in `project-store`.
3. **Documents** (`app/dashboard/documents`) — upload dropzone → `POST
   /documents` → job-progress toast via `/jobs` polling → list via `GET
   /documents` with status badges.
4. **Chat** (`app/dashboard/page.tsx`, replacing the mocked
   `PromptComposer`) — the core screen. Wire to `/chat/stream`, render
   streaming node progress, markdown answer, inline citation markers that
   open an evidence side panel (`GET /evidence/{id}`), source list, export
   button.
5. **Paper search + import** — search bar → `POST /search` → result cards
   with an "Add to project" button → `POST /papers`.
6. **Knowledge Graph** (`app/dashboard/graph`, nav item already stubbed) —
   `GET /knowledge-graph` + `react-cytoscapejs`.
7. **Knowledge Map** — new route, `GET /knowledge-map` + `reactflow` +
   `elkjs`.
8. **References** — list/format/export, per §5.
9. **Literature review / Comparisons / Research gaps** — three similar
   "configure → submit → poll job → render result" screens; build
   Comparisons and Research Gaps first (result shape is fully specified),
   flag the Literature Review result-fetching gap from §5 before building
   that one.
10. **Analytics** — last, lowest priority.

## 8. Known backend caveats that affect UI decisions

- **`GEMINI_PRO_MODEL` currently equals `GEMINI_FLASH_MODEL`** (Pro-tier
  quota is 0 on the backend's current free-tier key) — don't build UI that
  promises a quality difference between "fast" and "deep" analysis modes
  until the backend's `.env` has real Pro access; today they're the same
  model.
- **Semantic Scholar without an API key rate-limits hard** — `/search` can
  come back with fewer results than expected under load (the other three
  providers still contribute). Don't treat a thin result set as a bug.
- **No refresh tokens** — a session simply expires after
  `ACCESS_TOKEN_EXPIRE_MINUTES` (60 by default); handle 401 gracefully
  everywhere rather than assuming a session lasts the whole visit.
- **Literature Review has no result-fetch route yet** (§5) — coordinate
  with backend work before building that screen fully.
- **Rate limiting**: 60 req/min per user by default (`RATE_LIMIT_PER_MINUTE`)
  across the whole API — a `429` is possible under heavy polling; back off
  job-polling intervals rather than hammering `/jobs/{id}` every second.

## 9. Environment variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Never put `GEMINI_API_KEY`/`QWEN_API_KEY`/`GROQ_API_KEY` (or any other
provider secret) in frontend env vars — the browser talks only to this
backend, never to a model provider directly (instruction.md §31).
