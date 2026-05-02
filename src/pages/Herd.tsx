import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Pig } from '../types';
import '../styles/herd.css';

const breedOptions = ['Велика біла', 'Ландрас', 'Дюрок', 'П\'єтрен', 'Миргородська', 'Гемпшир', 'Гібрид', 'Інша'];

const statusLabel: Record<string, string> = {
  active: 'Активна', pregnant: 'Вагітна', sold: 'Продана', slaughtered: 'Забита',
};
const statusBadge: Record<string, string> = {
  active: 'badge-green', pregnant: 'badge-orange', sold: 'badge-gray', slaughtered: 'badge-gray',
};
const sexLabel: Record<string, string> = { male: 'Кнур', female: 'Свиноматка', castrated: 'Кастрат' };

function calcAge(birthDate: string): string {
  const diff = Date.now() - new Date(birthDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 60) return `${days} дн.`;
  if (days < 365) return `${Math.floor(days / 30)} міс.`;
  return `${(days / 365).toFixed(1)} р.`;
}

const emptyPig: Omit<Pig, 'id'> = {
  name: '', tag: '', breed: 'Велика біла', sex: 'female',
  birthDate: '', weight: 0, status: 'active', notes: '',
};

export default function Herd() {
  const [pigs, setPigs] = useLocalStorage<Pig[]>('pigs', []);
  const [showModal, setShowModal] = useState(false);
  const [editPig, setEditPig] = useState<Pig | null>(null);
  const [form, setForm] = useState<Omit<Pig, 'id'>>(emptyPig);
  const [filter, setFilter] = useState<'all' | 'active' | 'pregnant'>('all');

  const filtered = pigs.filter(p => {
    if (filter === 'all') return p.status !== 'sold' && p.status !== 'slaughtered';
    return p.status === filter;
  });

  const openAdd = () => { setEditPig(null); setForm(emptyPig); setShowModal(true); };
  const openEdit = (p: Pig) => { setEditPig(p); setForm({ ...p }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name && !form.tag) return;
    if (editPig) {
      setPigs(prev => prev.map(p => p.id === editPig.id ? { ...form, id: editPig.id } : p));
    } else {
      setPigs(prev => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Видалити запис?')) setPigs(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Облік поголів'я</h1>
          <p className="page-subtitle">{pigs.filter(p => p.status === 'active' || p.status === 'pregnant').length} активних тварин</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Додати тварину</button>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {(['all', 'active', 'pregnant'] as const).map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Усі' : f === 'active' ? 'Активні' : 'Вагітні'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🐷</div>
          <p>Немає записів. Додайте першу тварину.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Кличка / Мітка</th>
                <th>Порода</th>
                <th>Стать</th>
                <th>Вік</th>
                <th>Вага, кг</th>
                <th>Статус</th>
                <th>Примітки</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>#{p.tag || '—'}</div>
                  </td>
                  <td>{p.breed}</td>
                  <td>{sexLabel[p.sex]}</td>
                  <td>{p.birthDate ? calcAge(p.birthDate) : '—'}</td>
                  <td>{p.weight > 0 ? p.weight : '—'}</td>
                  <td><span className={`badge ${statusBadge[p.status]}`}>{statusLabel[p.status]}</span></td>
                  <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{p.notes || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => openEdit(p)}>Ред.</button>
                      <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete(p.id)}>×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editPig ? 'Редагування' : 'Нова тварина'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Кличка</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Рябка" />
              </div>
              <div className="form-group">
                <label className="form-label">Мітка / Номер</label>
                <input className="form-input" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="001" />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Порода</label>
                <select className="form-input" value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}>
                  {breedOptions.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Стать</label>
                <select className="form-input" value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value as Pig['sex'] }))}>
                  <option value="female">Свиноматка</option>
                  <option value="male">Кнур</option>
                  <option value="castrated">Кастрат</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Дата народження</label>
                <input type="date" className="form-input" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Вага (кг)</label>
                <input type="number" className="form-input" value={form.weight || ''} onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Статус</label>
              <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Pig['status'] }))}>
                <option value="active">Активна</option>
                <option value="pregnant">Вагітна</option>
                <option value="sold">Продана</option>
                <option value="slaughtered">Забита</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Примітки</label>
              <textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Скасувати</button>
              <button className="btn btn-primary" onClick={handleSave}>Зберегти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
