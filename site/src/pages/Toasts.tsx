import { CodeBlock } from "../CodeBlock";
import { Playground } from "../Playground";
import { PageHead, PropsTable, Section } from "../ui";
import { useDocs } from "../Layout";

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

toast.custom(<MyCard />);   // render anything
toast.dismiss(id);          // or toast.dismiss() for all`;

const THEMING = `/* every color, blur, radius is a CSS variable —
   maps cleanly onto shadcn tokens */
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
  ["haptics", "boolean | HapticsOptions", "true"],
];

export function Toasts() {
  const { config, setConfig } = useDocs();
  return (
    <div className="prose-page">
      <PageHead eyebrow="Component" title="Toasts">
        A sonner-style notifier in glass — springy stacking, swipe-to-dismiss, promise and
        action support, and the same edge refraction as the rest of the kit.
      </PageHead>

      <Section title="Playground" sub="Adjust the <Toaster /> and fire some toasts. Runs the real package.">
        <Playground config={config} setConfig={setConfig} />
      </Section>

      <Section title="Quick start" sub="Drop one <Toaster /> near your root, then call toast() from anywhere.">
        <CodeBlock code={QUICKSTART} />
      </Section>

      <Section title="The toast function">
        <CodeBlock code={API} />
      </Section>

      <Section title="<Toaster /> props">
        <PropsTable rows={PROPS} />
      </Section>

      <Section title="Theming" sub="Driven entirely by CSS variables on [data-glace-toaster].">
        <CodeBlock code={THEMING} lang="css" />
      </Section>

      <Section title="Haptics" sub="Uses the Vibration API where available — a progressive enhancement that never throws.">
        <CodeBlock code={HAPTICS} />
      </Section>
    </div>
  );
}
