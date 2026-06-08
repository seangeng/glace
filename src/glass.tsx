import { useEffect, useId, useState } from "react";

/**
 * True Apple-style "liquid glass" refraction for the toasts.
 *
 * Rather than leaning on a big backdrop blur, we bend the backdrop at the rim
 * with an SVG displacement map — the technique behind Aave's glass (and the
 * shuding / rdev / rizroze implementations). A canvas builds a map where the
 * red channel encodes horizontal bend and the blue channel vertical bend (128 =
 * neutral); the center is neutralised so only the edge band refracts. Three
 * displacement passes at slightly different scales add a faint chromatic fringe.
 *
 * Units are userSpaceOnUse, so `scale` is in real pixels. `url()` filters inside
 * backdrop-filter are Chromium-only, so we feature-detect and only opt in there;
 * everywhere else the CSS falls back to a plain frosted blur.
 */

const SCALE = 34; // px of edge displacement
const ABERRATION = 3; // px split between R/G/B passes
const REF_W = 356;
const REF_H = 84;
const REF_RADIUS = 16;

function buildMap(w: number, h: number, radius: number, scale: number): string | null {
  if (typeof document === "undefined") return null;
  const pad = Math.ceil(Math.max(scale * 0.5, 24));
  const cw = w + pad * 2;
  const ch = h + pad * 2;
  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d");
  if (!ctx || !ctx.roundRect) return null;

  ctx.fillStyle = "rgb(128,128,128)"; // neutral = no displacement
  ctx.fillRect(0, 0, cw, ch);

  // 2-axis field inside the rounded rect: R = horizontal, B = vertical
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, pad, w, h, radius);
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

  // neutralise the center → leaves a refracting rim band
  const border = Math.min(w, h) * 0.16;
  ctx.filter = `blur(${Math.round(radius * 0.7)}px)`;
  ctx.fillStyle = "hsla(0,0%,50%,0.92)";
  ctx.beginPath();
  ctx.roundRect(pad + border, pad + border, w - 2 * border, h - 2 * border, radius);
  ctx.fill();
  ctx.filter = "none";

  return cv.toDataURL();
}

function supportsRefraction(): boolean {
  if (typeof window === "undefined" || !window.CSS?.supports) return false;
  return (
    CSS.supports("backdrop-filter", 'url("#g")') ||
    CSS.supports("-webkit-backdrop-filter", 'url("#g")')
  );
}

export function GlassFilter({ onReady }: { onReady: (id: string | null) => void }) {
  const rawId = useId();
  const id = `glace-glass-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [map, setMap] = useState<string | null>(null);

  useEffect(() => {
    if (!supportsRefraction()) {
      onReady(null);
      return;
    }
    const m = buildMap(REF_W, REF_H, REF_RADIUS, SCALE);
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
    <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feImage href={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={-(SCALE + ABERRATION)} result="r" />
          <feColorMatrix in="r" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rc" />
          <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={-SCALE} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gc" />
          <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={-(SCALE - ABERRATION)} result="b" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bc" />
          <feBlend in="rc" in2="gc" mode="screen" result="rg" />
          <feBlend in="rg" in2="bc" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
