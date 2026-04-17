import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeakButton from "../components/SpeakButton";
import RippleButton from "../components/RippleButton";

const NARRATION = `Retrieval-Augmented Generation, or RAG, is how we give AI access to real knowledge. 
Here's how it works: You ask a question. Before the language model tries to answer, the system searches through a document library — your knowledge base. 
It finds the most relevant chunks using embeddings, which are mathematical representations of meaning. 
Those chunks get injected into the model's context window as extra background. 
Now the model answers using both its training knowledge AND the fresh retrieved documents. 
The result? Accurate, grounded answers — not hallucinations. 
Think of it like open-book vs closed-book test. RAG gives the AI an open book.`;

const DEMO_DOCS = [
  { id: 1, title: "NVIDIA GPU Architecture 2024", snippet: "Blackwell architecture introduces transformer engine with FP4 precision..." },
  { id: 2, title: "AI Model Scaling Laws", snippet: "Compute-optimal training requires balancing parameters and data tokens..." },
  { id: 3, title: "Vector Database Overview", snippet: "Pinecone, Weaviate, and Chroma support ANN search with HNSW indexing..." },
  { id: 4, title: "LLM Context Windows", snippet: "Modern models support 128K to 1M token context windows for long documents..." },
  { id: 5, title: "Embedding Models", snippet: "text-embedding-3-large produces 3072-dimension vectors for semantic search..." },
];

const QUERIES = [
  "What GPU architecture should I use for AI inference?",
  "How big should my AI model be?",
  "Which vector DB is fastest?",
];

interface Props { speaking: boolean; setSpeaking: (v: boolean) => void; }

export default function RAGModule({ speaking, setSpeaking }: Props) {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState(QUERIES[0]);
  const [customQuery, setCustomQuery] = useState("");
  const [retrieved, setRetrieved] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<"idle"|"embedding"|"searching"|"retrieving"|"generating"|"done">("idle");

  const runRAG = async (q: string) => {
    setStep(1);
    setRetrieved([]);
    setAnswer("");
    setPhase("embedding");
    await sleep(700);
    setPhase("searching");
    await sleep(800);
    // Pick relevant docs by query keyword
    const relevant = DEMO_DOCS.filter((_, i) => {
      if (q.toLowerCase().includes("gpu") || q.toLowerCase().includes("architecture")) return i === 0;
      if (q.toLowerCase().includes("model") || q.toLowerCase().includes("big") || q.toLowerCase().includes("scale")) return i === 1 || i === 4;
      if (q.toLowerCase().includes("vector") || q.toLowerCase().includes("db") || q.toLowerCase().includes("fast")) return i === 2;
      return i < 2;
    }).map(d => d.id);
    setPhase("retrieving");
    for (let i = 0; i < relevant.length; i++) {
      await sleep(300);
      setRetrieved(prev => [...prev, relevant[i]]);
    }
    setStep(2);
    await sleep(600);
    setPhase("generating");
    setGenerating(true);
    setStep(3);
    await sleep(1200);
    setGenerating(false);
    setPhase("done");
    setAnswer(`Based on the retrieved documents, here's a grounded answer to "${q}": The most relevant context was found in ${relevant.length} document chunk(s). The model synthesizes this with its training knowledge to produce an accurate, cited response — not a hallucination.`);
    setStep(4);
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const STEPS = ["Query", "Embed & Search", "Retrieve Chunks", "Augment & Generate", "Answer"];

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.5rem" }}>Module 01</div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
            Retrieval-Augmented<br/><span style={{ color: "var(--cyan)" }}>Generation</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", maxWidth: 500, fontSize: "0.95rem" }}>
            AI with an open book. Give your model access to real documents, updated knowledge, and cited sources.
          </p>
        </div>
        <SpeakButton text={NARRATION} speaking={speaking} setSpeaking={setSpeaking} color="var(--cyan)" />
      </div>

      {/* Pipeline Steps */}
      <div style={{ display: "flex", gap: "0", marginBottom: "2rem", overflowX: "auto" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <motion.div
              animate={{ 
                background: step >= i ? "var(--cyan)" : "var(--surface-3)",
                color: step >= i ? "var(--surface)" : "var(--text-faint)"
              }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "default",
              }}
            >
              {i + 1}. {s}
            </motion.div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 24, height: 2, background: step > i ? "var(--cyan)" : "var(--surface-3)", transition: "background 0.3s", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left: Interactive Demo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Query Input */}
          <div className="ai-card glow-cyan">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Step 1 — Your Query</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {QUERIES.map(q => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  data-testid={`query-${q.slice(0,20)}`}
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    background: query === q ? "rgba(34,211,238,0.12)" : "var(--surface-3)",
                    border: `1px solid ${query === q ? "var(--cyan)" : "var(--border-subtle)"}`,
                    color: query === q ? "var(--cyan)" : "var(--text-muted)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "all 180ms ease",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
            <input
              value={customQuery}
              onChange={e => { setCustomQuery(e.target.value); if(e.target.value) setQuery(e.target.value); }}
              placeholder="Or type your own question..."
              data-testid="custom-query"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                background: "var(--surface-3)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text)",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <RippleButton
              onClick={() => runRAG(query)}
              data-testid="run-rag"
              style={{
                marginTop: "0.75rem",
                width: "100%",
                padding: "0.625rem",
                borderRadius: "0.5rem",
                background: "var(--cyan)",
                color: "var(--surface)",
                fontWeight: 700,
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              ⚡ Run RAG Pipeline
            </RippleButton>
          </div>

          {/* Knowledge Base */}
          <div className="ai-card">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Knowledge Base — 5 Documents</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {DEMO_DOCS.map(doc => (
                <motion.div
                  key={doc.id}
                  animate={{
                    borderColor: retrieved.includes(doc.id) ? "var(--cyan)" : "var(--border-subtle)",
                    background: retrieved.includes(doc.id) ? "rgba(34,211,238,0.08)" : "var(--surface-3)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ padding: "0.625rem 0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-subtle)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: retrieved.includes(doc.id) ? "var(--cyan)" : "var(--text)" }}>{doc.title}</span>
                    {retrieved.includes(doc.id) && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{ fontSize: "0.65rem", fontWeight: 700, background: "var(--cyan)", color: "var(--surface)", padding: "0.1rem 0.4rem", borderRadius: "9999px" }}
                      >RETRIEVED</motion.span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginTop: "0.25rem" }}>{doc.snippet}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Visual Flow + Answer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Phase Indicator */}
          <div className="ai-card">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>Pipeline Status</div>
            {[
              { key: "embedding", label: "🔢 Embedding query into vector space", color: "var(--purple)" },
              { key: "searching", label: "🔍 ANN search across vector DB", color: "var(--cyan)" },
              { key: "retrieving", label: "📄 Fetching top-k document chunks", color: "var(--green)" },
              { key: "generating", label: "🤖 Augmented context → LLM generates", color: "var(--orange)" },
              { key: "done", label: "✅ Grounded answer delivered", color: "var(--green)" },
            ].map(p => (
              <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <motion.div
                  animate={{ opacity: phase === p.key ? 1 : 0.3, scale: phase === p.key ? 1 : 0.9 }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }}
                  className={phase === p.key ? "agent-dot" : ""}
                />
                <span style={{ fontSize: "0.8rem", color: phase === p.key ? "var(--text)" : "var(--text-faint)", fontWeight: phase === p.key ? 600 : 400 }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          {/* Embedding Visual */}
          <div className="ai-card">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--purple)", marginBottom: "0.75rem" }}>Vector Space Visualization</div>
            <div style={{ position: "relative", height: 130, background: "var(--surface-3)", borderRadius: "0.5rem", overflow: "hidden" }}>
              {DEMO_DOCS.map((d, i) => (
                <motion.div
                  key={d.id}
                  animate={{
                    opacity: retrieved.includes(d.id) ? 1 : 0.35,
                    scale: retrieved.includes(d.id) ? 1.25 : 1,
                  }}
                  style={{
                    position: "absolute",
                    width: 10, height: 10, borderRadius: "50%",
                    background: retrieved.includes(d.id) ? "var(--cyan)" : "var(--text-faint)",
                    left: `${15 + i * 17}%`,
                    top: `${20 + (i % 2) * 40}%`,
                    boxShadow: retrieved.includes(d.id) ? "0 0 12px var(--cyan)" : "none",
                    cursor: "default",
                  }}
                  title={d.title}
                />
              ))}
              {/* Query point */}
              {phase !== "idle" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    position: "absolute",
                    width: 14, height: 14,
                    borderRadius: "50%",
                    background: "var(--yellow)",
                    left: "45%", top: "45%",
                    boxShadow: "0 0 16px var(--yellow)",
                  }}
                  title="Query vector"
                />
              )}
              <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: "0.65rem", color: "var(--text-faint)" }}>● = document chunk · ★ = query vector · highlighted = top-k matches</div>
            </div>
          </div>

          {/* Answer */}
          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="ai-card glow-green"
                style={{ borderColor: "rgba(74,222,128,0.3)" }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green)", marginBottom: "0.5rem" }}>✅ Grounded Answer</div>
                <p style={{ fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.6 }}>{answer}</p>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {retrieved.map(id => (
                    <span key={id} className="token-chip" style={{ borderColor: "rgba(74,222,128,0.4)", color: "var(--green)", background: "rgba(74,222,128,0.08)" }}>
                      📄 {DEMO_DOCS.find(d => d.id === id)?.title.split(" ").slice(0,3).join(" ")}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Concept Box */}
          <div className="ai-card" style={{ borderColor: "rgba(34,211,238,0.2)", background: "rgba(34,211,238,0.04)" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Why RAG Matters</div>
            {[
              ["🧠", "Grounds responses in real facts, not training memories"],
              ["📅", "Knowledge can be updated without retraining the model"],
              ["📎", "Answers can cite specific sources — full auditability"],
              ["💸", "Cheaper than fine-tuning for domain-specific tasks"],
            ].map(([icon, text]) => (
              <div key={text as string} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span style={{ flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{text as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
