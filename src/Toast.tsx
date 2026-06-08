import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Position, ToastData } from "./types";
import { store } from "./state";
import { TypeIcon, CloseIcon } from "./icons";
import { vibrate } from "./haptics";

interface Layout {
  index: number;
  before: number; // expanded stacking offset (px)
  collapsedY: number;
  collapsedScale: number;
  hidden: boolean;
  total: number;
}

interface ToastProps {
  toast: ToastData;
  layout: Layout;
  position: Position;
  expanded: boolean;
  paused: boolean;
  defaultDuration: number;
  closeButtonDefault: boolean;
  richColors: boolean;
  haptics: { show: number | number[]; action: number | number[]; dismiss: number | number[] } | null;
  onHeight: (id: ToastData["id"], h: number) => void;
}

const SWIPE_THRESHOLD = 0.4; // fraction of width
const EXIT_MS = 280;

// Sileo-style spring: soft overshoot on enter/settle, clean ease-out on exit.
const SPRING = "cubic-bezier(0.34, 1.5, 0.5, 1)";
const EASE_OUT = "cubic-bezier(0.4, 0, 0.2, 1)";

export function Toast({
  toast,
  layout,
  position,
  expanded,
  paused,
  defaultDuration,
  closeButtonDefault,
  richColors,
  haptics,
  onHeight,
}: ToastProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [removing, setRemoving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [swipe, setSwipe] = useState(0);
  const drag = useRef<{ startX: number; w: number } | null>(null);
  const remaining = useRef<number>(toast.duration ?? defaultDuration);
  const startedAt = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBottom = position.startsWith("bottom");
  const dir = isBottom ? -1 : 1;
  const front = layout.index === 0;

  // measure height
  useLayoutEffect(() => {
    if (ref.current) onHeight(toast.id, ref.current.offsetHeight);
  });

  // entrance + show haptic
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    if (haptics) vibrate(haptics.show);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close(reason: "auto" | "user") {
    if (removing) return;
    if (reason === "auto") toast.onAutoClose?.(toast);
    if (reason === "user" && haptics) vibrate(haptics.dismiss);
    setRemoving(true);
    window.setTimeout(() => store.dismiss(toast.id), EXIT_MS);
  }

  // auto-dismiss timer (pauses while expanded/hovered/hidden)
  const duration = toast.duration ?? (toast.type === "loading" ? Infinity : defaultDuration);
  useEffect(() => {
    if (duration === Infinity || removing) return;
    if (paused) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        remaining.current -= Date.now() - startedAt.current;
      }
      return;
    }
    startedAt.current = Date.now();
    timer.current = setTimeout(() => close("auto"), Math.max(remaining.current, 0));
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, duration, removing, toast.title, toast.type]);

  // pointer swipe-to-dismiss
  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    drag.current = { startX: e.clientX, w: ref.current?.offsetWidth ?? 320 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setSwipe(e.clientX - drag.current.startX);
  }
  function onPointerUp() {
    if (!drag.current) return;
    const { w } = drag.current;
    drag.current = null;
    if (Math.abs(swipe) > w * SWIPE_THRESHOLD) {
      setSwipe(swipe > 0 ? w : -w);
      close("user");
    } else {
      setSwipe(0);
    }
  }

  // layout transform
  let transform: string;
  if (swipe !== 0) {
    transform = `translateX(${swipe}px)`;
  } else if (!mounted) {
    transform = `translateY(${dir * -1 * 26}px) scale(0.9)`;
  } else if (expanded || front) {
    transform = `translateY(${dir * layout.before}px) scale(1)`;
  } else {
    transform = `translateY(${dir * layout.collapsedY}px) scale(${layout.collapsedScale})`;
  }

  const visible = expanded || !layout.hidden;
  const opacity = removing || !mounted ? 0 : visible ? 1 : 0;

  const showClose = toast.closeButton ?? closeButtonDefault;
  const custom = toast.jsx != null;

  return (
    <li
      ref={ref}
      data-glace-toast=""
      data-type={toast.type}
      data-rich={richColors ? "" : undefined}
      data-removing={removing ? "" : undefined}
      data-front={front ? "" : undefined}
      data-swiping={swipe !== 0 ? "" : undefined}
      data-custom={custom ? "" : undefined}
      role="status"
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={toast.className}
      style={{
        ...toast.style,
        position: "absolute",
        [isBottom ? "bottom" : "top"]: 0,
        zIndex: layout.total - layout.index,
        transform,
        opacity,
        touchAction: "pan-y",
        transition: drag.current
          ? "none"
          : removing
            ? `transform 0.28s ${EASE_OUT}, opacity 0.24s ease`
            : `transform 0.55s ${SPRING}, opacity 0.4s ease`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {custom ? (
        toast.jsx
      ) : (
        <div className="glace-row">
          {toast.icon !== undefined ? (
            toast.icon && <span className="glace-icon">{toast.icon}</span>
          ) : toast.type !== "default" ? (
            <span className="glace-icon">
              <TypeIcon type={toast.type} />
            </span>
          ) : null}

          <div className="glace-content">
            {toast.title != null && <div className="glace-title">{toast.title}</div>}
            {toast.description != null && (
              <div className="glace-description">{toast.description}</div>
            )}

            {(toast.action || toast.cancel) && (
              <div className="glace-actions">
                {toast.cancel && (
                  <button
                    className="glace-btn glace-btn-cancel"
                    onClick={(e) => {
                      if (haptics) vibrate(haptics.action);
                      toast.cancel!.onClick(e);
                      if (toast.cancel!.dismiss !== false) close("user");
                    }}
                  >
                    {toast.cancel.label}
                  </button>
                )}
                {toast.action && (
                  <button
                    className="glace-btn glace-btn-action"
                    onClick={(e) => {
                      if (haptics) vibrate(haptics.action);
                      toast.action!.onClick(e);
                      if (toast.action!.dismiss !== false) close("user");
                    }}
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
            )}
          </div>

          {showClose && (
            <button className="glace-close" aria-label="Close" onClick={() => close("user")}>
              <CloseIcon />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
