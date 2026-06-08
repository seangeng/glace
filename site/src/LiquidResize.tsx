import { useRef, useState } from "react";
import { Glass, GlassButton, toast } from "glaceui";

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const MIN_W = 180;
const MIN_H = 110;
const MAX_W = 560;
const MAX_H = 320;

/**
 * A glass panel you can resize by dragging its corner — to study how the glass
 * morphs. Dragging follows the pointer 1:1 (no easing); the preset buttons set a
 * size and the panel springs to it. Size is morphed, never scaled, so the rim
 * and refraction stay crisp at every dimension.
 */
export function LiquidResize() {
  const [size, setSize] = useState({ w: 320, h: 180 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setSize({
      w: clamp(drag.current.w + (e.clientX - drag.current.x), MIN_W, MAX_W),
      h: clamp(drag.current.h + (e.clientY - drag.current.y), MIN_H, MAX_H),
    });
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className="lr">
      <div className="stage lr-stage">
        <Glass
          radius={22}
          className="lr-panel"
          style={{
            width: size.w,
            height: size.h,
            transition: dragging ? "none" : "width 0.55s var(--glace-spring), height 0.55s var(--glace-spring)",
          }}
        >
          <div className="lr-panel-inner">
            <div className="lr-dim">{Math.round(size.w)} × {Math.round(size.h)}</div>
            <div className="lr-hint">drag the corner ↘</div>
          </div>
          <span
            className="lr-handle"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            aria-label="Resize"
          />
        </Glass>
      </div>

      <div className="lr-presets">
        <GlassButton size="sm" onClick={() => setSize({ w: 200, h: 120 })}>Compact</GlassButton>
        <GlassButton size="sm" onClick={() => setSize({ w: 320, h: 180 })}>Default</GlassButton>
        <GlassButton size="sm" onClick={() => setSize({ w: 520, h: 300 })}>Wide</GlassButton>
      </div>
    </div>
  );
}

/** A button that morphs its width through the spring when the label changes. */
export function MorphButton() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="stage stage--center">
      <GlassButton
        morph
        size="md"
        onClick={() => {
          setExpanded((e) => !e);
          toast(expanded ? "Collapsed" : "Expanded");
        }}
      >
        {expanded ? "Collapse this rather long expanded label" : "Expand"}
      </GlassButton>
    </div>
  );
}
