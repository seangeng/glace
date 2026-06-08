import { GlassButton, GlassCard, toast } from "glaceui";
import { CodeBlock } from "../CodeBlock";
import { PageHead, PropsTable, Section, Stage } from "../ui";

const USAGE = `import { GlassCard, GlassButton } from "glaceui";
import "glaceui/styles.css";

<GlassCard tone="dark" interactive>
  <h3>Pricing</h3>
  <p>Wrap anything in real glass.</p>
  <GlassButton size="sm">Upgrade</GlassButton>
</GlassCard>`;

const PROPS: [string, string, string][] = [
  ["tone", "light · dark", "dark"],
  ["radius", "corner radius (px)", "18"],
  ["interactive", "lift on hover", "false"],
  ["refract", "boolean", "true"],
  ["…rest", "all div props (or via `as`)", "—"],
];

export function Panels() {
  return (
    <div className="prose-page">
      <PageHead eyebrow="Component" title="Panels">
        A padded glass container. Drop anything inside — it refracts the backdrop at its edges,
        catches light along the rim, and lifts on hover when <code>interactive</code>.
      </PageHead>

      <Section title="Cards" sub="Dark and light tones, with an interactive lift.">
        <Stage>
          <div className="panels-grid">
            <GlassCard interactive className="demo-card">
              <div className="demo-card-eyebrow">Interactive</div>
              <div className="demo-card-title">Wrap anything</div>
              <p>A padded frosted surface. Hover to lift, press to settle.</p>
              <GlassButton size="sm" onClick={() => toast("From inside a card")}>Action</GlassButton>
            </GlassCard>
            <GlassCard tone="light" className="demo-card">
              <div className="demo-card-eyebrow">tone="light"</div>
              <div className="demo-card-title">Light glass</div>
              <p>The same surface, tuned for bright backgrounds.</p>
            </GlassCard>
          </div>
        </Stage>
      </Section>

      <Section title="Usage">
        <CodeBlock code={USAGE} />
      </Section>

      <Section title="<GlassCard /> props" sub="GlassCard is <Glass> with card defaults — it takes every Glass prop.">
        <PropsTable rows={PROPS} />
      </Section>
    </div>
  );
}
