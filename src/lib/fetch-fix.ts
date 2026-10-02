/**
 * Guard against "Cannot set property fetch of #<Window> which has only a getter"
 * Ensures window.fetch and globalThis.fetch have both getter and setter descriptors.
 */
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let currentFetch = rawFetch;

    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!descriptor || descriptor.configurable) {
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
          return currentFetch;
        },
        set(fn) {
          currentFetch = fn;
        },
      });
    }
  } catch (e) {
    try {
      const proto = Object.getPrototypeOf(window);
      if (proto) {
        const rawProtoFetch = proto.fetch ? proto.fetch.bind(window) : undefined;
        let currentProtoFetch = rawProtoFetch;
        Object.defineProperty(proto, 'fetch', {
          configurable: true,
          enumerable: true,
          get() {
            return currentProtoFetch;
          },
          set(fn) {
            currentProtoFetch = fn;
          },
        });
      }
    } catch (err) {
      // Ignored
    }
  }
}
