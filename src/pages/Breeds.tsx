import { useState } from 'react';
import { breeds } from '../data';
import '../styles/breeds.css';

const directionLabel: Record<string, string> = {
  meat: 'М\'ясний',
  bacon: 'Беконний',
  fat: 'Сально-м\'ясний',
  combined: 'Комбінований',
};

const directionBadge: Record<string, string> = {
  meat: 'badge-red',
  bacon: 'badge-orange',
  fat: 'badge-yellow',
  combined: 'badge-green',
};

export default function Breeds() {
  const [selected, setSelected] = useState(breeds[0]);

  return (
    <div className="page breeds-page">
      <div className="page-header">
        <h1 className="page-title">Породи свиней</h1>
        <p className="page-subtitle">Основні характеристики та рекомендації</p>
      </div>

      <div className="breeds-layout">
        <div className="breeds-list">
          {breeds.map(b => (
            <button
              key={b.id}
              className={`breed-item ${selected.id === b.id ? 'active' : ''}`}
              onClick={() => setSelected(b)}
            >
              <div className="breed-swatch" style={{ background: b.imageColor }} />
              <div>
                <div className="breed-item-name">{b.name}</div>
                <div className="breed-item-origin">{b.origin}</div>
              </div>
              <span className={`badge ${directionBadge[b.direction]} breed-badge`}>
                {directionLabel[b.direction]}
              </span>
            </button>
          ))}
        </div>

        <div className="breed-detail card">
          <div className="breed-header">
            <div className="breed-avatar" style={{ background: selected.imageColor }}>
              <span>🐷</span>
            </div>
            <div>
              <h2 className="breed-name">{selected.name}</h2>
              <div className="breed-meta">
                <span>{selected.origin}</span>
                <span>·</span>
                <span className={`badge ${directionBadge[selected.direction]}`}>
                  {directionLabel[selected.direction]}
                </span>
              </div>
            </div>
          </div>

          <p className="breed-desc">{selected.description}</p>

          <div className="breed-stats">
            <div className="breed-stat">
              <div className="breed-stat-value">{selected.avgWeight} кг</div>
              <div className="breed-stat-label">Середня вага</div>
            </div>
            <div className="breed-stat">
              <div className="breed-stat-value">{selected.avgLitter}</div>
              <div className="breed-stat-label">Поросят в опоросі</div>
            </div>
          </div>

          <div className="breed-pros-cons">
            <div className="breed-pros">
              <div className="pros-title">Переваги</div>
              <ul>
                {selected.pros.map((p, i) => (
                  <li key={i}><span className="pro-dot">+</span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="breed-cons">
              <div className="cons-title">Недоліки</div>
              <ul>
                {selected.cons.map((c, i) => (
                  <li key={i}><span className="con-dot">−</span>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
