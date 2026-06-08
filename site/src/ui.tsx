import { useState } from "react";
import { toast } from "glaceui";
import { Check, Clipboard } from "./Icons";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function PageHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="page-title">{title}</h1>
      {children && <p className="page-lede">{children}</p>}
    </header>
  );
}

export function Section({
  title,
  sub,
  children,
}: {
  title?: string;
  sub?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="doc-section">
      {title && <h2 className="doc-h2">{title}</h2>}
      {sub && <p className="doc-sub">{sub}</p>}
      {children}
    </section>
  );
}

/** A demo surface with the crosshair grid behind, so glass refraction shows. */
export function Stage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`stage${className ? " " + className : ""}`}>{children}</div>;
}

export function PropsTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="panel">
      <table className="props">
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th></tr>
        </thead>
        <tbody>
          {rows.map(([p, t, d]) => (
            <tr key={p}>
              <td><code>{p}</code></td>
              <td>{t}</td>
              <td><code>{d}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InstallChip({ cmd = "npm i glaceui" }: { cmd?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(cmd).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard", { description: cmd });
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button className="install" onClick={copy} aria-label="Copy install command">
      <code>{cmd}</code>
      <span className="install-copy">{copied ? <Check className="install-icon" /> : <Clipboard className="install-icon" />}</span>
    </button>
  );
}
