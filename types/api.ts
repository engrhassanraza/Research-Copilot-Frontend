// Hand-written TS interfaces mirroring the backend's Pydantic response
// models exactly (see Research-Copilot-Frontend/instruction.md §5). Field
// names are never renamed from the backend shape.

export type UUID = string;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: UUID;
  email: string;
  full_name: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectRole = "owner" | "editor" | "viewer";

export interface Project {
  id: UUID;
  name: string;
  description: string | null;
  owner_id: UUID;
}

export interface ProjectMember {
  user_id: UUID;
  role: ProjectRole;
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export type DocumentStatus = "uploaded" | "processing" | "parsed" | "failed";

export interface Document {
  id: UUID;
  project_id: UUID;
  paper_id: UUID | null;
  title: string | null;
  filename: string;
  mime_type: string | null;
  page_count: number | null;
  status: DocumentStatus;
  processing_error: string | null;
}

export interface JobRef {
  job_id: UUID;
  document_id?: UUID;
}

// ---------------------------------------------------------------------------
// Papers
// ---------------------------------------------------------------------------

export type PaperSource = "upload" | "search" | "import";

export interface Paper {
  id: UUID;
  project_id: UUID;
  title: string;
  authors: string[] | null;
  abstract: string | null;
  doi: string | null;
  arxiv_id: string | null;
  url: string | null;
  venue: string | null;
  publication_year: number | null;
  source: PaperSource;
}

export interface PaperCreate {
  title: string;
  authors?: string[];
  abstract?: string | null;
  doi?: string | null;
  arxiv_id?: string | null;
  url?: string | null;
  venue?: string | null;
  publication_year?: number | null;
  source?: PaperSource;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface PaperResult {
  title: string;
  authors: string[];
  year: number | null;
  abstract: string | null;
  venue: string | null;
  doi: string | null;
  arxiv_id: string | null;
  url: string | null;
  pdf_url: string | null;
  citation_count: number | null;
  source: string;
  external_ids: Record<string, string> | null;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export type CitationStyle = "ieee" | "apa" | "vancouver" | "chicago" | "harvard";

export interface Citation {
  evidence_id: UUID;
  reference_id: UUID;
  marker: string;
  page: number | null;
  document_id: UUID;
}

export interface ChatSource {
  reference_id: UUID;
  number: number;
  marker: string;
}

export type ClaimSeverity = "none" | "low" | "medium" | "high";

export interface ClaimVerification {
  claim: string;
  supported: boolean;
  evidence_ids: string[];
  citation_valid: boolean;
  problem: string | null;
  severity: ClaimSeverity;
}

export interface VerificationOutput {
  claims: ClaimVerification[];
}

export interface ChatResponse {
  conversation_id: UUID;
  answer: string;
  citations: Citation[];
  evidence: Record<string, unknown>[];
  sources: ChatSource[];
  knowledge_graph: { research_gaps?: ResearchGap[] } & Record<string, unknown>;
  verification: VerificationOutput | null;
}

export type AgentNode =
  | "router"
  | "query_rewrite"
  | "retrieval"
  | "search"
  | "vision"
  | "graph_context"
  | "research_analysis"
  | "research_gap"
  | "writing"
  | "citation"
  | "verification";

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  id: UUID;
  role: MessageRole;
  content: string;
}

export interface Conversation {
  id: UUID;
  project_id: UUID;
  title: string | null;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export type EvidenceType = "text" | "figure" | "table" | "equation";

export interface Evidence {
  document_id: UUID;
  page: number | null;
  block_id: UUID | null;
  type: EvidenceType;
  text: string | null;
  image_url?: string | null;
  caption?: string | null;
}

// ---------------------------------------------------------------------------
// Figures
// ---------------------------------------------------------------------------

export interface FigureRecord {
  id: UUID;
  document_id: UUID;
  page_number: number;
  caption: string | null;
  vision_description: string | null;
  image_url: string;
}

export interface DiagramNode {
  id: string;
  label: string;
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string | null;
}

export interface GenerateDiagramRequest {
  kind: "mermaid" | "graphviz";
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface GenerateDiagramResponse {
  kind: "mermaid" | "graphviz";
  source: string;
}

// ---------------------------------------------------------------------------
// Knowledge graph / map
// ---------------------------------------------------------------------------

export type EntityLabel =
  | "Paper"
  | "Author"
  | "Method"
  | "Dataset"
  | "Model"
  | "Task"
  | "Metric"
  | "Finding"
  | "Limitation"
  | "ResearchGap"
  | "Topic";

export interface GraphNode {
  id: string;
  label: EntityLabel;
  name: string | null;
  confidence: number | null;
  evidence: { chunk_ids: string[] };
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  confidence: number | null;
  evidence: { chunk_ids: string[] };
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface MapNode {
  id: string;
  label: EntityLabel;
  name: string | null;
  confidence: number | null;
  evidence: { chunk_ids: string[] };
  children: MapNode[];
}

export interface KnowledgeMap {
  roots: MapNode[];
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export type JobStatus = "pending" | "running" | "succeeded" | "failed";
export type JobType =
  | "document_processing"
  | "comparison"
  | "literature_review"
  | "research_gap";

export interface Job {
  id: UUID;
  job_type: JobType | string;
  status: JobStatus;
  resource_type: string | null;
  resource_id: string | null;
  progress: Record<string, unknown> | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Comparisons / Research gaps / Literature review
// ---------------------------------------------------------------------------

export interface ComparisonPaperResult {
  paper_id: UUID;
  title: string;
  year: number | null;
  findings: string[];
  methods: string[];
  limitations: string[];
  evidence_ids: string[];
}

export interface ComparisonResult {
  question: string | null;
  papers: ComparisonPaperResult[];
}

export interface ResearchGap {
  statement: string;
  supporting_papers: string[];
  evidence: string[];
  existing_solutions: string[];
  remaining_problem: string;
  future_direction: string;
}

export interface ResearchGapResult {
  research_gaps: ResearchGap[];
}

// ---------------------------------------------------------------------------
// Citations & References
// ---------------------------------------------------------------------------

export interface CitationRecord {
  id: UUID;
  reference_id: UUID;
  message_id: UUID | null;
  generated_document_id: UUID | null;
  block_id: UUID | null;
  quote: string | null;
  page_number: number | null;
}

export interface Reference {
  id: UUID;
  project_id: UUID;
  title: string;
  authors: string[] | null;
  year: number | null;
  venue: string | null;
  doi: string | null;
  url: string | null;
}

export interface ReferenceCreate {
  title: string;
  authors?: string[];
  year?: number | null;
  venue?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  publisher?: string | null;
  doi?: string | null;
  url?: string | null;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type GeneratedDocumentType = "docx" | "pdf";

export interface ExportResponse {
  id: UUID;
  type: GeneratedDocumentType;
  title: string | null;
  download_url: string;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface ModelUsageSummary {
  provider: string;
  model_name: string;
  calls: number;
  total_prompt_tokens: number;
  total_completion_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
  error_count: number;
}

export interface RetrievalSummary {
  total_queries: number;
  avg_latency_ms: number;
}

export interface Analytics {
  model_usage: ModelUsageSummary[];
  retrieval: RetrievalSummary;
}
