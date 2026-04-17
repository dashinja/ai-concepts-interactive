import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RippleButton from "../components/RippleButton";

const MODULES = [
  {
    id: "rag",
    label: "RAG",
    subtitle: "Retrieval-Augmented Generation",
    desc: "How AI looks things up before answering — like giving it a search engine and a library at the same time.",
    color: "var(--cyan)",
    icon: "🔍",
  },
  {
    id: "orchestration",
    label: "LLM Orchestra",
    subtitle: "LLM Orchestration",
    desc: "Coordinating multiple AI models and tools so they work together like a jazz band — one conductor, many instruments.",
    color: "var(--purple)",
    icon: "🎼",
  },
  {
    id: "agentic",
    label: "Agentic Flows",
    subtitle: "Agentic Workflows",
    desc: "AI that plans, acts, checks results, and loops — not just one answer but an autonomous chain of decisions.",
    color: "var(--green)",
    icon: "⚡",
  },
  {
    id: "guardrails",
    label: "Eval & Guardrails",
    subtitle: "Evaluation & Guardrails",
    desc: "How we test AI quality and keep it from going off the rails — scoring outputs, catching hallucinations, enforcing rules.",
    color: "var(--orange)",
    icon: "🛡️",
  },
];

interface Props {
  onNavigate: (id: string) => void;
}

export default function HeroSection({ onNavigate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const COUNT = 40;
    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.6)";
        ctx.fill();
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver(() => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Hero */}
      <div
        style={{
          position: "relative",
          borderRadius: "1.5rem",
          overflow: "hidden",
          background: "var(--surface-2)",
          border: "1px solid var(--border-subtle)",
          marginBottom: "3rem",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7 }}
        />
        <div style={{ position: "relative", zIndex: 1, padding: "3rem 2rem", maxWidth: 640 }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.75rem" }}
          >
            Interactive AI Field Guide
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1rem" }}
          >
            Modern AI<br/>
            <span style={{ color: "var(--cyan)" }} className="text-glow-cyan">Explained</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 480 }}
          >
            Four core concepts every AI engineer needs to know — RAG, orchestration, agentic workflows, and evaluation. Visual, audible, and tactile.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ fontSize: "0.8rem", color: "var(--text-faint)", fontStyle: "italic" }}
          >
            Click any module below to dive in ↓
          </motion.p>
        </div>
      </div>

      {/* Module Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {MODULES.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <RippleButton
              onClick={() => onNavigate(m.id)}
              data-testid={`hero-card-${m.id}`}
              style={{
                width: "100%",
                textAlign: "left",
                background: "var(--surface-2)",
                border: `1px solid ${m.color}33`,
                borderRadius: "1rem",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="ai-card"
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: m.color, marginBottom: "0.25rem" }}>{m.label}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-faint)", marginBottom: "0.75rem", fontStyle: "italic" }}>{m.subtitle}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{m.desc}</div>
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: m.color, fontWeight: 600 }}>
                Explore →
              </div>
            </RippleButton>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
