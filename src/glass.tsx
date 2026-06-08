import { useEffect, useId, useState } from "react";

/**
 * True Apple-style "liquid glass" refraction.
 *
 * Instead of leaning on a big backdrop blur, we bend the backdrop at the rim
 * with an SVG displacement map — the Aave / kube.io technique. A generated
 * rounded-rect map encodes horizontal bend in R and vertical bend in G (128 =
 * neutral, ramped at the edges); feDisplacementMap pushes each backdrop pixel
 * accordingly, so the edges magnify like real glass while a low blur keeps the
 * surface soft.
 *
 * `url()` filters inside backdrop-filter are Chromium-only, so we feature-detect
 * and only opt in there. Everywhere else the CSS falls back to a plain frosted
 * blur, which still looks good.
 */

const SCALE = 0.05; // displacement depth as a fraction of the toast box

/** Build a rounded-rect rim displacement map as a data URL. */
function makeGlassMap(w = 360, h = 120, radius = 22, edge = 20): string | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  const d = img.data;

  const sdf = (px: number, py: number) => {
    const qx = Math.abs(px - w / 2) - (w / 2 - radius);
    const qy = Math.abs(py - h / 2) - (h / 2 - radius);
    const ax = Math.max(qx, 0);
    const ay = Math.max(qy, 0);
    return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - radius;
  };

  const vecs = new Float32Array(w * h * 2);
  let maxMag = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dist = -sdf(x, y); // >0 inside
      const t = Math.max(0, 1 - dist / edge); // 1 at rim → 0 toward center
      const mag = t * t; // glassy falloff
      const nx = w / 2 - x;
      const ny = h / 2 - y;
      const len = Math.hypot(nx, ny) || 1;
      const i = (y * w + x) * 2;
      vecs[i] = (nx / len) * mag;
      vecs[i + 1] = (ny / len) * mag;
      maxMag = Math.max(maxMag, Math.abs(vecs[i]), Math.abs(vecs[i + 1]));
    }
  }
  const k = maxMag ? 127 / maxMag : 0;
  for (let p = 0; p < w * h; p++) {
    const i4 = p * 4;
    const i2 = p * 2;
    d[i4] = 128 + vecs[i2] * k; // R = x-displacement
    d[i4 + 1] = 128 + vecs[i2 + 1] * k; // G = y-displacement
    d[i4 + 2] = 128; // B neutral
    d[i4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function supportsRefraction(): boolean {
  if (typeof window === "undefined" || !window.CSS?.supports) return false;
  return (
    CSS.supports("backdrop-filter", 'url("#g")') ||
    CSS.supports("-webkit-backdrop-filter", 'url("#g")')
  );
}

/**
 * Injects the displacement filter and reports the filter id back so the Toaster
 * can flip on the refraction CSS. Renders nothing where unsupported.
 */
export function GlassFilter({ onReady }: { onReady: (id: string | null) => void }) {
  const rawId = useId();
  const id = `glace-glass-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [map, setMap] = useState<string | null>(null);

  useEffect(() => {
    if (!supportsRefraction()) {
      onReady(null);
      return;
    }
    const m = makeGlassMap();
    if (!m) {
      onReady(null);
      return;
    }
    setMap(m);
    onReady(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!map) return null;

  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter
          id={id}
          primitiveUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x="-0.1"
          y="-0.2"
          width="1.2"
          height="1.4"
        >
          <feImage
            href={map}
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="none"
            result="map"
          />
          {/* soften the backdrop a hair, then bend it at the rim */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.004" result="src" />
          <feDisplacementMap
            in="src"
            in2="map"
            scale={SCALE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
