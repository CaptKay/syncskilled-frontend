import { useEffect, useRef } from "react";
import { api, Auth } from "../api";

/**
 * Installs a response interceptor that:
 * - on 401 (non-auth routes) calls /auth/refresh once
 * - retries the original request exactly once
 * - if refresh fails, calls onUnauth() so you can clear user state
 *
 * NOTE: uses your existing endpoints:
 *   GET /auth/refresh (if yours is POST, just change Auth.refresh())
 */
export default function useAuthInterceptors(onUnauth) {
  // prevent double-install
  const installed = useRef(false);
  // refresh gate
  const refreshingRef = useRef(false);
  const waitersRef = useRef([]);

  useEffect(() => {
    if (installed.current) return;
    installed.current = true;

    const isAuthRoute = (url = "") =>
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/refresh");

    const waitForRefresh = () =>
      new Promise((resolve) => {
        waitersRef.current.push(resolve);
      });

    const releaseWaiters = () => {
      waitersRef.current.forEach((r) => r());
      waitersRef.current = [];
    };

    const id = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const { config, response } = error || {};
        if (!response) throw error; // network/CORS error

        if (response.status !== 401) throw error;
        if (isAuthRoute(config?.url)) {
          onUnauth?.();
          throw error;
        }
        if (config.__isRetry) {
          onUnauth?.();
          throw error;
        }

        // start or wait for refresh
        if (!refreshingRef.current) {
          refreshingRef.current = true;
          try {
            await Auth.refresh(); // your GET /auth/refresh sets new access cookie
          } catch (error) {
            refreshingRef.current = false;
            releaseWaiters();
            onUnauth?.();
            throw error;
          }
          refreshingRef.current = false;
          releaseWaiters();
        } else {
          await waitForRefresh();
        }

        // retry original once
        const retry = { ...config, __isRetry: true };
        return api(retry);
      }
    );

    return () => {
      api.interceptors.response.eject(id);
      installed.current = false;
    };
  }, [onUnauth]);
}
