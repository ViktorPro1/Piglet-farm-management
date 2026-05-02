import { useState } from 'react';
import { diseases } from '../data';
import '../styles/diseases.css';

const severityLabel = { low: 'Низька', medium: 'Середня', high: 'Висока' };
const severityBadge = { low: 'badge-green', medium: 'badge-orange', high: 'badge-red' };

export default function Diseases() {
  const [selected, setSelected] = useState(diseases[0]);
  const [search, setSearch] = useState('');

  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page diseases-page">
      <div className="page-header">
        <h1 className="page-title">Довідник хвороб</h1>
        <p className="page-subtitle">Симптоми, лікування та профілактика</p>
      </div>

      <div className="diseases-layout">
        <div className="diseases-list">
          <input
            className="form-input"
            placeholder="Пошук за назвою або симптомом..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          {filtered.map(d => (
            <button
              key={d.id}
              className={`disease-item ${selected.id === d.id ? 'active' : ''}`}
              onClick={() => setSelected(d)}
            >
              <div>
                <div className="disease-item-name">{d.name}</div>
                <span className={`badge ${severityBadge[d.severity]}`} style={{ marginTop: 4 }}>
                  Небезпека: {severityLabel[d.severity]}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ color: 'var(--text-3)', fontSize: 13, padding: '12px 0' }}>Нічого не знайдено</div>
          )}
        </div>

        <div className="disease-detail card">
          <div className="disease-header">
            <h2 className="disease-name">{selected.name}</h2>
            <span className={`badge ${severityBadge[selected.severity]}`}>
              Небезпека: {severityLabel[selected.severity]}
            </span>
          </div>

          <div className="disease-section">
            <div className="disease-section-title symptoms-title">Симптоми</div>
            <ul className="symptom-list">
              {selected.symptoms.map((s, i) => (
                <li key={i}>
                  <span className="symptom-dot" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="disease-section">
            <div className="disease-section-title treatment-title">Лікування</div>
            <p className="disease-text">{selected.treatment}</p>
          </div>

          <div className="disease-section">
            <div className="disease-section-title prevention-title">Профілактика</div>
            <p className="disease-text">{selected.prevention}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
