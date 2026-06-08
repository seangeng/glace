import { forwardRef } from "react";
import { glassBackdrop, useGlassFilter } from "./glass";

function cx(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(" ");
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
  /** Turn refraction off and use plain frosted blur everywhere. */
  refract?: boolean;
  /** Lift slightly on hover. */
  interactive?: boolean;
  /** Smoothly morph width/height (spring) when the size changes. */
  morph?: boolean;
}

/**
 * A reusable frosted-glass surface — the foundation every Glacé component is
 * built on. Drop it anywhere you want real glass: a panel, a card background, a
 * bar. Renders any element via `as`.
 */
export const Glass = forwardRef<HTMLElement, GlassProps>(function Glass(
  {
    as,
    tone = "dark",
    radius = 16,
    blur = 3,
    fallbackBlur = 14,
    refract = true,
    interactive = false,
    morph = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const filterId = useGlassFilter();
  const on = refract ? filterId : null;
  const backdrop = glassBackdrop(on, blur, fallbackBlur);
  const Tag = (as ?? "div") as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={cx(
        "glace-glass",
        interactive && "glace-glass--interactive",
        morph && "glace-glass--morph",
        className,
      )}
      data-tone={tone}
      data-refract={on ? "" : undefined}
      style={{
        borderRadius: radius,
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
        ...style,
      }}
      {...rest}
    >
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
  refract?: boolean;
  /** Smoothly morph width (spring) when the label changes. */
  morph?: boolean;
}

/** A frosted-glass button with a specular rim and a springy press. */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { tone = "dark", size = "md", refract = true, morph = false, type = "button", className, style, children, ...rest },
  ref,
) {
  const filterId = useGlassFilter();
  const on = refract ? filterId : null;
  const backdrop = glassBackdrop(on, 3, 10);

  return (
    <button
      ref={ref}
      type={type}
      className={cx("glace-glass", "glace-gbtn", `glace-gbtn--${size}`, morph && "glace-glass--morph", className)}
      data-tone={tone}
      data-refract={on ? "" : undefined}
      style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop, ...style }}
      {...rest}
    >
      <span className="glace-gbtn-label">{children}</span>
    </button>
  );
});
