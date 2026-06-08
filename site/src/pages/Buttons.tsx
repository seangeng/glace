import { useState } from "react";
import { GlassButton, toast, type GlassButtonProps } from "glaceui";
import { CodeBlock } from "../CodeBlock";
import { MorphButton } from "../LiquidResize";
import { ButtonPlayground } from "../Playgrounds";
import { ShuffleStage } from "../ShuffleStage";
import { PageHead, PropsTable, Section, type PropRow } from "../ui";

/** A demo button that morphs to a new label on each click. */
function TapButton({ a, b, ...rest }: { a: string; b: string } & GlassButtonProps) {
  const [on, setOn] = useState(false);
  return (
    <GlassButton
      morph
      {...rest}
      onClick={() => {
        setOn((v) => !v);
        toast(on ? a : b);
      }}
    >
      {on ? b : a}
    </GlassButton>
  );
}

const USAGE = `import { GlassButton } from "glaceui";
import "glaceui/styles.css";

<GlassButton onClick={() => toast("Nice")}>Glass button</GlassButton>
<GlassButton size="lg" tone="light">Large light</GlassButton>

// morph: width springs smoothly when the label changes
<GlassButton morph onClick={...}>{open ? "Collapse" : "Expand"}</GlassButton>`;

const PROPS: PropRow[] = [
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

      <Section title="Try it" sub="Live button — drive the props with the controls, shuffle the backdrop.">
        <ButtonPlayground />
      </Section>

      <Section title="Sizes" sub="Three sizes, pill-shaped. Click one — the label morphs. Shuffle the backdrop to see the glass refract it.">
        <ShuffleStage height={170} center>
          <TapButton size="sm" a="Small" b="Tapped" />
          <TapButton size="md" a="Medium" b="Nice — pressed it" />
          <TapButton size="lg" a="Large" b="Done" />
        </ShuffleStage>
      </Section>

      <Section title="Tones" sub="Dark by default; light for bright backgrounds. Click to morph.">
        <ShuffleStage height={170} center>
          <TapButton tone="dark" a="Dark" b="Looking good" />
          <TapButton tone="light" a="Light" b="Bright" />
        </ShuffleStage>
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
