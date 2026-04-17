import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeakButton from "../components/SpeakButton";
import RippleButton from "../components/RippleButton";

const NARRATION = `Agentic workflows are where AI gets truly autonomous. Instead of just answering a question, an AI agent can plan, act, observe the result, and loop.
Here's the core pattern, called ReAct: Think about what to do. Then act — call a tool, write code, search the web. Then observe what happened. Then think again. Repeat until the goal is achieved.
This loop is what makes agents powerful. They're not just language models — they're goal-directed systems.
Real-world examples: a coding agent that writes code, runs it, sees the error, fixes it, and runs it again. A research agent that searches, reads, finds a dead end, backtracks, and tries a new angle.
Key components are: the model that does the reasoning, tools the agent can use, memory to track what's happened, and a stopping condition so it doesn't loop forever.
Guardrails are essential — because an agent with unrestricted tool access in production is a liability. Always scope what an agent can touch.`;

const TASKS = [
  {
    label: "Debug this code",
    goal: "Fix a Python TypeError in production",
    steps: [
      { action: "THINK", text: "I need to identify the error cause. Let me read the traceback.", tool: null, result: null },
      { action: "ACT", text: "read_file('main.py')", tool: "📁 File System", result: "Found: `return data[key]` — possible KeyError" },
      { action: "THINK", text: "The key might not exist. I should add a .get() with a default.", tool: null, result: null },
      { action: "ACT", text: "edit_file('main.py', fix='data.get(key, None)')", tool: "✏️ Editor", result: "File updated successfully" },
      { action: "ACT", text: "run_tests()", tool: "⚙️ Test Runner", result: "✅ All 14 tests pass" },
      { action: "THINK", text: "Tests pass. Task complete. Summarizing changes.", tool: null, result: null },
    ]
  },
  {
    label: "Research a topic",
    goal: "Find current AI agent frameworks comparison",
    steps: [
      { action: "THINK", text: "I'll search for up-to-date comparisons of agent frameworks.", tool: null, result: null },
      { action: "ACT", text: "web_search('AI agent frameworks 2024 comparison')", tool: "🔍 Web Search", result: "Found: LangChain, AutoGen, CrewAI, LlamaIndex articles" },
      { action: "THINK", text: "I should read the most recent detailed comparison.", tool: null, result: null },
      { action: "ACT", text: "browse_url('blog.langchain.dev/agent-comparison')", tool: "🌐 Browser", result: "Retrieved: Feature table with 6 frameworks" },
      { action: "THINK", text: "I have enough data. Let me synthesize and format a summary.", tool: null, result: null },
      { action: "ACT", text: "write_report('agent_frameworks.md')", tool: "📝 Writer", result: "Report saved: 847 words, 3 tables" },
    ]
  },
  {
    label: "Deploy an update",
    goal: "Update API endpoint and verify deployment",
    steps: [
      { action: "THINK", text: "I need to update the endpoint, test locally, then deploy.", tool: null, result: null },
      { action: "ACT", text: "git_diff('api/routes.py')", tool: "🔀 Git", result: "Changes staged: 3 lines modified" },
      { action: "ACT", text: "run_local_server()", tool: "⚙️ Server", result: "HTTP 200 on all endpoints ✅" },
      { action: "THINK", text: "Local looks good. Proceed to staging.", tool: null, result: null },
      { action: "ACT", text: "deploy('staging')", tool: "☁️ Cloud", result: "Deployed to staging in 42s" },
      { action: "ACT", text: "run_smoke_tests('staging')", tool: "🧪 Tests", result: "✅ All smoke tests passed — promoting to prod" },
    ]
  }
];

interface Props { speaking: boolean; setSpeaking: (v: boolean) => void; }

export default function AgenticModule({ speaking, setSpeaking }: Props) {
  const [selectedTask, setSelectedTask] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  const task = TASKS[selectedTask];
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runAgent = async () => {
    if (running) return;
    setRunning(true);
    setCurrentStep(-1);
    setDone(false);
    setLoopCount(0);
    let loops = 0;
    for (let i = 0; i < task.steps.length; i++) {
      setCurrentStep(i);
      if (task.steps[i].action === "THINK") loops++;
      setLoopCount(loops);
      await sleep(task.steps[i].action === "THINK" ? 800 : 1000);
    }
    setDone(true);
    setRunning(false);
  };

  const reset = () => {
    setCurrentStep(-1);
    setDone(false);
    setLoopCount(0);
    setRunning(false);
  };

  const ACTION_COLORS: Record<string, string> = {
    THINK: "var(--purple)",
    ACT: "var(--cyan)",
    OBSERVE: "var(--green)",
  };

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--green)", marginBottom: "0.5rem" }}>Module 03</div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
            Agentic<br/><span style={{ color: "var(--green)" }}>Workflows</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", maxWidth: 500, fontSize: "0.95rem" }}>
            AI that plans, acts, and loops. Beyond single-turn chat — autonomous goal-seeking systems.
          </p>
        </div>
        <SpeakButton text={NARRATION} speaking={speaking} setSpeaking={setSpeaking} color="var(--green)" />
      </div>

      {/* ReAct Loop Visualization */}
      <div className="ai-card" style={{ marginBottom: "1.5rem", borderColor: "rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.03)" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green)", marginBottom: "1rem" }}>The ReAct Loop — Core Agent Pattern</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { label: "THINK", sublabel: "Reason about state", color: "var(--purple)", emoji: "💭" },
            { label: "→", sublabel: "", color: "var(--text-faint)", emoji: "" },
            { label: "ACT", sublabel: "Use a tool", color: "var(--cyan)", emoji: "⚡" },
            { label: "→", sublabel: "", color: "var(--text-faint)", emoji: "" },
            { label: "OBSERVE", sublabel: "Check the result", color: "var(--orange)", emoji: "👁️" },
            { label: "→", sublabel: "", color: "var(--text-faint)", emoji: "" },
            { label: "LOOP or STOP", sublabel: "Goal achieved?", color: "var(--green)", emoji: "🔁" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "0.5rem 0.625rem" }}>
              {item.emoji && <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{item.emoji}</div>}
              <div style={{ fontWeight: 700, fontSize: item.label === "→" ? "1.25rem" : "0.8rem", color: item.color }}>{item.label}</div>
              {item.sublabel && <div style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginTop: "0.25rem" }}>{item.sublabel}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }}>
        {/* Left: Task Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="ai-card glow-green">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green)", marginBottom: "0.75rem" }}>Choose a Task</div>
            {TASKS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => { setSelectedTask(i); reset(); }}
                data-testid={`task-${i}`}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "0.5rem",
                  background: selectedTask === i ? "rgba(74,222,128,0.12)" : "var(--surface-3)",
                  border: `1px solid ${selectedTask === i ? "var(--green)" : "var(--border-subtle)"}`,
                  color: selectedTask === i ? "var(--green)" : "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: selectedTask === i ? 700 : 400,
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  transition: "all 180ms ease",
                }}
              >
                {t.label}
                <div style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginTop: "0.2rem", fontStyle: "italic" }}>{t.goal}</div>
              </button>
            ))}
            <RippleButton
              onClick={running ? reset : runAgent}
              data-testid="run-agent"
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "0.5rem",
                background: running ? "var(--surface-3)" : done ? "var(--surface-3)" : "var(--green)",
                color: running ? "var(--yellow)" : done ? "var(--text-muted)" : "var(--surface)",
                fontWeight: 700,
                fontSize: "0.875rem",
                border: `1px solid ${running ? "var(--yellow)33" : "transparent"}`,
                cursor: "pointer",
                marginTop: "0.25rem",
              }}
            >
              {running ? "⏳ Agent running..." : done ? "🔄 Reset" : "▶ Launch Agent"}
            </RippleButton>
          </div>

          {/* Stats */}
          <div className="ai-card">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Agent Stats</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                ["Steps Completed", currentStep + 1 > 0 ? `${Math.max(0, currentStep + 1)} / ${task.steps.length}` : "—", "var(--cyan)"],
                ["ReAct Loops", loopCount > 0 ? `${loopCount}` : "—", "var(--purple)"],
                ["Tools Used", currentStep >= 0 ? task.steps.slice(0, currentStep + 1).filter(s => s.tool).length : "—", "var(--orange)"],
                ["Status", done ? "✅ Done" : running ? "⚡ Running" : "Idle", done ? "var(--green)" : running ? "var(--yellow)" : "var(--text-faint)"],
              ].map(([label, val, color]) => (
                <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.375rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{label as string}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: color as string }}>{val as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Step Trace */}
        <div className="ai-card" style={{ minHeight: 400 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
            Agent Trace — {task.goal}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {task.steps.map((step, i) => (
              <AnimatePresence key={i}>
                {currentStep >= i ? (
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.625rem",
                      background: currentStep === i ? (ACTION_COLORS[step.action] + "14") : "var(--surface-3)",
                      border: `1px solid ${currentStep === i ? ACTION_COLORS[step.action] + "55" : "var(--border-subtle)"}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: step.result ? "0.375rem" : 0 }}>
                      <span
                        style={{
                          padding: "0.1rem 0.4rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          fontFamily: "'JetBrains Mono', monospace",
                          background: ACTION_COLORS[step.action] + "22",
                          color: ACTION_COLORS[step.action],
                          letterSpacing: "0.06em",
                        }}
                      >{step.action}</span>
                      {step.tool && (
                        <span className="token-chip" style={{ borderColor: "var(--border-subtle)", color: "var(--text-faint)", fontSize: "0.65rem" }}>{step.tool}</span>
                      )}
                      {currentStep === i && running && (
                        <div className="agent-dot" style={{ background: ACTION_COLORS[step.action], marginLeft: "auto" }} />
                      )}
                    </div>
                    <code style={{ fontSize: "0.8rem", color: "var(--text)", fontFamily: step.action === "ACT" ? "'JetBrains Mono', monospace" : "inherit" }}>
                      {step.text}
                    </code>
                    {step.result && (
                      <div style={{ marginTop: "0.375rem", padding: "0.375rem 0.5rem", borderRadius: "0.375rem", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", fontSize: "0.75rem", color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
                        ↩ {step.result}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.625rem",
                      background: "var(--surface-3)",
                      border: "1px solid var(--border-subtle)",
                      opacity: 0.3,
                    }}
                  >
                    <span style={{ padding: "0.1rem 0.4rem", borderRadius: "0.25rem", fontSize: "0.65rem", fontWeight: 700, background: "var(--surface-3)", color: "var(--text-faint)", fontFamily: "monospace" }}>{step.action}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-faint)", marginLeft: "0.5rem" }}>{step.text.slice(0, 30)}…</span>
                  </div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                borderRadius: "0.625rem",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.3)",
                textAlign: "center",
                fontSize: "0.9rem",
                color: "var(--green)",
                fontWeight: 700,
              }}
            >
              ✅ Agent completed task in {task.steps.length} steps across {loopCount} reasoning loops.
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
