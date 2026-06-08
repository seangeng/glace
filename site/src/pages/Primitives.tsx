import { CodeBlock } from "../CodeBlock";
import { GlassLab } from "../GlassLab";
import { LiquidResize } from "../LiquidResize";
import { PageHead, PropsTable, Section , PropRow} from "../ui";

const USAGE = `import { Glass } from "glaceui";
import "glaceui/styles.css";

// render any element via \`as\`
<Glass as="section" tone="light" radius={24}>
  …your content…
</Glass>

// a frosted sidebar that bends whatever scrolls behind it
<Glass as="aside" radius={0} blur={4}>…</Glass>`;

const HOW = `// one global SVG filter is mounted lazily and reused by every
// glass surface (toasts included). Need the id yourself?
import { useGlassFilter } from "glaceui";

const filterId = useGlassFilter(); // string | null (null = no refraction)`;

const PROPS: PropRow[] = [
  ["as", "element type", "div"],
  ["tone", "light · dark", "dark"],
  ["radius", "corner radius (px)", "16"],
  ["refract", "false · true · number (px)", "true"],
  ["aberration", "chromatic split (px)", "1"],
  ["profile", "convex · concave · bevel", "convex"],
  ["bezel", "rim thickness (fraction of min dim)", "0.16"],
  ["blur", "refraction-path blur (px)", "3"],
  ["saturation", "backdrop saturation (%)", "180"],
  ["fallbackBlur", "blur where refraction is unsupported", "14"],
  ["interactive", "lift on hover", "false"],
  ["sheen", "specular streak that sweeps on hover/press", "false"],
  ["morph", "spring width/height on size change", "false"],
];

const TUNE = `// every Glass-lab knob is a prop — same on Glass, GlassCard,
// GlassButton, and Toaster
<Glass
  refract={80}      // edge displacement in px (or true = auto, false = off)
  aberration={6}    // chromatic fringe
  bezel={0.16}      // rim thickness (fraction of the shorter side)
  blur={3}          // backdrop blur
  radius={28}       // corner radius
/>`;

export function Primitives() {
  return (
    <div className="prose-page">
      <PageHead eyebrow="Foundation" title="The Glass primitive">
        Every Glacé component is built on one surface: <code>&lt;Glass&gt;</code>. It bends the
        backdrop at its edges like real glass, and you can wrap it around anything.
      </PageHead>

      <Section title="Glass lab" sub="Drag the card over the chart and tune the optics. Every slider here is a prop on Glass, GlassCard, GlassButton, and Toaster. Refraction renders in Chromium; other browsers fall back to a frosted blur.">
        <GlassLab />
        <div style={{ marginTop: 18 }}>
          <CodeBlock code={TUNE} />
        </div>
      </Section>

      <Section title="Liquid resize" sub="Glass morphs its size, never scales — so the rim and refraction stay crisp at any dimension. Drag the corner, or jump to a preset and watch it spring.">
        <LiquidResize />
      </Section>

      <Section title="Usage">
        <CodeBlock code={USAGE} />
      </Section>

      <Section title="<Glass /> props">
        <PropsTable rows={PROPS} />
      </Section>

      <Section title="One filter, shared" sub="The refraction is a single displacement filter mounted once and reused everywhere — cheap, and consistent across the whole kit.">
        <CodeBlock code={HOW} />
      </Section>
    </div>
  );
}
