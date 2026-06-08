import type { ReactNode } from "react";

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";

export type ToastId = string | number;

export type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type Theme = "light" | "dark" | "system";

/** A button rendered inside a toast. */
export interface ToastAction {
  label: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Dismiss the toast after the handler runs. Defaults to true. */
  dismiss?: boolean;
}

export interface ToastOptions {
  id?: ToastId;
  description?: ReactNode;
  /** ms before auto-dismiss. `Infinity` keeps it open. Defaults to 4000 (Infinity for loading). */
  duration?: number;
  icon?: ReactNode;
  action?: ToastAction;
  cancel?: ToastAction;
  /** Force a per-toast theme override. */
  closeButton?: boolean;
  /** Custom class on the toast element. */
  className?: string;
  /** Inline style on the toast element. */
  style?: React.CSSProperties;
  /** Fire a haptic when this toast appears. Overrides the Toaster default. */
  haptics?: boolean;
  onDismiss?: (toast: ToastData) => void;
  onAutoClose?: (toast: ToastData) => void;
}

export interface ToastData extends ToastOptions {
  id: ToastId;
  title?: ReactNode;
  type: ToastType;
  /** Fully custom render — ignores title/description/icon. */
  jsx?: ReactNode;
  createdAt: number;
}

export interface PromiseMessages<T> {
  loading: ReactNode;
  success: ReactNode | ((data: T) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
  description?: ReactNode;
}

export interface HapticsOptions {
  /** Master switch. Defaults to false (opt-in). */
  enabled?: boolean;
  /** Pattern (ms) when a toast appears. */
  show?: number | number[];
  /** Pattern when an action/cancel button is pressed. */
  action?: number | number[];
  /** Pattern when a toast is swiped/dismissed. */
  dismiss?: number | number[];
}

export interface ToasterProps {
  position?: Position;
  theme?: Theme;
  /** Tinted, colorful success/error/etc. backgrounds instead of neutral glass. */
  richColors?: boolean;
  /** Expand the stack on hover instead of only on focus. Defaults to true. */
  expand?: boolean;
  /** Max toasts visible before older ones collapse out. Defaults to 3. */
  visibleToasts?: number;
  /** Gap between toasts in px when expanded. Defaults to 14. */
  gap?: number;
  /** Distance from the screen edge in px. Defaults to 24. */
  offset?: number;
  /** Default ms before auto-dismiss. Defaults to 4000. */
  duration?: number;
  /** Show a close button on every toast. Defaults to false. */
  closeButton?: boolean;
  /** Blur radius of the glass in px. Defaults to 16. */
  blur?: number;
  /** Haptic feedback config (opt-in). */
  haptics?: boolean | HapticsOptions;
  /** Applied to every toast. */
  toastOptions?: Pick<ToastOptions, "duration" | "className" | "style" | "closeButton">;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible label for the region. Defaults to "Notifications". */
  ariaLabel?: string;
  dir?: "ltr" | "rtl";
}
