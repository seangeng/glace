import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { useGlassRefraction, type GlassTuning } from "./glass";

function cx(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(" ");
}

const useIso = typeof document !== "undefined" ? useLayoutEffect : useEffect;

// On-screen size morph → decisive deceleration, no overshoot and no flat-tail
// hang (ease-out-cubic settles cleanly where quint creeps at the end).
const MORPH_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
// Duration scales with how far it travels — short hops snap, long ones take
// their time. (Course: match duration to distance.)
const morphDuration = (dist: number) => Math.round(Math.min(340, Math.max(130, dist * 2.6)));

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Smoothly morph an element's width when its CONTENT changes. A CSS width
 * transition can't do this (the `width` property stays `auto`, so nothing
 * fires), so we measure the new natural width and animate to it with WAAPI —
 * size, never scale, so the glass rim never distorts.
 */
function useMorphWidth(ref: { current: HTMLElement | null }, enabled: boolean) {
  const last = useRef<number | null>(null);
  useIso(() => {
    const el = ref.current;
    if (!enabled || !el) {
      last.current = null;
      return;
    }
    const restore = el.style.width;
    el.style.width = "auto";
    const target = el.getBoundingClientRect().width;
    el.style.width = restore;
    const prev = last.current;
    last.current = target;
    const dist = prev == null ? 0 : Math.abs(prev - target);
    if (prev == null || dist < 1 || prefersReducedMotion()) return;
    const anim = el.animate(
      [{ width: `${prev}px` }, { width: `${target}px` }],
      { duration: morphDuration(dist), easing: MORPH_EASE },
    );
    return () => anim.cancel();
  });
}

function assignRef<T>(ref: React.ForwardedRef<T>, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

export type GlassTone = "light" | "dark";

export interface GlassProps extends React.HTMLAttributes<HTMLElement>, GlassTuning {
  /** Element/component to render. Defaults to `div`. */
  as?: React.ElementType;
  tone?: GlassTone;
  /** `false` off · `true` auto · a number sets the edge displacement in px. */
  refract?: boolean | number;
  /** Lift slightly on hover. */
  interactive?: boolean;
  /** Smoothly morph width (spring) when the size changes. */
  morph?: boolean;
  /** A specular sheen that sweeps across on hover/press. */
  sheen?: boolean;
}

/**
 * A reusable frosted-glass surface — the foundation every Glacé component is
 * built on. The refraction is generated at this element's real size, so the rim
 * stays crisp at any width/height. Renders any element via `as`.
 */
export const Glass = forwardRef<HTMLElement, GlassProps>(function Glass(
  {
    as,
    tone = "dark",
    radius = 16,
    blur = 2.5,
    fallbackBlur = 14,
    refract = true,
    aberration,
    bezel,
    profile,
    saturation,
    interactive = false,
    morph = false,
    sheen = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const inner = useRef<HTMLElement | null>(null);
  const { backdrop, refracting } = useGlassRefraction(inner, {
    radius,
    refract: refract !== false,
    scale: typeof refract === "number" ? refract : undefined,
    aberration,
    bezel,
    profile,
    saturation,
    blur,
    fallbackBlur,
  });
  const Tag: React.ElementType = as ?? "div";

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        inner.current = node;
        assignRef(ref, node);
      }}
      className={cx(
        "glace-glass",
        interactive && "glace-glass--interactive",
        morph && "glace-glass--morph",
        sheen && "glace-glass--sheen",
        className,
      )}
      data-tone={tone}
      data-refract={refracting ? "" : undefined}
      style={{
        borderRadius: radius,
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
        ...style,
      }}
      {...rest}
    >
      {sheen && <span className="glace-sheen" aria-hidden="true" />}
      {children}
    </Tag>
  );
});

export interface GlassCardProps extends GlassProps {}

/** A padded glass container. */
export const GlassCard = forwardRef<HTMLElement, GlassCardProps>(function GlassCard(
  { className, radius = 18, ...rest },
  ref,
) {
  return <Glass ref={ref} radius={radius} className={cx("glace-card", className)} {...rest} />;
});

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<GlassTuning, "aberration" | "bezel" | "profile" | "saturation"> {
  tone?: GlassTone;
  size?: "sm" | "md" | "lg";
  /** `false` off · `true` auto · a number sets the edge displacement in px. */
  refract?: boolean | number;
  /** Smoothly morph width (spring) when the label changes. */
  morph?: boolean;
}

/** A frosted-glass button with a specular rim and a springy press. */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { tone = "dark", size = "md", refract = true, aberration, bezel, profile, saturation, morph = false, type = "button", className, style, children, ...rest },
  ref,
) {
  const inner = useRef<HTMLElement | null>(null);
  useMorphWidth(inner, morph);
  const { backdrop, refracting } = useGlassRefraction(inner, {
    radius: 999,
    refract: refract !== false,
    scale: typeof refract === "number" ? refract : undefined,
    aberration,
    bezel,
    profile,
    saturation,
    blur: 2.5,
    fallbackBlur: 10,
  });

  return (
    <button
      ref={(node: HTMLButtonElement | null) => {
        inner.current = node;
        assignRef(ref, node);
      }}
      type={type}
      className={cx("glace-glass", "glace-gbtn", `glace-gbtn--${size}`, "glace-glass--sheen", className)}
      data-tone={tone}
      data-refract={refracting ? "" : undefined}
      style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop, ...style }}
      {...rest}
    >
      <span className="glace-sheen" aria-hidden="true" />
      <span className="glace-gbtn-label">{children}</span>
    </button>
  );
});
