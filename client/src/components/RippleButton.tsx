import { useRef } from "react";

interface RippleButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  "data-testid"?: string;
}

export default function RippleButton({ onClick, children, style, className, disabled, "data-testid": testId }: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x - 20}px`;
    ripple.style.top = `${y - 20}px`;
    ripple.style.width = '40px';
    ripple.style.height = '40px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      className={`ripple-container ${className || ''}`}
      style={style}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
