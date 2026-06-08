/** Small reusable demo controls (slider / segmented / toggle), styled with the
 *  existing .lab-slider / .seg / .pg-toggle classes. */

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="lab-slider">
      <span className="lab-slider-row">
        <span>{label}</span>
        <span className="lab-slider-val">{value}{suffix}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="ctrl-field">
      <span className="ctrl-label">{label}</span>
      <div className="seg">
        {options.map((o) => (
          <button key={o} data-on={value === o} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button className="pg-toggle" data-on={on} onClick={onClick}>
      <span className="dot" />
      {label}
    </button>
  );
}
