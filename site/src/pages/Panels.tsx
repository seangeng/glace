import { GlassButton, GlassCard, toast } from "glaceui";
import { CodeBlock } from "../CodeBlock";
import { DragArea, Draggable } from "../Draggable";
import { PageHead, PropsTable, Section, Stage } from "../ui";

const PROFILES = ["convex", "concave", "bevel"] as const;

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
  ["sheen", "specular sweep on hover/press", "false"],
  ["refract", "false · true · number (px)", "true"],
  ["profile", "convex · concave · bevel", "convex"],
  ["bezel", "rim thickness (fraction)", "0.16"],
  ["…rest", "all div props (or via `as`)", "—"],
];

export function Panels() {
  return (
    <div className="prose-page">
      <PageHead eyebrow="Component" title="Panels">
        A padded glass container. Drop anything inside — it refracts the backdrop at its edges,
        catches light along the rim, and lifts on hover when <code>interactive</code>.
      </PageHead>

      <Section title="Cards" sub="Dark and light tones — drag them over the grid to watch the glass refract.">
        <DragArea height={400}>
          <Draggable x={24} y={48}>
            <GlassCard sheen className="demo-card" style={{ width: 300 }}>
              <div className="demo-card-eyebrow">sheen</div>
              <div className="demo-card-title">Wrap anything</div>
              <p>A padded frosted surface. Hover or grab it — the sheen sweeps across.</p>
              <GlassButton size="sm" onClick={() => toast("From inside a card")}>Action</GlassButton>
            </GlassCard>
          </Draggable>
          <Draggable x={372} y={150}>
            <GlassCard tone="light" sheen className="demo-card" style={{ width: 270 }}>
              <div className="demo-card-eyebrow">tone="light"</div>
              <div className="demo-card-title">Light glass</div>
              <p>The same surface, tuned for bright backgrounds.</p>
            </GlassCard>
          </Draggable>
        </DragArea>
      </Section>

      <Section title="Edge profiles" sub="The lens shape changes how the rim bends the backdrop — convex magnifies outward, concave caves in, bevel is a crisp edge. (Aave's height-profile idea, as a prop.)">
        <Stage className="stage--center">
          {PROFILES.map((p) => (
            <GlassCard key={p} profile={p} sheen className="profile-card">
              <div className="demo-card-eyebrow">profile</div>
              <div className="demo-card-title">{p}</div>
            </GlassCard>
          ))}
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
