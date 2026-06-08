import { toast, type Position, type Theme } from "glaceui";
import { Select } from "./Select";

export interface ToasterConfig {
  position: Position;
  theme: Theme;
  richColors: boolean;
  closeButton: boolean;
  expand: boolean;
  haptics: boolean;
}

const POSITIONS: Position[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const THEMES: Theme[] = ["light", "dark", "system"];

export function Playground({
  config,
  setConfig,
}: {
  config: ToasterConfig;
  setConfig: (c: ToasterConfig) => void;
}) {
  const set = <K extends keyof ToasterConfig>(k: K, v: ToasterConfig[K]) =>
    setConfig({ ...config, [k]: v });

  return (
    <div className="glass panel playground">
      <div className="pg-controls">
        <Field label="position">
          <Select
            ariaLabel="position"
            value={config.position}
            onValueChange={(v) => set("position", v as Position)}
            options={POSITIONS}
          />
        </Field>
        <Field label="theme">
          <div className="seg">
            {THEMES.map((t) => (
              <button key={t} data-on={config.theme === t} onClick={() => set("theme", t)}>
                {t}
              </button>
            ))}
          </div>
        </Field>
        <div className="pg-toggles">
          <Toggle label="richColors" on={config.richColors} onClick={() => set("richColors", !config.richColors)} />
          <Toggle label="closeButton" on={config.closeButton} onClick={() => set("closeButton", !config.closeButton)} />
          <Toggle label="expand" on={config.expand} onClick={() => set("expand", !config.expand)} />
          <Toggle label="haptics" on={config.haptics} onClick={() => set("haptics", !config.haptics)} />
        </div>
      </div>

      <div className="pg-fire">
        <button onClick={() => toast("Here's a plain glass message")}>default</button>
        <button onClick={() => toast.success("Saved to your library")}>success</button>
        <button onClick={() => toast.error("Couldn't reach the server")}>error</button>
        <button onClick={() => toast.warning("Storage is almost full")}>warning</button>
        <button onClick={() => toast.info("A new version is available")}>info</button>
        <button
          onClick={() =>
            toast("Invite sent", {
              description: "alex@acme.com will get an email shortly.",
              action: { label: "Undo", onClick: () => toast.success("Invite revoked") },
            })
          }
        >
          action + description
        </button>
        <button
          onClick={() =>
            toast.promise(new Promise((res) => setTimeout(res, 2000)), {
              loading: "Uploading…",
              success: "Uploaded 3 files",
              error: "Upload failed",
            })
          }
        >
          promise
        </button>
        <button onClick={() => toast.dismiss()}>dismiss all</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="pg-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button className="pg-toggle" data-on={on} onClick={onClick}>
      <span className="dot" />
      {label}
    </button>
  );
}
