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

  const refreshUser = useCallback(async () => {
    try {
      const data = await Auth.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setBooting(false);
    }
  }, []);

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
    try {
      await Auth.logout();
    } finally {
      setUser(null);            // ✅ ensure UI logs out even if request fails
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();               // boot the session
    setOnUnauthenticated(() => setUser(null));
    return () => setOnUnauthenticated(null);
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      setUser,                  // ✅ expose for optimistic UI flows
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return ctx;
}
