interface SpeakButtonProps {
  text: string;
  speaking: boolean;
  setSpeaking: (v: boolean) => void;
  color?: string;
}

export default function SpeakButton({ text, speaking, setSpeaking, color = 'var(--cyan)' }: SpeakButtonProps) {
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92;
    utt.pitch = 1;
    // Prefer a natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'));
    if (preferred) utt.voice = preferred;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  return (
    <button
      className="speak-btn"
      onClick={handleSpeak}
      data-testid="speak-btn"
      style={{
        color,
        borderColor: color + '55',
        background: color + '12',
      }}
    >
      {speaking ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
          Stop
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          Narrate
        </>
      )}
    </button>
  );
}
