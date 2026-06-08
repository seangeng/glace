import { useState } from "react";

export function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <div className="code">
      <button className="code-copy" onClick={copy} aria-label="Copy code">
        {copied ? "copied ✓" : "copy"}
      </button>
      <pre>
        <code data-lang={lang}>{code}</code>
      </pre>
    </div>
  );
}
