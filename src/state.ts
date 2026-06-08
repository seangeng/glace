import type {
  PromiseMessages,
  ToastData,
  ToastId,
  ToastOptions,
  ToastType,
} from "./types";

type Listener = (toasts: ToastData[]) => void;

let counter = 0;
function genId(): string {
  counter += 1;
  return `glace-${counter}-${Date.now().toString(36)}`;
}

class ToastStore {
  toasts: ToastData[] = [];
  private listeners = new Set<Listener>();

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    fn(this.toasts);
    return () => {
      this.listeners.delete(fn);
    };
  };

  private emit() {
    for (const fn of this.listeners) fn(this.toasts);
  }

  /** Add a new toast, or update an existing one if the id already exists. */
  upsert(partial: Omit<ToastData, "createdAt"> & { createdAt?: number }): ToastId {
    const existingIndex = this.toasts.findIndex((t) => t.id === partial.id);
    if (existingIndex > -1) {
      this.toasts = this.toasts.map((t, i) =>
        i === existingIndex ? { ...t, ...partial } : t,
      );
    } else {
      this.toasts = [
        { createdAt: Date.now(), ...partial } as ToastData,
        ...this.toasts,
      ];
    }
    this.emit();
    return partial.id;
  }

  dismiss(id?: ToastId) {
    if (id == null) {
      this.toasts.forEach((t) => t.onDismiss?.(t));
      this.toasts = [];
    } else {
      const t = this.toasts.find((x) => x.id === id);
      t?.onDismiss?.(t);
      this.toasts = this.toasts.filter((x) => x.id !== id);
    }
    this.emit();
  }
}

export const store = new ToastStore();

function create(
  type: ToastType,
  title: ToastData["title"],
  opts: ToastOptions = {},
): ToastId {
  const id = opts.id ?? genId();
  store.upsert({ ...opts, id, title, type });
  return id;
}

function base(title: ToastData["title"], opts?: ToastOptions) {
  return create("default", title, opts);
}

export const toast = Object.assign(base, {
  success: (title: ToastData["title"], opts?: ToastOptions) => create("success", title, opts),
  error: (title: ToastData["title"], opts?: ToastOptions) => create("error", title, opts),
  warning: (title: ToastData["title"], opts?: ToastOptions) => create("warning", title, opts),
  info: (title: ToastData["title"], opts?: ToastOptions) => create("info", title, opts),
  message: (title: ToastData["title"], opts?: ToastOptions) => create("default", title, opts),

  loading: (title: ToastData["title"], opts?: ToastOptions) =>
    create("loading", title, { duration: Infinity, ...opts }),

  /** Render anything. */
  custom: (jsx: ToastData["jsx"], opts?: ToastOptions) => {
    const id = opts?.id ?? genId();
    store.upsert({ ...opts, id, type: "default", jsx });
    return id;
  },

  dismiss: (id?: ToastId) => store.dismiss(id),

  /** Tie a toast to a promise: loading → success / error. */
  promise: <T>(promise: Promise<T> | (() => Promise<T>), msgs: PromiseMessages<T>): Promise<T> => {
    const id = genId();
    store.upsert({
      id,
      type: "loading",
      title: msgs.loading,
      description: msgs.description,
      duration: Infinity,
    });
    const p = typeof promise === "function" ? promise() : promise;
    return p.then(
      (data) => {
        store.upsert({
          id,
          type: "success",
          title: typeof msgs.success === "function" ? msgs.success(data) : msgs.success,
          duration: 4000,
        });
        return data;
      },
      (err) => {
        store.upsert({
          id,
          type: "error",
          title: typeof msgs.error === "function" ? msgs.error(err) : msgs.error,
          duration: 4000,
        });
        throw err;
      },
    );
  },
});
