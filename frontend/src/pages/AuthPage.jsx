import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialRegister = {
  companyName: "",
  email: "",
  password: "",
};

export function AuthPage() {
  const { isAuthenticated, login, register } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      setError("");
      await login(loginForm);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    try {
      setError("");
      await register(registerForm);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">Sistema comercial completo</p>
        <h1>Horse Flow</h1>
        <p>Onde tradicao e tecnologia correm lado a lado.</p>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="auth-grid">
        <form className="panel card-form" onSubmit={handleLogin}>
          <h2>Entrar</h2>
          <input placeholder="E-mail" value={loginForm.email} onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))} />
          <input type="password" placeholder="Senha" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} />
          <button type="submit">Acessar</button>
        </form>

        <form className="panel card-form" onSubmit={handleRegister}>
          <h2>Criar empresa</h2>
          <input placeholder="Nome do local" value={registerForm.companyName} onChange={(e) => setRegisterForm((p) => ({ ...p, companyName: e.target.value }))} />
          <input placeholder="E-mail" value={registerForm.email} onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))} />
          <input type="password" placeholder="Senha" value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} />
          <button type="submit">Criar conta</button>
        </form>
      </section>
    </div>
  );
}
