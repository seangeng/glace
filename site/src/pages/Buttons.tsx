import { GlassButton, toast } from "glaceui";
import { CodeBlock } from "../CodeBlock";
import { MorphButton } from "../LiquidResize";
import { PageHead, PropsTable, Section, Stage } from "../ui";

const USAGE = `import { GlassButton } from "glaceui";
import "glaceui/styles.css";

<GlassButton onClick={() => toast("Nice")}>Glass button</GlassButton>
<GlassButton size="lg" tone="light">Large light</GlassButton>

// morph: width springs smoothly when the label changes
<GlassButton morph onClick={...}>{open ? "Collapse" : "Expand"}</GlassButton>`;

const PROPS: [string, string, string][] = [
  ["tone", "light · dark", "dark"],
  ["size", "sm · md · lg", "md"],
  ["refract", "false · true · number (px)", "true"],
  ["aberration", "chromatic split (px)", "1"],
  ["bezel", "rim thickness (fraction)", "0.16"],
  ["saturation", "backdrop saturation (%)", "180"],
  ["morph", "spring width on label change", "false"],
  ["…rest", "all <button> props", "—"],
];

export function Buttons() {
  return (
    <div className="prose-page">
      <PageHead eyebrow="Component" title="Buttons">
        A frosted-glass button built on the <code>&lt;Glass&gt;</code> surface — real edge
        refraction, a specular sheen that sweeps as you hover, and a press that tips the glass
        back in 3D and sinks the shadow in. Hold one down to feel it.
      </PageHead>

      <Section title="Sizes" sub="Three sizes, pill-shaped.">
        <Stage className="stage--center">
          <GlassButton size="sm" onClick={() => toast("Small")}>Small</GlassButton>
          <GlassButton size="md" onClick={() => toast("Medium")}>Medium</GlassButton>
          <GlassButton size="lg" onClick={() => toast("Large")}>Large</GlassButton>
        </Stage>
      </Section>

      <Section title="Tones" sub="Dark by default; light for bright backgrounds.">
        <Stage className="stage--center">
          <GlassButton tone="dark" onClick={() => toast("Dark glass")}>Dark</GlassButton>
          <GlassButton tone="light" onClick={() => toast("Light glass")}>Light</GlassButton>
        </Stage>
      </Section>

      <Section title="Morph" sub="With morph, the width springs smoothly when the label changes — size, never scale, so the rim never distorts.">
        <MorphButton />
      </Section>

      <Section title="Usage">
        <CodeBlock code={USAGE} />
      </Section>

      <Section title="<GlassButton /> props">
        <PropsTable rows={PROPS} />
      </Section>
    </div>
  );
}
