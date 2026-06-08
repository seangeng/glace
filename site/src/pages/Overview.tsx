import { Link } from "react-router-dom";
import { GlassButton, GlassCard, toast } from "glaceui";
import { Draggable } from "../Draggable";
import { ShuffleStage } from "../ShuffleStage";
import { Eyebrow, InstallChip } from "../ui";
import { ArrowUpRight, Phone, Sparkles, Stack, SunMoon, Swatch, Swipe } from "../Icons";

const FEATURES = [
  { Icon: Sparkles, title: "Real glass", body: "Edges that refract — an SVG displacement map bends the backdrop at the rim, with a specular highlight and only a little blur." },
  { Icon: SunMoon, title: "Light, dark, system", body: "Looks right on both. Follows the OS automatically, or pin it." },
  { Icon: Stack, title: "Liquid motion", body: "One shared spring drives every transform — toasts, presses, hovers, and size morphs all move as one system." },
  { Icon: Swipe, title: "Swipe to dismiss", body: "Pointer-driven — works on touch and trackpad alike." },
  { Icon: Phone, title: "Optional haptics", body: "A buzz on appear, action, or dismiss where the device supports it." },
  { Icon: Swatch, title: "Themeable", body: "Every color, blur, radius, and gap is a CSS variable. No styling dependency." },
];

const KIT = [
  { to: "/toasts", name: "Toasts", body: "A sonner-style notifier in glass — promise, action, custom render.", shot: "/shots/toasts.png" },
  { to: "/buttons", name: "Buttons", body: "Frosted buttons with a springy press, three sizes, light & dark.", shot: "/shots/buttons.png" },
  { to: "/panels", name: "Panels", body: "Padded glass containers you can drop anything into.", shot: "/shots/cards.png" },
  { to: "/primitives", name: "Primitives", body: "The raw <Glass> surface — wrap any element in real glass.", shot: "/shots/lab.png" },
];

export function Overview() {
  return (
    <div className="prose-page">
      <header className="ov-hero">
        <Eyebrow>A React glass UI kit</Eyebrow>
        <h1 className="ov-title">Frosted glass for React.</h1>
        <p className="ov-lede">
          Real edge refraction, springy liquid motion, light and dark, optional haptics —
          as a tiny, opinionated kit. Toasts, buttons, panels, and a <code>&lt;Glass&gt;</code>{" "}
          surface you can wrap anything in.
        </p>

        <div className="ov-install">
          <InstallChip />
          <span className="ov-install-note">zero-config · ships one stylesheet · MIT</span>
        </div>

        <div className="ov-cta">
          <button className="primary" onClick={() => toast.success("Welcome to Glacé", { description: "Drag a toast sideways to dismiss it." })}>
            Show me a toast
          </button>
          <Link className="ghost" to="/toasts">Read the docs <ArrowUpRight className="ghost-icon" /></Link>
        </div>
      </header>

      <div className="ov-live">
        <ShuffleStage height={340}>
          <Draggable x={120} y={70}>
            <GlassCard refract={62} sheen className="ov-live-card" style={{ width: 340 }}>
              <div className="demo-card-eyebrow">drag me · shuffle the backdrop</div>
              <div className="demo-card-title">Real glass</div>
              <p>The edges refract the gradient behind them — not just blur it.</p>
              <GlassButton size="sm" onClick={() => toast.success("From inside the card")}>Fire a toast</GlassButton>
            </GlassCard>
          </Draggable>
        </ShuffleStage>
      </div>

      <div className="features">
        {FEATURES.map(({ Icon, title, body }) => (
          <div className="feature" key={title}>
            <span className="feature-icon-wrap"><Icon className="feature-icon" /></span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>

      <h2 className="doc-h2" style={{ marginTop: 8 }}>The kit</h2>
      <p className="doc-sub">Four components, one glass foundation. Each on its own page.</p>
      <div className="kit-grid">
        {KIT.map((k) => (
          <Link key={k.to} to={k.to} className="kit-link">
            <div className="kit-shot"><img src={k.shot} alt={k.name} loading="lazy" /></div>
            <div className="kit-link-body">
              <div className="kit-link-name">{k.name} <ArrowUpRight className="kit-link-icon" /></div>
              <p>{k.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
