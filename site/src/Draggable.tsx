import { useRef, useState } from "react";

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** Wraps a child so it can be dragged within its parent's bounds. */
export function Draggable({
  x = 0,
  y = 0,
  children,
}: {
  x?: number;
  y?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    // let interactive controls (buttons, links) handle their own clicks
    if ((e.target as HTMLElement).closest("button, a")) return;
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    setDragging(true);
    ref.current?.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !ref.current) return;
    const el = ref.current;
    const parent = el.parentElement;
    if (!parent) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setPos({
      x: clamp(e.clientX - drag.current.dx, 0, parent.clientWidth - w),
      y: clamp(e.clientY - drag.current.dy, 0, parent.clientHeight - h),
    });
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={ref}
      className="draggable"
      data-dragging={dragging ? "" : undefined}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        touchAction: "none",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {children}
    </div>
  );
}
