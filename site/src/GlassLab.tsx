import { useEffect, useId, useRef, useState } from "react";

/**
 * Glass Lab — a draggable glass card over a busy test chart, so the edge
 * refraction is actually visible. Uses the rizroze/shuding technique: a
 * canvas-generated displacement map (R = x-bend, B = y-bend, neutral 128 in the
 * center) drives a 3-pass chromatic feDisplacementMap, applied via
 * backdrop-filter. userSpaceOnUse → scale is in real pixels.
 */

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Build the displacement map data URL for a card of w×h. */
function buildMap(w: number, h: number, radius: number, scale: number) {
  if (typeof document === "undefined") return null;
  const pad = Math.ceil(Math.max(Math.abs(scale) * 0.5, 24));
  const cw = w + pad * 2;
  const ch = h + pad * 2;
  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  // neutral everywhere = no displacement outside the card
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.fillRect(0, 0, cw, ch);

  // build a 2-axis field inside the rounded rect: R = horizontal, B = vertical
  ctx.save();
  roundRectPath(ctx, pad, pad, w, h, radius);
  ctx.clip();
  ctx.fillStyle = "#000";
  ctx.fillRect(pad, pad, w, h);
  let g = ctx.createLinearGradient(pad + w, 0, pad, 0);
  g.addColorStop(0, "#ff0000");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g;
  ctx.fillRect(pad, pad, w, h);
  ctx.globalCompositeOperation = "difference";
  g = ctx.createLinearGradient(0, pad, 0, pad + h);
  g.addColorStop(0, "#0000ff");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g;
  ctx.fillRect(pad, pad, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();

  // neutralize the center with a blurred gray inset → leaves a refracting rim
  const border = Math.min(w, h) * 0.11;
  ctx.filter = `blur(${Math.round(radius * 0.7)}px)`;
  ctx.fillStyle = "hsla(0,0%,50%,0.92)";
  roundRectPath(ctx, pad + border, pad + border, w - 2 * border, h - 2 * border, radius);
  ctx.fill();
  ctx.filter = "none";

  return { url: cv.toDataURL(), pad };
}

function supportsRefraction() {
  if (typeof window === "undefined" || !window.CSS?.supports) return false;
  return (
    CSS.supports("backdrop-filter", 'url("#g")') ||
    CSS.supports("-webkit-backdrop-filter", 'url("#g")')
  );
}

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
  const [map, setMap] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    setRefract(supportsRefraction());
  }, []);

  // regenerate the map whenever shape/strength changes
  useEffect(() => {
    const m = buildMap(CARD_W, CARD_H, radius, scale);
    if (m) setMap(m.url);
  }, [radius, scale]);

  function onDown(e: React.PointerEvent) {
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!drag.current || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - drag.current.dx), r.width - CARD_W);
    const y = Math.min(Math.max(0, e.clientY - drag.current.dy), r.height - CARD_H);
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
              <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={-(scale + aberration)} result="r" />
              <feColorMatrix in="r" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rc" />
              <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={-scale} result="g" />
              <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gc" />
              <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={-(scale - aberration)} result="b" />
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
            transform: `translate(${pos.x}px, ${pos.y}px)`,
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
