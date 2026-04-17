import { useRef } from "react";

interface SpeakButtonProps {
  text: string;
  speaking: boolean;
  setSpeaking: (v: boolean) => void;
  color?: string;
}

const ELEVENLABS_API_KEY = "sk_379baf4a549e28b2d0da7798d6f028d7ea2344aab8348b79";
const VOICE_ID = "XrExE9yKIg1WjnnlVkGX"; // Matilda — warm, smooth American female, audiobook narration
const MODEL_ID = "eleven_turbo_v2_5"; // Fast, high-quality

export default function SpeakButton({ text, speaking, setSpeaking, color = "var(--cyan)" }: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<string | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (sourceRef.current) {
      URL.revokeObjectURL(sourceRef.current);
      sourceRef.current = null;
    }
    setSpeaking(false);
  };

  const handleSpeak = async () => {
    if (speaking) {
      stopAudio();
      return;
    }

    setSpeaking(true);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: MODEL_ID,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.2,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        console.error("ElevenLabs error:", response.status, await response.text());
        setSpeaking(false);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      sourceRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        stopAudio();
      };
      audio.onerror = () => {
        stopAudio();
      };

      await audio.play();
    } catch (err) {
      console.error("ElevenLabs TTS failed:", err);
      setSpeaking(false);
    }
  };

  return (
    <button
      className="speak-btn"
      onClick={handleSpeak}
      data-testid="speak-btn"
      style={{
        color,
        borderColor: color + "55",
        background: color + "12",
        position: "relative",
      }}
    >
      {speaking ? (
        <>
          {/* Animated waveform bars when speaking */}
          <span style={{ display: "flex", alignItems: "center", gap: 2, height: 14 }}>
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 3,
                  borderRadius: 2,
                  background: color,
                  animation: `wave-bar 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                  height: [8, 14, 10, 6][i],
                }}
              />
            ))}
          </span>
          <style>{`
            @keyframes wave-bar {
              from { transform: scaleY(0.4); }
              to { transform: scaleY(1); }
            }
          `}</style>
          Stop
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Narrate
        </>
      )}
    </button>
  );
}
