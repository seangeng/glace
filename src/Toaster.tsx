import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Position, ToastData, ToasterProps } from "./types";
import { store } from "./state";
import { Toast } from "./Toast";
import { resolveHaptics } from "./haptics";
import { useGlassFilter } from "./glass";

const COLLAPSED_STEP = 16;
const DEFAULT_HEIGHT = 64;

export function Toaster({
  position = "bottom-right",
  theme = "system",
  richColors = false,
  expand = true,
  visibleToasts = 3,
  gap = 14,
  offset = 24,
  duration = 4000,
  closeButton = false,
  blur = 16,
  haptics,
  toastOptions,
  className,
  style,
  ariaLabel = "Notifications",
  dir = "ltr",
}: ToasterProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const glassFilter = useGlassFilter();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => store.subscribe(setToasts), []);
  useEffect(() => setMounted(true), []);

  // theme resolution
  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setResolvedTheme(mq.matches ? "dark" : "light");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  // pause auto-dismiss when tab hidden
  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // prune stale heights
  useEffect(() => {
    setHeights((h) => {
      const live = new Set(toasts.map((t) => String(t.id)));
      const next: Record<string, number> = {};
      for (const k in h) if (live.has(k)) next[k] = h[k];
      return next;
    });
  }, [toasts]);

  const setHeight = useCallback((id: ToastData["id"], h: number) => {
    setHeights((prev) => (prev[String(id)] === h ? prev : { ...prev, [String(id)]: h }));
  }, []);

  const hapticsResolved = useMemo(() => {
    const r = resolveHaptics(haptics);
    return r ? { show: r.show, action: r.action, dismiss: r.dismiss } : null;
  }, [haptics]);

  const expanded = (expand && hovered) || focused;
  const paused = hovered || focused || docHidden;

  const isBottom = position.startsWith("bottom");
  const isCenter = position.endsWith("center");
  const isRight = position.endsWith("right");

  // compute per-toast layout
  const layouts = useMemo(() => {
    const total = toasts.length;
    let acc = 0;
    return toasts.map((t, i) => {
      const before = acc;
      acc += (heights[String(t.id)] ?? DEFAULT_HEIGHT) + gap;
      return {
        id: t.id,
        index: i,
        before,
        collapsedY: i * COLLAPSED_STEP,
        collapsedScale: Math.max(1 - i * 0.06, 0.8),
        hidden: i >= visibleToasts,
        total,
      };
    });
  }, [toasts, heights, gap, visibleToasts]);

  // expanded stack height (so the hover area covers all toasts)
  const stackHeight = useMemo(() => {
    if (!expanded) return (heights[String(toasts[0]?.id)] ?? DEFAULT_HEIGHT);
    return toasts.reduce((sum, t) => sum + (heights[String(t.id)] ?? DEFAULT_HEIGHT) + gap, -gap);
  }, [expanded, toasts, heights, gap]);

  if (!mounted || typeof document === "undefined") return null;

  const node = (
    <section
      aria-label={ariaLabel}
      data-glace-toaster=""
      data-theme={resolvedTheme}
      data-position={position}
      data-rich={richColors ? "" : undefined}
      data-refract={glassFilter ? "" : undefined}
      dir={dir}
      className={className}
      style={
        {
          ...style,
          position: "fixed",
          zIndex: 99999,
          [isBottom ? "bottom" : "top"]: offset,
          ...(isCenter
            ? { left: "50%", transform: "translateX(-50%)" }
            : isRight
              ? { right: offset }
              : { left: offset }),
          "--glace-blur": `${blur}px`,
          "--glace-gap": `${gap}px`,
          ...(glassFilter ? { "--glace-refract": `url(#${glassFilter})` } : {}),
        } as unknown as React.CSSProperties
      }
    >
      <ol
        ref={listRef}
        data-expanded={expanded ? "" : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
        }}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          position: "relative",
          width: "var(--glace-width, 356px)",
          maxWidth: "calc(100vw - 32px)",
          height: stackHeight,
          transition: "height 0.5s cubic-bezier(0.34, 1.4, 0.6, 1)",
        }}
      >
        {toasts.map((t, i) => (
          <Toast
            key={t.id}
            toast={t}
            layout={layouts[i]}
            position={position as Position}
            expanded={expanded}
            paused={paused}
            defaultDuration={toastOptions?.duration ?? duration}
            closeButtonDefault={toastOptions?.closeButton ?? closeButton}
            richColors={richColors}
            haptics={hapticsResolved}
            onHeight={setHeight}
          />
        ))}
      </ol>
    </section>
  );

  return createPortal(node, document.body);
}
