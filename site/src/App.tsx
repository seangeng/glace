import { useState } from "react";
import { Toaster, toast } from "glaceui";
import { CodeBlock } from "./CodeBlock";
import { Playground, type ToasterConfig } from "./Playground";

const QUICKSTART = `import { Toaster, toast } from "glaceui";
import "glaceui/styles.css";

export default function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved to your library")}>
        Save
      </button>
      <Toaster position="bottom-right" />
    </>
  );
}`;

const API = `toast("Plain message");
toast.success("Profile updated");
toast.error("Couldn't reach the server");
toast.warning("Storage almost full");
toast.info("New version available");

// update in place
const id = toast.loading("Uploading…");
toast.success("Uploaded", { id });

// description + action button
toast("Invite sent", {
  description: "alex@acme.com will get an email.",
  action: { label: "Undo", onClick: () => revoke() },
});

// promise → loading then success / error
toast.promise(saveProfile(), {
  loading: "Saving…",
  success: (data) => \`Saved \${data.name}\`,
  error: (err) => \`Failed: \${err.message}\`,
});

// render anything
toast.custom(<MyCard />);

toast.dismiss(id); // or toast.dismiss() for all`;

const THEMING = `/* every color, blur, radius is a CSS variable.
   maps cleanly onto shadcn tokens. */
[data-glace-toaster][data-theme="dark"] {
  --glace-bg: rgba(20, 20, 28, 0.55);
  --glace-border: rgba(255, 255, 255, 0.1);
  --glace-text: hsl(var(--foreground));
  --glace-radius: 14px;
}`;

const HAPTICS = `// off by default — opt in, or tune the patterns
<Toaster haptics />
<Toaster haptics={{ enabled: true, show: 8, action: [6, 10, 6], dismiss: 4 }} />`;

const PROPS: [string, string, string][] = [
  ["position", "6 corners/edges", "bottom-right"],
  ["theme", "light · dark · system", "system"],
  ["richColors", "boolean", "false"],
  ["expand", "fan open on hover", "true"],
  ["visibleToasts", "number", "3"],
  ["gap", "px between toasts", "14"],
  ["offset", "px from edge", "24"],
  ["duration", "ms before auto-close", "4000"],
  ["closeButton", "boolean", "false"],
  ["blur", "glass blur radius (px)", "16"],
  ["haptics", "boolean | HapticsOptions", "false"],
];

const FEATURES = [
  ["🧊", "Real glass", "backdrop blur + saturate, an inset specular highlight, faint grain, and a soft shadow — the Aave glass recipe."],
  ["🌗", "Light / dark / system", "looks right on both, follows the OS automatically, or pin it."],
  ["🪄", "Springy stack", "toasts collapse behind each other and fan open on hover, sonner-style."],
  ["👆", "Swipe to dismiss", "pointer-driven — works on touch and trackpad."],
  ["📳", "Optional haptics", "a buzz on appear / action / dismiss where the device supports it."],
  ["🎨", "Themeable", "every color, blur, radius, and gap is a CSS variable. No styling dependency."],
];

export function App() {
  const [config, setConfig] = useState<ToasterConfig>({
    position: "bottom-right",
    theme: "system",
    richColors: true,
    closeButton: false,
    expand: true,
    haptics: false,
  });

  return (
    <div className="page">
      <div className="bg" aria-hidden>
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <nav className="glass nav">
        <a className="brand" href="/">
          <span className="logo">🧊</span> Glacé
        </a>
        <div className="nav-links">
          <a href="#docs">Docs</a>
          <a href="https://github.com/seangeng/glace" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/glaceui" target="_blank" rel="noreferrer">npm</a>
        </div>
      </nav>

      <header className="hero">
        <div className="pill">npm i glaceui</div>
        <h1>
          Frosted-glass toasts<br />for React.
        </h1>
        <p className="lede">
          An opinionated little notification library — real layered glass, springy
          stacking, swipe-to-dismiss, light/dark out of the box, and optional haptics.
          Like <a href="https://sonner.emilkowal.ski/" target="_blank" rel="noreferrer">sonner</a>, wearing glass.
        </p>
        <div className="hero-btns">
          <button className="primary" onClick={() => toast.success("Welcome to Glacé", { description: "Tap and hold a toast to swipe it away." })}>
            Show me a toast
          </button>
          <a className="ghost" href="#docs">Read the docs</a>
        </div>
      </header>

      <section className="features">
        {FEATURES.map(([icon, title, body]) => (
          <div className="glass feature" key={title}>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section className="block">
        <h2>Playground</h2>
        <p className="sub">Tweak the <code>&lt;Toaster /&gt;</code> and fire some toasts. This page runs the real package.</p>
        <Playground config={config} setConfig={setConfig} />
      </section>

      <section className="block" id="docs">
        <h2>Quick start</h2>
        <p className="sub">Drop one <code>&lt;Toaster /&gt;</code> near your root, call <code>toast()</code> from anywhere.</p>
        <CodeBlock code={QUICKSTART} />
      </section>

      <section className="block">
        <h2>The toast API</h2>
        <CodeBlock code={API} />
      </section>

      <section className="block">
        <h2>&lt;Toaster /&gt; props</h2>
        <div className="glass panel">
          <table className="props">
            <thead>
              <tr><th>prop</th><th>type</th><th>default</th></tr>
            </thead>
            <tbody>
              {PROPS.map(([p, t, d]) => (
                <tr key={p}>
                  <td><code>{p}</code></td>
                  <td>{t}</td>
                  <td><code>{d}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block">
        <h2>Theming</h2>
        <p className="sub">Driven entirely by CSS variables on <code>[data-glace-toaster]</code> — wire them to your own palette.</p>
        <CodeBlock code={THEMING} lang="css" />
      </section>

      <section className="block">
        <h2>Haptics</h2>
        <p className="sub">Off by default. Uses the Vibration API where available (Android Chrome and others) — a progressive enhancement that never throws.</p>
        <CodeBlock code={HAPTICS} />
      </section>

      <footer className="footer">
        <p>
          Built by <a href="https://seangeng.com" target="_blank" rel="noreferrer">Sean Geng</a>. MIT.
          Standing on <a href="https://sonner.emilkowal.ski/" target="_blank" rel="noreferrer">sonner</a>,
          {" "}<a href="https://aave.com/design/building-glass-for-the-web" target="_blank" rel="noreferrer">Aave's glass recipe</a>,
          {" "}<a href="https://sileo.aaryan.design/" target="_blank" rel="noreferrer">Sileo</a>, and
          {" "}<a href="https://github.com/lochie/web-haptics" target="_blank" rel="noreferrer">web-haptics</a>.
        </p>
      </footer>

      <Toaster
        position={config.position}
        theme={config.theme}
        richColors={config.richColors}
        closeButton={config.closeButton}
        expand={config.expand}
        haptics={config.haptics}
      />
    </div>
  );
}
