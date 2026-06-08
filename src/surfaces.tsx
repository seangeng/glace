import { forwardRef, useRef } from "react";
import { useGlassRefraction } from "./glass";

function cx(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.ForwardedRef<T>, node: T) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.MutableRefObject<T>).current = node;
}

export type GlassTone = "light" | "dark";

export interface GlassProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/component to render. Defaults to `div`. */
  as?: React.ElementType;
  tone?: GlassTone;
  /** Corner radius in px. */
  radius?: number;
  /** Blur on the refraction path (keep low — the lens does the work). */
  blur?: number;
  /** Blur used when refraction isn't supported (Safari/Firefox). */
  fallbackBlur?: number;
  /** `false` off · `true` auto · a number sets the edge displacement in px. */
  refract?: boolean | number;
  /** Chromatic-aberration split in px (default 1). */
  aberration?: number;
  /** Refracting rim thickness as a fraction of the min dimension, 0–0.5 (default 0.16). */
  bezel?: number;
  /** Backdrop saturation %, default 180. */
  saturation?: number;
  /** Lift slightly on hover. */
  interactive?: boolean;
  /** Smoothly morph width/height (spring) when the size changes. */
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
    saturation,
    blur,
    fallbackBlur,
  });
  const Tag = (as ?? "div") as React.ElementType;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        inner.current = node;
        assignRef(ref, node as HTMLElement);
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

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: GlassTone;
  size?: "sm" | "md" | "lg";
  /** `false` off · `true` auto · a number sets the edge displacement in px. */
  refract?: boolean | number;
  /** Chromatic-aberration split in px (default 1). */
  aberration?: number;
  /** Refracting rim thickness as a fraction of the min dimension (default 0.16). */
  bezel?: number;
  /** Backdrop saturation %, default 180. */
  saturation?: number;
  /** Smoothly morph width (spring) when the label changes. */
  morph?: boolean;
}

/** A frosted-glass button with a specular rim and a springy press. */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { tone = "dark", size = "md", refract = true, aberration, bezel, saturation, morph = false, type = "button", className, style, children, ...rest },
  ref,
) {
  const inner = useRef<HTMLElement | null>(null);
  const { backdrop, refracting } = useGlassRefraction(inner, {
    radius: 999,
    refract: refract !== false,
    scale: typeof refract === "number" ? refract : undefined,
    aberration,
    bezel,
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
      className={cx(
        "glace-glass",
        "glace-gbtn",
        `glace-gbtn--${size}`,
        "glace-glass--sheen",
        morph && "glace-glass--morph",
        className,
      )}
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
