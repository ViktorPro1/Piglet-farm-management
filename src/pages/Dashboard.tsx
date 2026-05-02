import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Pig, Farrowing, Vaccination } from "../types";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [pigs] = useLocalStorage<Pig[]>("pigs", []);
  const [farrowings] = useLocalStorage<Farrowing[]>("farrowings", []);
  const [vaccinations] = useLocalStorage<Vaccination[]>("vaccinations", []);

  const activePigs = pigs.filter(
    (p) => p.status === "active" || p.status === "pregnant",
  );
  const sows = pigs.filter(
    (p) =>
      p.sex === "female" && p.status !== "sold" && p.status !== "slaughtered",
  );
  const boars = pigs.filter(
    (p) =>
      p.sex === "male" && p.status !== "sold" && p.status !== "slaughtered",
  );

  const today = new Date();
  const upcoming = farrowings.filter((f) => {
    const d = new Date(f.expectedDate);
    const diff = (d.getTime() - today.getTime()) / 86400000;
    return diff >= 0 && diff <= 14 && !f.actualDate;
  });

  const upcomingVax = vaccinations.filter((v) => {
    if (!v.nextDate) return false;
    const d = new Date(v.nextDate);
    const diff = (d.getTime() - today.getTime()) / 86400000;
    return diff >= 0 && diff <= 14;
  });

  const stats = [
    {
      label: "Всього тварин",
      value: activePigs.length,
      icon: "◈",
      color: "accent",
    },
    { label: "Свиноматки", value: sows.length, icon: "◉", color: "orange" },
    { label: "Кнури", value: boars.length, icon: "◎", color: "yellow" },
    {
      label: "Вагітних",
      value: pigs.filter((p) => p.status === "pregnant").length,
      icon: "✦",
      color: "green",
    },
  ];

  return (
    <div className="page dashboard">
      <div className="page-header">
        <h1 className="page-title">Головна</h1>
        <p className="page-subtitle">
          {today.toLocaleDateString("uk-UA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className={`stat-card stat-${s.color}`} key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-title">Найближчі опороси (14 днів)</div>
          {upcoming.length === 0 ? (
            <div className="empty-small">Немає запланованих опоросів</div>
          ) : (
            <ul className="event-list">
              {upcoming.map((f) => {
                const d = new Date(f.expectedDate);
                const diff = Math.round(
                  (d.getTime() - today.getTime()) / 86400000,
                );
                return (
                  <li key={f.id} className="event-item">
                    <div className="event-dot dot-orange" />
                    <div>
                      <div className="event-name">{f.sowName}</div>
                      <div className="event-date">
                        {d.toLocaleDateString("uk-UA")} · через {diff} дн.
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-title">Найближчі вакцинації (14 днів)</div>
          {upcomingVax.length === 0 ? (
            <div className="empty-small">Немає запланованих вакцинацій</div>
          ) : (
            <ul className="event-list">
              {upcomingVax.map((v) => {
                const d = new Date(v.nextDate!);
                const diff = Math.round(
                  (d.getTime() - today.getTime()) / 86400000,
                );
                return (
                  <li key={v.id} className="event-item">
                    <div className="event-dot dot-accent" />
                    <div>
                      <div className="event-name">
                        {v.pigName} — {v.vaccine}
                      </div>
                      <div className="event-date">
                        {d.toLocaleDateString("uk-UA")} · через {diff} дн.
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {pigs.length === 0 && (
        <div className="welcome-banner">
          <div className="welcome-icon">🐖</div>
          <h2>Ласкаво просимо до П’ятачок</h2>
          <p>
            Почніть з додавання тварин у розділі "Поголів'я" або ознайомтесь з
            породами свиней.
          </p>
        </div>
      )}
    </div>
  );
}
