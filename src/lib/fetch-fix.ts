/**
 * Guard against "Cannot set property fetch of #<Window> which has only a getter"
 * Ensures window.fetch and globalThis.fetch have both getter and setter descriptors.
 * Also seamlessly attaches Authorization: Bearer <qaswa_admin_token> to /api/admin requests.
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

    // Wrap currentFetch to inject admin auth bearer token for /api/admin/* requests
    if (currentFetch) {
      const baseFetch = currentFetch;
      currentFetch = async function (input: RequestInfo | URL, init?: RequestInit) {
        const urlStr =
          typeof input === 'string'
            ? input
            : input instanceof URL
            ? input.toString()
            : (input as Request).url || '';

        // Inject authorization header for protected admin endpoints
        if (
          urlStr.includes('/api/admin') &&
          !urlStr.includes('/api/admin/auth/login') &&
          !urlStr.includes('/api/admin/auth/forgot-password')
        ) {
          try {
            const token = localStorage.getItem('qaswa_admin_token');
            if (token) {
              init = init || {};
              const headers = new Headers(init.headers || {});
              if (!headers.has('Authorization')) {
                headers.set('Authorization', `Bearer ${token}`);
              }
              init.headers = headers;
            }
          } catch (e) {
            // ignore localStorage access error
          }
        }

        const response = await baseFetch(input, init);

        // If backend reports 401 or 403 on an admin route, clear local token and session
        if (
          (response.status === 401 || response.status === 403) &&
          urlStr.includes('/api/admin') &&
          !urlStr.includes('/api/admin/auth/')
        ) {
          try {
            localStorage.removeItem('qaswa_admin_token');
            sessionStorage.removeItem('qaswa_admin_token');
          } catch (e) {}
        }

        return response;
      };
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
