import { useEffect, useState } from "react";
import { request } from "../lib/api";

const careTypeLabels = {
  shoeing: "Ferrageamento",
  dentistry: "Odontologia",
  vaccine: "Vacinas",
  deworming: "Vermifugacao",
};

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const [dashboardData, alertSettings] = await Promise.all([
        request("/dashboard"),
        request("/alerts/settings"),
      ]);
      setData(dashboardData);
      setSettings(alertSettings);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSettingChange(careType, changes) {
    try {
      const current = settings.find((item) => item.careType === careType);
      const updated = await request(`/alerts/settings/${careType}`, {
        method: "PUT",
        body: JSON.stringify({
          intervalDays: Number(changes.intervalDays ?? current.intervalDays),
          enabled: typeof changes.enabled === "boolean" ? changes.enabled : Boolean(current.enabled),
        }),
      });

      setSettings((prev) => prev.map((item) => (item.careType === careType ? updated : item)));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!data) {
    return <p>Carregando dashboard...</p>;
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Resumo operacional</h2>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card"><strong>{data.totalHorses}</strong><span>Cavalos</span></article>
        <article className="stat-card"><strong>{data.pendingAlerts}</strong><span>Alertas pendentes</span></article>
        <article className="stat-card"><strong>{data.recentFeedings}</strong><span>Alimentacoes na semana</span></article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h3>Alertas automaticos</h3>
          <div className="timeline-list">
            {data.alerts.length ? data.alerts.map((alert) => (
              <div key={alert.id} className={`timeline-card ${alert.status}`}>
                <strong>{alert.horseName}</strong>
                <p>{careTypeLabels[alert.careType] || alert.careType} ate {new Date(alert.nextDueAt).toLocaleDateString("pt-BR")}</p>
              </div>
            )) : <p className="muted">Nenhum alerta pendente.</p>}
          </div>
        </article>

        <article className="panel">
          <h3>Ultimos pesos</h3>
          <div className="timeline-list">
            {data.latestWeights.length ? data.latestWeights.map((item, index) => (
              <div key={`${item.horseName}-${index}`} className="timeline-card">
                <strong>{item.horseName}</strong>
                <p>{item.weightKg} kg em {new Date(item.recordDate).toLocaleDateString("pt-BR")}</p>
              </div>
            )) : <p className="muted">Sem registros recentes.</p>}
          </div>
        </article>
      </section>

      <section className="panel">
        <h3>Configuracao de prazos</h3>
        <div className="timeline-list">
          {settings.map((item) => (
            <div key={item.id} className="timeline-card settings-row">
              <div>
                <strong>{careTypeLabels[item.careType] || item.careType}</strong>
                <p>{item.enabled ? "Ativo" : "Desativado"}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.intervalDays}
                onChange={(event) => handleSettingChange(item.careType, { intervalDays: event.target.value })}
              />
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={Boolean(item.enabled)}
                  onChange={(event) => handleSettingChange(item.careType, { enabled: event.target.checked })}
                />
                habilitado
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
