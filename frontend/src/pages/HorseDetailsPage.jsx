import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../services/api";

const feedingInitial = { feedingDate: "", feedType: "", feedQuantityKg: "", hayQuantityKg: "", notes: "" };
const weightInitial = { recordDate: "", weightKg: "", notes: "" };
const careInitial = { careType: "shoeing", performedAt: "", nextDueAt: "", providerName: "", notes: "" };
const reproductionInitial = { breedingDate: "", estimatedBirthDate: "", actualBirthDate: "", weaningDate: "", notes: "" };

export function HorseDetailsPage() {
  const { horseId } = useParams();
  const [horse, setHorse] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [summary, setSummary] = useState({ feedings: 0, weights: 0, care: 0, reproduction: 0 });
  const [feedingForm, setFeedingForm] = useState(feedingInitial);
  const [weightForm, setWeightForm] = useState(weightInitial);
  const [careForm, setCareForm] = useState(careInitial);
  const [reproductionForm, setReproductionForm] = useState(reproductionInitial);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const [horseRes, feedingRes, weightRes, careRes, reproductionRes, timelineRes] = await Promise.all([
        request({ url: `/api/horses/${horseId}`, method: "GET" }),
        request({ url: `/api/horses/${horseId}/feedings`, method: "GET" }),
        request({ url: `/api/horses/${horseId}/weights`, method: "GET" }),
        request({ url: `/api/horses/${horseId}/care-records`, method: "GET" }),
        request({ url: `/api/horses/${horseId}/reproduction-records`, method: "GET" }),
        request({ url: `/api/horses/${horseId}/timeline`, method: "GET" }),
      ]);

      setHorse(horseRes);
      setTimeline(timelineRes);
      setSummary({
        feedings: feedingRes.length,
        weights: weightRes.length,
        care: careRes.length,
        reproduction: reproductionRes.length,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [horseId]);

  async function submit(path, payload, reset) {
    try {
      await request({
        url: `/api${path}`,
        method: "POST",
        data: payload,
      });
      reset();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!horse) {
    return <p>Carregando cavalo...</p>;
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Detalhes do cavalo</p>
          <h2>{horse.name}</h2>
          <p className="muted">{horse.breed} | Tag {horse.tagNumber}</p>
        </div>
        {horse.photoUrl ? <img className="horse-details-photo" src={horse.photoUrl} alt={horse.name} /> : null}
      </section>

      <section className="content-grid">
        <form className="panel card-form" onSubmit={(e) => {
          e.preventDefault();
          submit(`/horses/${horseId}/feedings`, feedingForm, () => setFeedingForm(feedingInitial));
        }}>
          <h3>Alimentacao</h3>
          <input type="date" value={feedingForm.feedingDate} onChange={(e) => setFeedingForm((p) => ({ ...p, feedingDate: e.target.value }))} />
          <input placeholder="Tipo de racao" value={feedingForm.feedType} onChange={(e) => setFeedingForm((p) => ({ ...p, feedType: e.target.value }))} />
          <input placeholder="Kg de racao" value={feedingForm.feedQuantityKg} onChange={(e) => setFeedingForm((p) => ({ ...p, feedQuantityKg: e.target.value }))} />
          <input placeholder="Kg de feno" value={feedingForm.hayQuantityKg} onChange={(e) => setFeedingForm((p) => ({ ...p, hayQuantityKg: e.target.value }))} />
          <textarea placeholder="Observacoes" value={feedingForm.notes} onChange={(e) => setFeedingForm((p) => ({ ...p, notes: e.target.value }))} />
          <button type="submit">Salvar alimentacao</button>
        </form>

        <form className="panel card-form" onSubmit={(e) => {
          e.preventDefault();
          submit(`/horses/${horseId}/weights`, weightForm, () => setWeightForm(weightInitial));
        }}>
          <h3>Peso</h3>
          <input type="date" value={weightForm.recordDate} onChange={(e) => setWeightForm((p) => ({ ...p, recordDate: e.target.value }))} />
          <input placeholder="Peso em kg" value={weightForm.weightKg} onChange={(e) => setWeightForm((p) => ({ ...p, weightKg: e.target.value }))} />
          <textarea placeholder="Observacoes" value={weightForm.notes} onChange={(e) => setWeightForm((p) => ({ ...p, notes: e.target.value }))} />
          <button type="submit">Salvar peso</button>
        </form>
      </section>

      <section className="content-grid">
        <form className="panel card-form" onSubmit={(e) => {
          e.preventDefault();
          submit(`/horses/${horseId}/care-records`, careForm, () => setCareForm(careInitial));
        }}>
          <h3>Manejo preventivo</h3>
          <select value={careForm.careType} onChange={(e) => setCareForm((p) => ({ ...p, careType: e.target.value }))}>
            <option value="shoeing">Ferrageamento</option>
            <option value="dentistry">Odontologia</option>
            <option value="vaccine">Vacina</option>
            <option value="deworming">Vermifugacao</option>
          </select>
          <input type="date" value={careForm.performedAt} onChange={(e) => setCareForm((p) => ({ ...p, performedAt: e.target.value }))} />
          <input type="date" value={careForm.nextDueAt} onChange={(e) => setCareForm((p) => ({ ...p, nextDueAt: e.target.value }))} />
          <input placeholder="Responsavel" value={careForm.providerName} onChange={(e) => setCareForm((p) => ({ ...p, providerName: e.target.value }))} />
          <textarea placeholder="Observacoes" value={careForm.notes} onChange={(e) => setCareForm((p) => ({ ...p, notes: e.target.value }))} />
          <button type="submit">Salvar manejo</button>
        </form>

        <form className="panel card-form" onSubmit={(e) => {
          e.preventDefault();
          submit(`/horses/${horseId}/reproduction-records`, reproductionForm, () => setReproductionForm(reproductionInitial));
        }}>
          <h3>Reproducao</h3>
          <input type="date" value={reproductionForm.breedingDate} onChange={(e) => setReproductionForm((p) => ({ ...p, breedingDate: e.target.value }))} />
          <input type="date" value={reproductionForm.estimatedBirthDate} onChange={(e) => setReproductionForm((p) => ({ ...p, estimatedBirthDate: e.target.value }))} />
          <input type="date" value={reproductionForm.actualBirthDate} onChange={(e) => setReproductionForm((p) => ({ ...p, actualBirthDate: e.target.value }))} />
          <input type="date" value={reproductionForm.weaningDate} onChange={(e) => setReproductionForm((p) => ({ ...p, weaningDate: e.target.value }))} />
          <textarea placeholder="Observacoes" value={reproductionForm.notes} onChange={(e) => setReproductionForm((p) => ({ ...p, notes: e.target.value }))} />
          <button type="submit">Salvar reproducao</button>
        </form>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h3>Timeline</h3>
          <div className="timeline-list">
            {timeline.map((item, index) => (
              <div key={`${item.type}-${index}`} className="timeline-card">
                <strong>{item.title}</strong>
                <p>{new Date(item.date).toLocaleDateString("pt-BR")} | {item.description}</p>
              </div>
            ))}
            {!timeline.length ? <p className="muted">Sem historico ainda.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h3>Resumo</h3>
          <div className="timeline-list">
            <div className="timeline-card"><strong>{summary.feedings}</strong><p>alimentacoes</p></div>
            <div className="timeline-card"><strong>{summary.weights}</strong><p>pesagens</p></div>
            <div className="timeline-card"><strong>{summary.care}</strong><p>manejos</p></div>
            <div className="timeline-card"><strong>{summary.reproduction}</strong><p>registros de reproducao</p></div>
          </div>
        </article>
      </section>
    </div>
  );
}
