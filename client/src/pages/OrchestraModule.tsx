import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeakButton from "../components/SpeakButton";
import RippleButton from "../components/RippleButton";

const NARRATION = `LLM Orchestration is about coordinating multiple AI models and tools to work together. Think of it like a jazz band. 
You have a conductor — that's the orchestration layer — and multiple instruments: different language models, tools, APIs, and memory systems.
The conductor decides which instrument plays when. 
For example, a user asks a complex question. The orchestrator might send part of the task to a fast, cheap model for classification. 
Then route the heavy reasoning to a large model like GPT or Claude. 
Meanwhile, tool calls go out to fetch web data, run code, or query a database. 
Frameworks like LangChain, LlamaIndex, and DSPy handle this coordination automatically. 
The key insight: no single model does everything. Smart orchestration gets you better results at lower cost by using the right model for the right task.`;

const MODELS = [
  { id: "router", name: "Router/Classifier", model: "GPT-4o-mini", cost: "$0.0001/req", latency: "80ms", role: "Task classification & routing", color: "var(--cyan)", icon: "🔀" },
  { id: "reasoning", name: "Reasoning Engine", model: "Claude Opus", cost: "$0.015/req", latency: "2.1s", role: "Complex multi-step reasoning", color: "var(--purple)", icon: "🧠" },
  { id: "coder", name: "Code Specialist", model: "Deepseek-Coder", cost: "$0.0002/req", latency: "400ms", role: "Code generation & review", color: "var(--green)", icon: "💻" },
  { id: "embedder", name: "Embedding Model", model: "text-embedding-3", cost: "$0.00002/req", latency: "50ms", role: "Semantic search & similarity", color: "var(--orange)", icon: "📐" },
];

const TOOLS = [
  { id: "search", name: "Web Search", icon: "🔍", color: "var(--cyan)" },
  { id: "code", name: "Code Runner", icon: "⚙️", color: "var(--green)" },
  { id: "db", name: "Database", icon: "🗄️", color: "var(--purple)" },
  { id: "api", name: "REST API", icon: "🌐", color: "var(--orange)" },
];

const SCENARIOS = [
  { label: "Research Q&A", flow: ["router", "reasoning", "search", "reasoning"] },
  { label: "Code Generation", flow: ["router", "coder", "code", "coder"] },
  { label: "Data Analysis", flow: ["router", "embedder", "db", "reasoning"] },
];

interface Props { speaking: boolean; setSpeaking: (v: boolean) => void; }

export default function OrchestraModule({ speaking, setSpeaking }: Props) {
  const [activeScenario, setActiveScenario] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [log, setLog] = useState<{ text: string; color: string }[]>([]);
  const [cost, setCost] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runScenario = async () => {
    if (running) return;
    setRunning(true);
    setActiveNodes([]);
    setLog([]);
    setCost(null);

    const scenario = SCENARIOS[activeScenario];
    const msgs: { text: string; color: string }[] = [];
    const addLog = (text: string, color: string) => {
      msgs.push({ text, color });
      setLog([...msgs]);
    };

    addLog("🚀 Orchestrator: new request received", "var(--text)");
    await sleep(400);

    for (let i = 0; i < scenario.flow.length; i++) {
      const nodeId = scenario.flow[i];
      setActiveNodes(prev => [...prev, nodeId]);
      const model = MODELS.find(m => m.id === nodeId);
      const tool = TOOLS.find(t => t.id === nodeId);
      if (model) {
        addLog(`→ Routing to ${model.name} (${model.model})`, model.color);
      } else if (tool) {
        addLog(`→ Tool call: ${tool.name}`, tool.color);
      }
      await sleep(600);
    }

    addLog("✅ Orchestrator: aggregating responses", "var(--green)");
    await sleep(400);
    addLog("📤 Final response dispatched to user", "var(--cyan)");
    setCost(`$${(Math.random() * 0.02 + 0.002).toFixed(4)}`);
    setRunning(false);
  };

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--purple)", marginBottom: "0.5rem" }}>Module 02</div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
            LLM<br/><span style={{ color: "var(--purple)" }}>Orchestration</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", maxWidth: 500, fontSize: "0.95rem" }}>
            The right model for the right job. Coordinate multiple AI models and tools like a jazz conductor.
          </p>
        </div>
        <SpeakButton text={NARRATION} speaking={speaking} setSpeaking={setSpeaking} color="var(--purple)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left: Model Roster */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="ai-card glow-purple">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--purple)", marginBottom: "1rem" }}>Model Roster</div>
            {MODELS.map(m => (
              <motion.div
                key={m.id}
                animate={{
                  borderColor: activeNodes.includes(m.id) ? m.color : "var(--border-subtle)",
                  background: activeNodes.includes(m.id) ? m.color + "14" : "var(--surface-3)",
                }}
                style={{ padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)", marginBottom: "0.625rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: activeNodes.includes(m.id) ? m.color : "var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace" }}>{m.model}</div>
                  </div>
                  {activeNodes.includes(m.id) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="agent-dot" style={{ background: m.color, marginLeft: "auto" }} />
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className="token-chip" style={{ borderColor: m.color + "44", color: m.color, background: m.color + "10", fontSize: "0.65rem" }}>{m.latency}</span>
                  <span className="token-chip" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", fontSize: "0.65rem" }}>{m.cost}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>{m.role}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tools */}
          <div className="ai-card">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Available Tools</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {TOOLS.map(t => (
                <motion.div
                  key={t.id}
                  animate={{
                    borderColor: activeNodes.includes(t.id) ? t.color : "var(--border-subtle)",
                    background: activeNodes.includes(t.id) ? t.color + "14" : "var(--surface-3)",
                  }}
                  style={{ padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <span>{t.icon}</span>
                  <span style={{ fontSize: "0.8rem", color: activeNodes.includes(t.id) ? t.color : "var(--text-muted)", fontWeight: 500 }}>{t.name}</span>
                  {activeNodes.includes(t.id) && <div className="agent-dot" style={{ background: t.color, marginLeft: "auto" }} />}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Conductor Console */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Scenario Picker */}
          <div className="ai-card">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--purple)", marginBottom: "0.75rem" }}>Select Scenario</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => { setActiveScenario(i); setActiveNodes([]); setLog([]); setCost(null); }}
                  data-testid={`scenario-${i}`}
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    background: activeScenario === i ? "rgba(168,85,247,0.12)" : "var(--surface-3)",
                    border: `1px solid ${activeScenario === i ? "var(--purple)" : "var(--border-subtle)"}`,
                    color: activeScenario === i ? "var(--purple)" : "var(--text-muted)",
                    fontSize: "0.85rem",
                    fontWeight: activeScenario === i ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 180ms ease",
                  }}
                >
                  {s.label}
                  <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginLeft: "0.5rem" }}>
                    → {s.flow.join(" → ")}
                  </span>
                </button>
              ))}
            </div>
            <RippleButton
              onClick={runScenario}
              disabled={running}
              data-testid="run-scenario"
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "0.5rem",
                background: running ? "var(--surface-3)" : "var(--purple)",
                color: running ? "var(--text-faint)" : "white",
                fontWeight: 700,
                fontSize: "0.875rem",
                border: "none",
                cursor: running ? "not-allowed" : "pointer",
              }}
            >
              {running ? "🎼 Orchestrating..." : "🎼 Run Orchestration"}
            </RippleButton>
          </div>

          {/* Execution Log */}
          <div className="ai-card" style={{ minHeight: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Execution Log</div>
              {cost && <span className="token-chip" style={{ borderColor: "rgba(74,222,128,0.4)", color: "var(--green)", background: "rgba(74,222,128,0.08)", fontSize: "0.7rem" }}>Total: {cost}</span>}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {log.length === 0 && <span style={{ color: "var(--text-faint)" }}>// Pick a scenario and run to see execution trace</span>}
              <AnimatePresence>
                {log.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: entry.color }}
                  >
                    {entry.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Frameworks */}
          <div className="ai-card" style={{ borderColor: "rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.04)" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--purple)", marginBottom: "0.75rem" }}>Key Frameworks</div>
            {[
              ["LangChain", "Modular chains + agents + tool use", "var(--cyan)"],
              ["LlamaIndex", "Document-centric orchestration for RAG", "var(--purple)"],
              ["DSPy", "Programmatic prompting + optimization", "var(--green)"],
              ["Semantic Kernel", "Microsoft's enterprise orchestration SDK", "var(--orange)"],
            ].map(([name, desc, color]) => (
              <div key={name as string} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span className="token-chip" style={{ borderColor: (color as string) + "44", color: color as string, background: (color as string) + "10", whiteSpace: "nowrap", fontSize: "0.7rem" }}>{name as string}</span>
                <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{desc as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
