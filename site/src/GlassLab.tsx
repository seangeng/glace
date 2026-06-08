import { useEffect, useId, useRef, useState } from "react";
import { buildMap, supportsRefraction, PROFILES, type GlassProfile } from "glaceui";

const SHAPES: GlassProfile[] = ["convex", "concave", "bevel"];

/**
 * Glass Lab — a draggable glass card over a busy test chart, so the edge
 * refraction is actually visible. Generates its displacement map with the
 * package's own `buildMap` (so the lab always matches what ships) and drives a
 * tunable 3-pass chromatic feDisplacementMap via backdrop-filter.
 */

const CARD_W = 300;
const CARD_H = 150;

export function GlassLab() {
  const rawId = useId();
  const fid = `lab-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const stage = useRef<HTMLDivElement>(null);

  const [refract, setRefract] = useState(false);
  const [scale, setScale] = useState(80);
  const [aberration, setAberration] = useState(6);
  const [blur, setBlur] = useState(3);
  const [radius, setRadius] = useState(28);
  const [bezelPct, setBezelPct] = useState(16);
  const [profile, setProfile] = useState<GlassProfile>("convex");
  const dir = PROFILES[profile].dir;
  const [map, setMap] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    setRefract(supportsRefraction());
  }, []);

  // regenerate the map whenever shape/strength changes
  useEffect(() => {
    const m = buildMap(CARD_W, CARD_H, radius, scale, bezelPct / 100, PROFILES[profile].sharpness);
    if (m) setMap(m);
  }, [radius, scale, bezelPct, profile]);

  function onDown(e: React.PointerEvent) {
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!drag.current || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - drag.current.dx), Math.max(0, r.width - CARD_W));
    const y = Math.min(Math.max(0, e.clientY - drag.current.dy), Math.max(0, r.height - CARD_H));
    setPos({ x, y });
  }
  function onUp() {
    drag.current = null;
  }

  const filterCss = refract && map ? `url(#${fid}) blur(${blur}px) saturate(180%)` : `blur(${blur + 8}px) saturate(170%)`;

  return (
    <div className="lab">
      {/* the filter */}
      {map && (
        <svg aria-hidden style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id={fid} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feImage href={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
              <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={dir * (scale + aberration)} result="r" />
              <feColorMatrix in="r" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rc" />
              <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={dir * scale} result="g" />
              <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gc" />
              <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={dir * (scale - aberration)} result="b" />
              <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bc" />
              <feBlend in="rc" in2="gc" mode="screen" result="rg" />
              <feBlend in="rg" in2="bc" mode="screen" />
            </filter>
          </defs>
        </svg>
      )}

      {/* busy test chart */}
      <div ref={stage} className="lab-stage" aria-hidden>
        <div className="lab-chart" />
        <div className="lab-chart-text">GLASS · 0123456789 · REFRACTION · ABCDEFGH · GLACÉ</div>

        {/* the draggable glass card */}
        <div
          className="lab-card"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            width: CARD_W,
            height: CARD_H,
            // left/top, not transform — a transformed element rides a cached
            // backdrop-filter; left/top re-samples so the lens stays live.
            left: pos.x,
            top: pos.y,
            borderRadius: radius,
            WebkitBackdropFilter: filterCss,
            backdropFilter: filterCss,
          }}
        >
          <div className="lab-card-inner">
            <div className="lab-card-title">Drag me over the grid</div>
            <div className="lab-card-sub">Watch the lines bend at the edges.</div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="lab-controls">
        <Slider label="Refraction" value={scale} min={0} max={180} onChange={setScale} suffix="px" />
        <Slider label="Aberration" value={aberration} min={0} max={30} onChange={setAberration} suffix="px" />
        <Slider label="Blur" value={blur} min={0} max={16} onChange={setBlur} suffix="px" />
        <Slider label="Radius" value={radius} min={8} max={64} onChange={setRadius} suffix="px" />
        <Slider label="Bezel" value={bezelPct} min={4} max={40} onChange={setBezelPct} suffix="%" />
      </div>
      <div className="lab-shapes">
        <span className="lab-shapes-label">Profile</span>
        <div className="seg">
          {SHAPES.map((s) => (
            <button key={s} data-on={profile === s} onClick={() => setProfile(s)}>{s}</button>
          ))}
        </div>
      </div>
      {!refract && (
        <p className="lab-note">
          Your browser doesn't support <code>url()</code> filters in <code>backdrop-filter</code> — showing
          the frosted-blur fallback. Open this in Chrome, Edge, or Arc to see the refraction.
        </p>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="lab-slider">
      <span className="lab-slider-row">
        <span>{label}</span>
        <span className="lab-slider-val">{value}{suffix}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
