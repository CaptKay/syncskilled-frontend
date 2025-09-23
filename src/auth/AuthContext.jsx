import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Auth, setOnUnauthenticated } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // 🔹 Callback to refresh user profile
  const refreshUser = useCallback(async () => {
    try {
      const data = await Auth.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setBooting(false);
    }
  }, []); // no deps, stable forever

  // 🔹 Callbacks for auth actions
  const login = useCallback(
    async (payload) => {
      await Auth.login(payload);
      await refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async (payload) => {
      await Auth.register(payload);
      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    await Auth.logout();
    setUser(null);
  }, []);

  // 🔹 On mount: setup refresh + unauthenticated handler
  useEffect(() => {
    refreshUser(); // check if logged in when app loads
    setOnUnauthenticated(() => setUser(null));
    return () => setOnUnauthenticated(null);
  }, [refreshUser]);

  // 🔹 Memoize the context value
  const value = useMemo(
    () => ({
      user,
      booting,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, booting, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for consumers
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return ctx;
}
