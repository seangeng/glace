# Glacé 🧊

**Beautiful frosted-glass toasts for React.** An opinionated little notification library — real layered glass, springy stacking, swipe-to-dismiss, light/dark out of the box, and optional haptics. Think [sonner](https://sonner.emilkowal.ski/), wearing glass.

**[glacekit.com](https://glacekit.com)** — live demo, playground, and docs.

```bash
npm i glaceui
```

```tsx
import { Toaster, toast } from "glaceui";
import "glaceui/styles.css";

export default function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved to your library")}>Save</button>
      <Toaster position="bottom-right" />
    </>
  );
}
```

That's the whole setup: drop one `<Toaster />` near the root, call `toast()` from anywhere.

---

## Why

Most toast libraries are either gorgeous-but-rigid or flexible-but-plain. Glacé is opinionated about the *look* — proper frosted glass that blurs whatever's behind it, with a specular top edge, a faint grain, and a soft shadow — and unopinionated about everything else. It's themeable with plain CSS variables, has no styling dependency, and ships a single stylesheet, so it drops into a Tailwind/shadcn app or a plain one without touching your config.

## Features

- 🧊 **Real glass** — `backdrop-filter` blur + saturate, layered inset highlight, grain, and soft shadow (the [Aave glass recipe](https://aave.com/design/building-glass-for-the-web)).
- 🌗 **Light / dark / system** — looks right on both, automatically.
- 🪄 **Springy stack** — toasts collapse behind each other and fan open on hover, sonner-style.
- 👆 **Swipe to dismiss** — pointer-driven, works on touch and trackpad.
- 📳 **Optional haptics** — a buzz on appear / action / dismiss where the device supports it (inspired by [web-haptics](https://github.com/lochie/web-haptics)).
- 🎨 **Themeable** — every color, blur, radius, and gap is a CSS variable.
- ⚡ **Tiny & dependency-free** — just React as a peer. Promise, loading, action buttons, custom render included.
- ♿ **Accessible** — `aria-live` region, reduced-motion aware.

## Toast API

```ts
toast("Plain message");
toast.success("Profile updated");
toast.error("Couldn't reach the server");
toast.warning("Storage almost full");
toast.info("New version available");

const id = toast.loading("Uploading…");
toast.success("Uploaded", { id }); // update in place

// with description + action
toast("Invite sent", {
  description: "alex@acme.com will get an email.",
  action: { label: "Undo", onClick: () => revoke() },
});

// promise — loading → success / error automatically
toast.promise(saveProfile(), {
  loading: "Saving…",
  success: (data) => `Saved ${data.name}`,
  error: (err) => `Failed: ${err.message}`,
});

// render anything
toast.custom(<MyCard />);

toast.dismiss(id); // or toast.dismiss() to clear all
```

## `<Toaster />` props

| Prop | Type | Default | |
|---|---|---|---|
| `position` | `top-left \| top-center \| top-right \| bottom-left \| bottom-center \| bottom-right` | `bottom-right` | where the stack sits |
| `theme` | `light \| dark \| system` | `system` | follows the OS unless pinned |
| `richColors` | `boolean` | `false` | tinted glass per type instead of neutral |
| `expand` | `boolean` | `true` | fan the stack open on hover |
| `visibleToasts` | `number` | `3` | how many show before older ones collapse out |
| `gap` | `number` | `14` | px between toasts when expanded |
| `offset` | `number` | `24` | px from the screen edge |
| `duration` | `number` | `4000` | default ms before auto-dismiss |
| `closeButton` | `boolean` | `false` | show an × on every toast |
| `blur` | `number` | `16` | glass blur radius in px |
| `haptics` | `boolean \| HapticsOptions` | `false` | opt-in vibration feedback |
| `toastOptions` | `{ duration, className, style, closeButton }` | — | defaults applied to every toast |

## Theming

Glacé is driven entirely by CSS variables on `[data-glace-toaster]`. Override any of them — they map cleanly onto shadcn's token system, so you can wire them to your existing palette:

```css
[data-glace-toaster][data-theme="dark"] {
  --glace-bg: rgba(20, 20, 28, 0.55);
  --glace-border: rgba(255, 255, 255, 0.1);
  --glace-text: hsl(var(--foreground));
  --glace-radius: 14px;
}
```

Per-toast styling is just `className` / `style`:

```tsx
toast("Custom", { className: "my-toast", style: { "--glace-radius": "22px" } });
```

## Haptics

Off by default. Flip it on, or tune the patterns:

```tsx
<Toaster haptics />
<Toaster haptics={{ enabled: true, show: 8, action: [6, 10, 6], dismiss: 4 }} />
```

Uses the Vibration API where available (Android Chrome and others). iOS Safari doesn't expose it, so it's a progressive enhancement — never required, never throws.

## Credits

Standing on the shoulders of work I admire:

- [**sonner**](https://sonner.emilkowal.ski/) by Emil Kowalski — the toast API and stacking behavior this follows.
- [**Building glass for the web**](https://aave.com/design/building-glass-for-the-web) by Aave — the layered-glass recipe.
- [**Sileo**](https://sileo.aaryan.design/) by Aaryan — glass-notification aesthetic inspiration.
- [**web-haptics**](https://github.com/lochie/web-haptics) by Lochie — the case for tactile web feedback.

## License

MIT © [Sean Geng](https://seangeng.com)
