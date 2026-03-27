import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const { isAuthenticated, login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(loginForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">Sistema comercial completo</p>
        <h1>Horse Flow</h1>
        <p>Acesso restrito para usuarios autorizados.</p>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="auth-grid auth-grid-single">
        <form className="panel card-form" onSubmit={handleLogin}>
          <h2>Entrar</h2>
          <input placeholder="E-mail" value={loginForm.email} onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))} />
          <input type="password" placeholder="Senha" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} />
          <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Acessar"}</button>
        </form>
      </section>
    </div>
  );
}
