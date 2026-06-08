import { CodeBlock } from "../CodeBlock";
import { GlassLab } from "../GlassLab";
import { LiquidResize } from "../LiquidResize";
import { PageHead, PropsTable, Section } from "../ui";

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

const PROPS: [string, string, string][] = [
  ["as", "element type", "div"],
  ["tone", "light · dark", "dark"],
  ["radius", "corner radius (px)", "16"],
  ["blur", "refraction-path blur (px)", "3"],
  ["fallbackBlur", "blur where refraction is unsupported", "14"],
  ["refract", "boolean", "true"],
  ["interactive", "lift on hover", "false"],
  ["morph", "spring width/height on size change", "false"],
];

export function Primitives() {
  return (
    <div className="prose-page">
      <PageHead eyebrow="Foundation" title="The Glass primitive">
        Every Glacé component is built on one surface: <code>&lt;Glass&gt;</code>. It bends the
        backdrop at its edges like real glass, and you can wrap it around anything.
      </PageHead>

      <Section title="Glass lab" sub="Drag the card over the chart and tune the optics. Refraction renders in Chromium; other browsers fall back to a frosted blur.">
        <GlassLab />
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
