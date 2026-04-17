import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RAGModule from "./pages/RAGModule";
import OrchestraModule from "./pages/OrchestraModule";
import AgenticModule from "./pages/AgenticModule";
import GuardrailsModule from "./pages/GuardrailsModule";
import HeroSection from "./pages/HeroSection";

const MODULES = [
  { id: "hero", label: "Home", color: "var(--cyan)" },
  { id: "rag", label: "RAG", color: "var(--cyan)" },
  { id: "orchestration", label: "LLM Orchestra", color: "var(--purple)" },
  { id: "agentic", label: "Agentic Flows", color: "var(--green)" },
  { id: "guardrails", label: "Eval & Guardrails", color: "var(--orange)" },
];

export default function App() {
  const [active, setActive] = useState("hero");
  const [speaking, setSpeaking] = useState(false);
  const prevActive = useRef("hero");

  // Cancel speech on tab switch
  useEffect(() => {
    if (prevActive.current !== active) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      prevActive.current = active;
    }
  }, [active]);

  const direction = MODULES.findIndex(m => m.id === active) > MODULES.findIndex(m => m.id === prevActive.current) ? 1 : -1;

  return (
    <div className="min-h-dvh grid-bg flex flex-col" style={{ background: 'var(--surface)' }}>
      {/* Top Nav */}
      <nav
        style={{
          background: 'rgba(13,17,23,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="AI Lab Logo">
              <circle cx="14" cy="14" r="12" stroke="var(--cyan)" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="4" fill="var(--cyan)" opacity="0.8" />
              <line x1="14" y1="2" x2="14" y2="8" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="20" x2="14" y2="26" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="8" y2="14" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="14" x2="26" y2="14" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="5.2" y1="5.2" x2="9.5" y2="9.5" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              <line x1="18.5" y1="18.5" x2="22.8" y2="22.8" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              <line x1="22.8" y1="5.2" x2="18.5" y2="9.5" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              <line x1="9.5" y1="18.5" x2="5.2" y2="22.8" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              AI<span style={{ color: 'var(--cyan)' }}>Lab</span>
            </span>
          </div>

          {/* Module Nav */}
          <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {MODULES.map(m => (
              <button
                key={m.id}
                className={`nav-pill ${active === m.id ? 'active' : ''}`}
                style={{
                  color: active === m.id ? m.color : 'var(--text-muted)',
                  borderColor: active === m.id ? m.color + '55' : 'transparent',
                }}
                onClick={() => setActive(m.id)}
                data-testid={`nav-${m.id}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {active === "hero" && <HeroSection onNavigate={setActive} />}
            {active === "rag" && <RAGModule speaking={speaking} setSpeaking={setSpeaking} />}
            {active === "orchestration" && <OrchestraModule speaking={speaking} setSpeaking={setSpeaking} />}
            {active === "agentic" && <AgenticModule speaking={speaking} setSpeaking={setSpeaking} />}
            {active === "guardrails" && <GuardrailsModule speaking={speaking} setSpeaking={setSpeaking} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
        Built for Byron · AI concepts made interactive · Click, listen, explore
      </footer>
    </div>
  );
}
