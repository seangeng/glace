import { useEffect, useState } from "react";

/**
 * Shared "liquid glass" foundation for every Glacé surface.
 *
 * One global SVG displacement filter is mounted lazily (the first time any glass
 * element renders) and reused everywhere. It bends the backdrop at the rim — the
 * Aave / rizroze technique: a canvas map (R = x-bend, B = y-bend, neutral
 * center) drives a 3-pass chromatic feDisplacementMap. `url()` filters in
 * backdrop-filter are Chromium-only, so we feature-detect; elsewhere callers
 * fall back to a plain frosted blur.
 */

const FILTER_ID = "glace-glass";
const SCALE = 34;
const ABERRATION = 3;
const REF_W = 356;
const REF_H = 84;
const REF_RADIUS = 16;

// undefined = not yet attempted, null = unsupported, string = mounted filter id
let cached: string | null | undefined;

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

  ctx.fillStyle = "rgb(128,128,128)";
  ctx.fillRect(0, 0, cw, ch);

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

/** Mount the global filter once; returns its id, or null if unsupported. */
function ensureGlassFilter(): string | null {
  if (cached !== undefined) return cached;
  if (typeof document === "undefined" || !supportsRefraction()) {
    cached = null;
    return null;
  }
  const map = buildMap(REF_W, REF_H, REF_RADIUS, SCALE);
  if (!map) {
    cached = null;
    return null;
  }
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  wrap.innerHTML = `<svg><defs><filter id="${FILTER_ID}" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
<feImage href="${map}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>
<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${-(SCALE + ABERRATION)}" result="r"/>
<feColorMatrix in="r" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="rc"/>
<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${-SCALE}" result="g"/>
<feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="gc"/>
<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${-(SCALE - ABERRATION)}" result="b"/>
<feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="bc"/>
<feBlend in="rc" in2="gc" mode="screen" result="rg"/>
<feBlend in="rg" in2="bc" mode="screen"/>
</filter></defs></svg>`;
  document.body.appendChild(wrap);
  cached = FILTER_ID;
  return FILTER_ID;
}

/**
 * Returns the global glass filter id once mounted (client-side), or null if the
 * browser can't refract. SSR-safe: null on first render, resolves after mount.
 */
export function useGlassFilter(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(ensureGlassFilter());
  }, []);
  return id;
}

/** Build the `backdrop-filter` value for a glass surface. */
export function glassBackdrop(filterId: string | null, blur: number, fallbackBlur: number): string {
  return filterId
    ? `url(#${filterId}) blur(${blur}px) saturate(180%) brightness(1.04)`
    : `blur(${fallbackBlur}px) saturate(180%)`;
}
