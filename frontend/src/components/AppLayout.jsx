import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { profile, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Horse Flow SaaS</p>
          <h1>{profile?.company?.name || "Empresa"}</h1>
          <p className="muted">Manejo, saude, reproducao e alertas em uma unica operacao.</p>
        </div>

        <nav className="nav-list">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/horses">Cavalos</NavLink>
        </nav>

        <div className="sidebar-footer">
          <span>{profile?.user?.name}</span>
          <button type="button" className="ghost-button" onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
