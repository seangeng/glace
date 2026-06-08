import { useState } from "react";
import { Shuffle } from "./Icons";

const CDN = "https://imagedelivery.net/lc3yeg4JfJ1ih-rx6KtSYg/backgrounds/fractal-glass-gradients";
const BG_COUNT = 40;
const bgUrl = (n: number) =>
  `${CDN}/fractal-glass-${String(n).padStart(2, "0")}/w=1100,format=auto,quality=82`;

const randExcept = (prev: number) => {
  let x = prev;
  while (x === prev) x = 1 + Math.floor(Math.random() * BG_COUNT);
  return x;
};

/**
 * A demo container with a busy fractal-glass-gradient backdrop and a shuffle
 * button — so the glass actually has something colorful to refract (the edge
 * profiles are invisible over a flat grid). `center` lays children out centered;
 * otherwise they're absolutely positioned (for draggable demos).
 */
export function ShuffleStage({
  children,
  height = 360,
  center = false,
}: {
  children: React.ReactNode;
  height?: number;
  center?: boolean;
}) {
  const [n, setN] = useState(() => 1 + Math.floor(Math.random() * BG_COUNT));
  const [next, setNext] = useState<number | null>(null);

  return (
    <div className="shuffle-stage" style={{ height }}>
      <img className="shuffle-bg" src={bgUrl(n)} alt="" />
      {/* preloaded crossfade layer */}
      {next != null && (
        <img
          className="shuffle-bg shuffle-bg--next"
          src={bgUrl(next)}
          alt=""
          onLoad={() => {
            setN(next);
            setNext(null);
          }}
        />
      )}
      <button className="shuffle-btn" onClick={() => setNext(randExcept(n))} aria-label="Shuffle background">
        <Shuffle className="shuffle-icon" />
        <span>shuffle</span>
      </button>
      <div className={center ? "shuffle-content shuffle-content--center" : "shuffle-content"}>
        {children}
      </div>
    </div>
  );
}
