import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, loginUser } from "../services/authApi";
import { getStoredProfile, getStoredToken, logout as logoutSession, saveAuthSession } from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await getProfile();
        const normalized = {
          token,
          user: { id: me.id, name: me.name, email: me.email, role: me.role, active: Boolean(me.active) },
          company: { id: me.company_id, name: me.company_name, email: me.company_email },
        };
        saveAuthSession(normalized);
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
    saveAuthSession(result);
    setToken(result.token);
    setProfile(result);
  }

  async function login(payload) {
    persist(await loginUser(payload));
  }

  function logout() {
    logoutSession();
    setToken(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({
      token,
      profile,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin: profile?.user?.role === "admin",
      login,
      logout,
    }),
    [token, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
