import type { HapticsOptions } from "./types";

/**
 * Tiny haptics helper, inspired by lochie/web-haptics. Uses the Vibration API
 * where available (Android Chrome, some others). iOS Safari does not expose it,
 * so this is a progressive enhancement — never required, never throws.
 */

export const DEFAULT_HAPTICS: Required<Omit<HapticsOptions, "enabled">> = {
  show: 8,
  action: [6, 10, 6],
  dismiss: 4,
};

export function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export function vibrate(pattern: number | number[]): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore — vibration can throw if not user-activated */
  }
}

export function resolveHaptics(
  config: boolean | HapticsOptions | undefined,
): Required<HapticsOptions> | null {
  if (!config) return null;
  if (config === true) return { enabled: true, ...DEFAULT_HAPTICS };
  if (!config.enabled) return null;
  return { enabled: true, ...DEFAULT_HAPTICS, ...config };
}
