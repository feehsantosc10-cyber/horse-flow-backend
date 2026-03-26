import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../lib/api";

const initialForm = {
  name: "",
  tagNumber: "",
  birthDate: "",
  breed: "",
  photoUrl: "",
  notes: "",
};

export function HorsesPage() {
  const [horses, setHorses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      setError("");
      setHorses(await request("/horses"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      await request("/horses", { method: "POST", body: JSON.stringify(form) });
      setForm(initialForm);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(horseId) {
    const confirmed = window.confirm("Deseja excluir este cavalo?");
    if (!confirmed) {
      return;
    }

    try {
      await request(`/horses/${horseId}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setForm((prev) => ({ ...prev, photoUrl: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photoUrl: typeof reader.result === "string" ? reader.result : "" }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Cadastro</p>
          <h2>Cavalos</h2>
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="content-grid">
        <form className="panel card-form" onSubmit={handleSubmit}>
          <h3>Novo cavalo</h3>
          <input placeholder="Nome" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input placeholder="Tag / identificacao" value={form.tagNumber} onChange={(e) => setForm((p) => ({ ...p, tagNumber: e.target.value }))} />
          <input type="date" value={form.birthDate} onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))} />
          <input placeholder="Raca" value={form.breed} onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))} />
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {form.photoUrl ? <img className="horse-thumb-preview" src={form.photoUrl} alt="Pre-visualizacao do cavalo" /> : null}
          <textarea placeholder="Observacoes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          <button type="submit" disabled={submitting}>Salvar cavalo</button>
        </form>

        <article className="panel">
          <h3>Lista de cavalos</h3>
          <div className="timeline-list">
            {horses.map((horse) => (
              <div key={horse.id} className="timeline-card horse-list-card">
                <Link to={`/horses/${horse.id}`} className="link-card horse-card-main">
                  {horse.photoUrl ? <img className="horse-list-thumb" src={horse.photoUrl} alt={horse.name} /> : null}
                  <div>
                    <strong>{horse.name}</strong>
                    <p>{horse.breed} | Tag {horse.tagNumber}</p>
                  </div>
                </Link>
                <button type="button" className="ghost-button delete-button" onClick={() => handleDelete(horse.id)}>
                  Excluir
                </button>
              </div>
            ))}
            {!horses.length ? <p className="muted">Nenhum cavalo cadastrado.</p> : null}
          </div>
        </article>
      </section>
    </div>
  );
}
