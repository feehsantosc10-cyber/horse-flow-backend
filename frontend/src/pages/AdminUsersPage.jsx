import { useEffect, useState } from "react";
import { createUser, listUsers, updateUser, updateUserStatus } from "../services/adminApi";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setError("");
      setLoading(true);
      setUsers(await listUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setSaving(true);

      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  }

  async function handleToggleStatus(user) {
    try {
      setError("");
      await updateUserStatus(user.id, !user.active);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Gerenciamento de usuarios</h2>
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="content-grid">
        <form className="panel card-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Editar usuario" : "Novo usuario"}</h3>
          <input
            placeholder="Nome"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            placeholder="E-mail"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            type="password"
            placeholder={editingId ? "Nova senha (opcional)" : "Senha"}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <select value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <div className="action-row">
            <button type="submit" disabled={saving}>{saving ? "Salvando..." : editingId ? "Salvar usuario" : "Criar usuario"}</button>
            {editingId ? <button type="button" className="ghost-button" onClick={resetForm}>Cancelar</button> : null}
          </div>
        </form>

        <article className="panel">
          <h3>Usuarios cadastrados</h3>
          {loading ? (
            <p>Carregando usuarios...</p>
          ) : (
            <div className="timeline-list">
              {users.length ? users.map((user) => (
                <div key={user.id} className="timeline-card admin-user-card">
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                    <p className="muted">
                      Perfil: {user.role === "admin" ? "Admin" : "Usuario"} | {user.active ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                  <div className="action-row">
                    <button type="button" className="ghost-button" onClick={() => handleEdit(user)}>Editar</button>
                    <button type="button" className="ghost-button" onClick={() => handleToggleStatus(user)}>
                      {user.active ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              )) : <p className="muted">Nenhum usuario cadastrado.</p>}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
