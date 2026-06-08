/** Heroicons (outline, MIT) inlined + a minimal Glacé wordmark glyph. */

type P = { className?: string };
const base = {
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
  "aria-hidden": true,
} as const;

export function Sparkles({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  );
}
export function SunMoon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}
export function Stack({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.429 9.75 4.179 2.25m0 0 4.179-2.25M10.608 12v8.25m9.142-12L12 12.75 2.25 8.25m9.75 4.5 9.75-4.5m-19.5 0L12 3.75l9.75 4.5m-19.5 0v7.5L12 20.25m9.75-12v7.5L12 20.25" />
    </svg>
  );
}
export function Swipe({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}
export function Phone({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}
export function Swatch({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>
  );
}
export function ArrowUpRight({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 19.5 4.5m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

export function ChevronDown({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
export function Check({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
export function Clipboard({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
  );
}

/** Minimal wordmark glyph: a glass pane with a diagonal sheen. */
export function Mark({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 15.5 15.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M10.5 17.5 17.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
