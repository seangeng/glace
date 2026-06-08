import { useState } from "react";
import { GlassButton, GlassCard, toast, type GlassProfile, type GlassTone } from "glaceui";
import { ShuffleStage } from "./ShuffleStage";
import { Segmented, Slider, Toggle } from "./Controls";

const TONES: GlassTone[] = ["dark", "light"];
const PROFILES: GlassProfile[] = ["convex", "concave", "bevel"];
const SIZES = ["sm", "md", "lg"] as const;

/** Live GlassCard whose props are driven by sliders/toggles. */
export function CardPlayground() {
  const [tone, setTone] = useState<GlassTone>("dark");
  const [profile, setProfile] = useState<GlassProfile>("convex");
  const [refract, setRefract] = useState(56);
  const [bezel, setBezel] = useState(16);
  const [sheen, setSheen] = useState(true);

  return (
    <div className="playground-demo">
      <ShuffleStage height={240} center>
        <GlassCard
          tone={tone}
          profile={profile}
          refract={refract}
          bezel={bezel / 100}
          sheen={sheen}
          interactive
          className="pg-card"
        >
          <div className="demo-card-eyebrow">live</div>
          <div className="demo-card-title">Glass card</div>
          <p>Tweak the controls — and shuffle the backdrop.</p>
        </GlassCard>
      </ShuffleStage>
      <div className="controls">
        <Segmented label="tone" value={tone} options={TONES} onChange={setTone} />
        <Segmented label="profile" value={profile} options={PROFILES} onChange={setProfile} />
        <Slider label="Refraction" value={refract} min={0} max={120} onChange={setRefract} suffix="px" />
        <Slider label="Bezel" value={bezel} min={4} max={40} onChange={setBezel} suffix="%" />
        <Toggle label="sheen" on={sheen} onClick={() => setSheen((s) => !s)} />
      </div>
    </div>
  );
}

/** Live GlassButton whose props are driven by sliders/toggles. */
export function ButtonPlayground() {
  const [tone, setTone] = useState<GlassTone>("dark");
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");
  const [refract, setRefract] = useState(16);
  const [aberration, setAberration] = useState(1);

  return (
    <div className="playground-demo">
      <ShuffleStage height={150} center>
        <GlassButton
          tone={tone}
          size={size}
          refract={refract}
          aberration={aberration}
          onClick={() => toast("Glass button")}
        >
          Glass button
        </GlassButton>
      </ShuffleStage>
      <div className="controls">
        <Segmented label="tone" value={tone} options={TONES} onChange={setTone} />
        <Segmented label="size" value={size} options={SIZES} onChange={setSize} />
        <Slider label="Refraction" value={refract} min={0} max={28} onChange={setRefract} suffix="px" />
        <Slider label="Aberration" value={aberration} min={0} max={8} onChange={setAberration} suffix="px" />
      </div>
    </div>
  );
}
