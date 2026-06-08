import { useEffect, useState } from "react";

/**
 * The single "liquid glass" refraction engine for the whole kit.
 *
 * A displacement map is generated at an element's ACTUAL size (so the rim stays
 * the right thickness at any aspect ratio — the Aave / rizroze technique: a
 * canvas map with R = x-bend, B = y-bend, neutral center, driving a 3-pass
 * chromatic feDisplacementMap). Maps + their SVG filters are cached by size, so
 * every same-sized surface (all md buttons, all 356px toasts…) shares one
 * filter — no per-element duplication. `url()` filters in backdrop-filter are
 * Chromium-only, so we feature-detect; elsewhere callers fall back to blur.
 */

const REF_W = 356;
const REF_H = 84;
const REF_RADIUS = 16;
const BASE_SCALE = 18; // px of edge displacement (clamped to the element)
const ABERR = 1.0; // chromatic split
const MAX_DIM = 1400; // clamp generated canvas so wide surfaces stay cheap

let supportCache: boolean | undefined;
export function supportsRefraction(): boolean {
  if (supportCache !== undefined) return supportCache;
  if (typeof window === "undefined" || !window.CSS?.supports) return (supportCache = false);
  supportCache =
    CSS.supports("backdrop-filter", 'url("#g")') ||
    CSS.supports("-webkit-backdrop-filter", 'url("#g")');
  return supportCache;
}

/** Generate a rounded-rect displacement map (data URL) for a w×h surface. */
export function buildMap(w: number, h: number, radius: number, scale: number): string | null {
  if (typeof document === "undefined") return null;
  // clamp generation size — a 2000px nav is generated at 1400 and stretched
  w = Math.min(Math.max(Math.round(w), 1), MAX_DIM);
  h = Math.min(Math.max(Math.round(h), 1), MAX_DIM);
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

  try {
    return cv.toDataURL();
  } catch {
    return null;
  }
}

function filterMarkup(id: string, map: string, scale: number, aberr: number): string {
  return `<svg style="position:absolute;width:0;height:0"><defs>
<filter id="${id}" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
<feImage href="${map}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>
<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${-(scale + aberr)}" result="r"/>
<feColorMatrix in="r" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="rc"/>
<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${-scale}" result="g"/>
<feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="gc"/>
<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${-(scale - aberr)}" result="b"/>
<feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="bc"/>
<feBlend in="rc" in2="gc" mode="screen" result="rg"/>
<feBlend in="rg" in2="bc" mode="screen"/>
</filter></defs></svg>`;
}

// Cache mounted filters by size+shape so same-sized surfaces share one filter.
const filterCache = new Map<string, string>();
let uid = 0;

function scaleFor(w: number, h: number): number {
  return Math.min(BASE_SCALE, Math.max(8, Math.min(w, h) * 0.4));
}

/** Mount (or reuse) a filter for a given size; returns its id or null. */
function getFilter(w: number, h: number, radius: number): string | null {
  if (typeof document === "undefined" || !supportsRefraction()) return null;
  const scale = scaleFor(w, h);
  const key = `${w}x${h}r${radius}s${scale.toFixed(2)}`;
  const hit = filterCache.get(key);
  if (hit) return hit;
  const map = buildMap(w, h, radius, scale);
  if (!map) return null;
  const id = `glace-rx-${++uid}`;
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  wrap.innerHTML = filterMarkup(id, map, scale, ABERR);
  document.body.appendChild(wrap);
  filterCache.set(key, id);
  return id;
}

export interface RefractionOptions {
  radius?: number;
  refract?: boolean;
  blur?: number;
  fallbackBlur?: number;
  brightness?: number;
}

/**
 * Per-element refraction. Measures the element, mounts/reuses a size-keyed
 * filter, and returns the `backdrop-filter` value + whether refraction is on.
 * Regenerates on resize (debounced) and retries once after layout for elements
 * that mount at zero size (late fonts, hidden ancestors).
 */
export function useGlassRefraction(
  ref: { current: HTMLElement | null },
  opts: RefractionOptions = {},
): { backdrop: string; refracting: boolean } {
  const { radius = 16, refract = true, blur = 2.5, fallbackBlur = 14, brightness = 1.03 } = opts;
  const [state, setState] = useState({
    backdrop: `blur(${fallbackBlur}px) saturate(180%)`,
    refracting: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!refract || !el || !supportsRefraction()) return;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastKey = "";

    const render = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return; // not laid out yet — ResizeObserver / rAF will retry
      const key = `${w}x${h}r${radius}`;
      if (key === lastKey) return;
      lastKey = key;
      const id = getFilter(w, h, radius);
      if (!id) return;
      setState({
        backdrop: `url(#${id}) blur(${blur}px) saturate(180%) brightness(${brightness})`,
        refracting: true,
      });
    };

    render();
    raf = requestAnimationFrame(render); // catch post-layout / late-font sizing
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(render, 120);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refract, radius, blur, fallbackBlur, brightness]);

  return state;
}

/**
 * Convenience: a reference-sized filter id (or null if unsupported), for when
 * you want to apply `url(#id)` to your own element by hand.
 */
export function useGlassFilter(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(getFilter(REF_W, REF_H, REF_RADIUS));
  }, []);
  return id;
}
