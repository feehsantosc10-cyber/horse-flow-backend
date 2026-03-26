import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("horseflow-token"));
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem("horseflow-profile");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await request("/auth/me");
        const normalized = {
          token,
          user: { id: me.id, name: me.name, email: me.email, role: me.role },
          company: { id: me.company_id, name: me.company_name, email: me.company_email },
        };
        localStorage.setItem("horseflow-profile", JSON.stringify(normalized));
        setProfile(normalized);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [token]);

  function persist(result) {
    localStorage.setItem("horseflow-token", result.token);
    localStorage.setItem("horseflow-profile", JSON.stringify(result));
    setToken(result.token);
    setProfile(result);
  }

  async function login(payload) {
    persist(await request("/auth/login", { method: "POST", body: JSON.stringify(payload) }));
  }

  async function register(payload) {
    persist(await request("/auth/register", { method: "POST", body: JSON.stringify(payload) }));
  }

  function logout() {
    localStorage.removeItem("horseflow-token");
    localStorage.removeItem("horseflow-profile");
    setToken(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({ token, profile, loading, isAuthenticated: Boolean(token), login, register, logout }),
    [token, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
