import { useState } from "react";
import { Glass, GlassButton, GlassCard, Toaster, toast } from "glaceui";
import { CodeBlock } from "./CodeBlock";
import { Playground, type ToasterConfig } from "./Playground";
import { GlassLab } from "./GlassLab";
import { ArrowUpRight, Check, Clipboard, Mark, Phone, Sparkles, Stack, SunMoon, Swatch, Swipe } from "./Icons";

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

const KIT = `import { Glass, GlassCard, GlassButton } from "glaceui";
import "glaceui/styles.css";

// a frosted button — refracts the backdrop at its edges
<GlassButton size="md" onClick={() => toast("Nice")}>
  Glass button
</GlassButton>

// a padded glass container
<GlassCard tone="dark" interactive>
  <h3>Pricing</h3>
  <p>Wrap anything in real glass.</p>
</GlassCard>

// the raw primitive — any element, any size, any radius
<Glass as="section" tone="light" radius={24}>
  …your content…
</Glass>`;

const GLASS_PROPS: [string, string, string][] = [
  ["as", "element type", "div"],
  ["tone", "light · dark", "dark"],
  ["radius", "corner radius (px)", "16"],
  ["blur", "refraction-path blur (px)", "3"],
  ["fallbackBlur", "blur where refraction is unsupported", "14"],
  ["refract", "boolean", "true"],
  ["interactive", "lift on hover", "false"],
];

const PROPS: [string, string, string][] = [
  ["position", "6 corners / edges", "bottom-right"],
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
  { Icon: Sparkles, title: "Real glass", body: "Edges that refract — an SVG displacement map bends the backdrop at the rim, with a specular highlight and only a little blur. Not just frosted." },
  { Icon: SunMoon, title: "Light, dark, system", body: "Looks right on both. Follows the OS automatically, or pin it." },
  { Icon: Stack, title: "Springy stack", body: "Toasts collapse behind each other and fan open on hover." },
  { Icon: Swipe, title: "Swipe to dismiss", body: "Pointer-driven — works on touch and trackpad alike." },
  { Icon: Phone, title: "Optional haptics", body: "A buzz on appear, action, or dismiss where the device supports it." },
  { Icon: Swatch, title: "Themeable", body: "Every color, blur, radius, and gap is a CSS variable. No styling dependency." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

function InstallChip() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm i glaceui";
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

export function App() {
  const [config, setConfig] = useState<ToasterConfig>({
    position: "bottom-right",
    theme: "dark",
    richColors: false,
    closeButton: false,
    expand: true,
    haptics: false,
  });

  return (
    <div className="page">
      <div className="bg" aria-hidden />

      <Glass as="nav" tone="dark" radius={14} className="nav">
        <a className="brand" href="/">
          <Mark className="brand-mark" />
          <span>Glacé</span>
        </a>
        <div className="nav-links">
          <a href="#docs">Docs</a>
          <a href="https://github.com/seangeng/glace" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/glaceui" target="_blank" rel="noreferrer">npm</a>
        </div>
      </Glass>

      <header className="hero">
        <Eyebrow>A React glass UI kit</Eyebrow>
        <h1>Frosted glass for React.</h1>
        <p className="lede">
          Real edge refraction, springy motion, light and dark, optional haptics —
          as a tiny, opinionated kit. Toasts, buttons, and a <code>&lt;Glass&gt;</code>{" "}
          surface you can wrap anything in. Like{" "}
          <a href="https://sonner.emilkowal.ski/" target="_blank" rel="noreferrer">sonner</a>, wearing glass.
        </p>
        <div className="hero-btns">
          <button
            className="primary"
            onClick={() =>
              toast.success("Welcome to Glacé", {
                description: "Drag a toast sideways to dismiss it.",
              })
            }
          >
            Show me a toast
          </button>
          <a className="ghost" href="#docs">
            Read the docs <ArrowUpRight className="ghost-icon" />
          </a>
        </div>
        <InstallChip />
      </header>

      <section className="features">
        {FEATURES.map(({ Icon, title, body }) => (
          <div className="feature" key={title}>
            <span className="feature-icon-wrap">
              <Icon className="feature-icon" />
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section className="block">
        <Eyebrow>Beyond toasts</Eyebrow>
        <h2>A whole glass kit.</h2>
        <p className="sub">
          The refraction that powers the toasts is a primitive you can use directly — a
          surface, a card, a button. Same edge-bending glass, anywhere.
        </p>

        <div className="kit-stage">
          <div className="kit-row">
            <GlassButton size="sm" onClick={() => toast("Small glass button")}>Small</GlassButton>
            <GlassButton size="md" onClick={() => toast.success("Pressed the glass")}>Glass button</GlassButton>
            <GlassButton size="lg" onClick={() => toast("Large glass button")}>Large</GlassButton>
          </div>

          <div className="kit-cards">
            <GlassCard interactive className="kit-card">
              <div className="kit-card-eyebrow">&lt;GlassCard /&gt;</div>
              <div className="kit-card-title">Wrap anything</div>
              <p>A padded frosted surface. Edges refract, the rim catches light, hover lifts it.</p>
              <GlassButton size="sm" onClick={() => toast("From inside a card")}>Action</GlassButton>
            </GlassCard>

            <Glass as="div" tone="light" radius={18} className="kit-card kit-card--light">
              <div className="kit-card-eyebrow">tone="light"</div>
              <div className="kit-card-title">Light glass</div>
              <p>The same surface, tuned for bright backgrounds.</p>
            </Glass>
          </div>
        </div>

        <div className="kit-code">
          <CodeBlock code={KIT} />
        </div>

        <h3 className="kit-ref-title">&lt;Glass /&gt; props</h3>
        <div className="panel">
          <table className="props">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th></tr>
            </thead>
            <tbody>
              {GLASS_PROPS.map(([p, t, d]) => (
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
        <Eyebrow>Glass lab</Eyebrow>
        <h2>Drag the glass.</h2>
        <p className="sub">
          The edges don't just blur — they <em>refract</em>, bending the grid behind them like
          real glass. Drag the card over the chart and tune the optics. (Refraction renders in
          Chromium; other browsers fall back to a frosted blur.)
        </p>
        <GlassLab />
      </section>

      <section className="block">
        <Eyebrow>Playground</Eyebrow>
        <h2>Tweak it, fire it.</h2>
        <p className="sub">
          Adjust the <code>&lt;Toaster /&gt;</code> and trigger some toasts. This page runs the
          real published package.
        </p>
        <Playground config={config} setConfig={setConfig} />
      </section>

      <section className="block" id="docs">
        <Eyebrow>Quick start</Eyebrow>
        <h2>Two imports and a component.</h2>
        <p className="sub">
          Drop one <code>&lt;Toaster /&gt;</code> near your root, then call <code>toast()</code> from anywhere.
        </p>
        <CodeBlock code={QUICKSTART} />
      </section>

      <section className="block">
        <Eyebrow>API</Eyebrow>
        <h2>The toast function.</h2>
        <CodeBlock code={API} />
      </section>

      <section className="block">
        <Eyebrow>Reference</Eyebrow>
        <h2>&lt;Toaster /&gt; props.</h2>
        <div className="panel">
          <table className="props">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th></tr>
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
        <Eyebrow>Theming</Eyebrow>
        <h2>Plain CSS variables.</h2>
        <p className="sub">
          Driven entirely by variables on <code>[data-glace-toaster]</code> — wire them to your
          own palette.
        </p>
        <CodeBlock code={THEMING} lang="css" />
      </section>

      <section className="block">
        <Eyebrow>Haptics</Eyebrow>
        <h2>Off by default.</h2>
        <p className="sub">
          Uses the Vibration API where available — a progressive enhancement that never throws.
        </p>
        <CodeBlock code={HAPTICS} />
      </section>

      <footer className="footer">
        <p>
          Built by <a href="https://seangeng.com" target="_blank" rel="noreferrer">Sean Geng</a>. MIT licensed.
        </p>
        <p className="credits">
          On the shoulders of <a href="https://sonner.emilkowal.ski/" target="_blank" rel="noreferrer">sonner</a>,
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
