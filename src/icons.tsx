import type { ToastType } from "./types";

const s = { width: 18, height: 18, viewBox: "0 0 24 24" } as const;

export function Spinner() {
  return (
    <span className="glace-spinner" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${-(11 - i) * 0.1}s` }} />
      ))}
    </span>
  );
}

function Check() {
  return (
    <svg {...s} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function Cross() {
  return (
    <svg {...s} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function Warn() {
  return (
    <svg {...s} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
function Info() {
  return (
    <svg {...s} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function TypeIcon({ type }: { type: ToastType }) {
  switch (type) {
    case "loading":
      return <Spinner />;
    case "success":
      return <Check />;
    case "error":
      return <Cross />;
    case "warning":
      return <Warn />;
    case "info":
      return <Info />;
    default:
      return null;
  }
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
