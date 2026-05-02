import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Farrowing, Pig } from '../types';

const GESTATION_DAYS = 114;

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('uk-UA');
}

function daysUntil(d: string): number {
  return Math.round((new Date(d).getTime() - Date.now()) / 86400000);
}

const emptyForm = { sowId: '', sowName: '', matingDate: '', expectedDate: '', actualDate: '', pigletCount: '', notes: '' };

export default function Farrowings() {
  const [farrowings, setFarrowings] = useLocalStorage<Farrowing[]>('farrowings', []);
  const [pigs] = useLocalStorage<Pig[]>('pigs', []);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState<Farrowing | null>(null);
  const [form, setForm] = useState(emptyForm);

  const sows = pigs.filter(p => p.sex === 'female' && p.status !== 'sold' && p.status !== 'slaughtered');

  const handleMatingDate = (date: string) => {
    const expected = date ? addDays(date, GESTATION_DAYS) : '';
    setForm(f => ({ ...f, matingDate: date, expectedDate: expected }));
  };

  const handleSowChange = (id: string) => {
    const sow = pigs.find(p => p.id === id);
    setForm(f => ({ ...f, sowId: id, sowName: sow?.name || id }));
  };

  const openAdd = () => { setEdit(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r: Farrowing) => {
    setEdit(r);
    setForm({ ...r, pigletCount: r.pigletCount?.toString() || '', actualDate: r.actualDate || '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.matingDate) return;
    const record: Farrowing = {
      id: edit?.id || Date.now().toString(),
      sowId: form.sowId,
      sowName: form.sowName,
      matingDate: form.matingDate,
      expectedDate: form.expectedDate,
      actualDate: form.actualDate || undefined,
      pigletCount: form.pigletCount ? Number(form.pigletCount) : undefined,
      notes: form.notes,
    };
    if (edit) {
      setFarrowings(prev => prev.map(f => f.id === edit.id ? record : f));
    } else {
      setFarrowings(prev => [...prev, record]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Видалити запис?')) setFarrowings(prev => prev.filter(f => f.id !== id));
  };

  const sorted = [...farrowings].sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Опороси</h1>
          <p className="page-subtitle">Вагітність свиней становить {GESTATION_DAYS} днів (3 міс. 3 тиж. 3 дні)</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Додати запис</button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🐷</div>
          <p>Записів немає. Додайте перший опорос.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Свиноматка</th>
                <th>Дата парування</th>
                <th>Очікуваний опорос</th>
                <th>До опоросу</th>
                <th>Фактично</th>
                <th>Поросят</th>
                <th>Примітки</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(f => {
                const diff = daysUntil(f.expectedDate);
                const done = !!f.actualDate;
                return (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.sowName || '—'}</td>
                    <td>{formatDate(f.matingDate)}</td>
                    <td>{formatDate(f.expectedDate)}</td>
                    <td>
                      {done ? (
                        <span className="badge badge-gray">Завершено</span>
                      ) : diff < 0 ? (
                        <span className="badge badge-red">Прострочено</span>
                      ) : diff === 0 ? (
                        <span className="badge badge-orange">Сьогодні</span>
                      ) : diff <= 7 ? (
                        <span className="badge badge-orange">{diff} дн.</span>
                      ) : (
                        <span className="badge badge-green">{diff} дн.</span>
                      )}
                    </td>
                    <td>{f.actualDate ? formatDate(f.actualDate) : '—'}</td>
                    <td>{f.pigletCount ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.notes || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => openEdit(f)}>Ред.</button>
                        <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete(f.id)}>×</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{edit ? 'Редагування' : 'Новий запис'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Свиноматка</label>
              {sows.length > 0 ? (
                <select className="form-input" value={form.sowId} onChange={e => handleSowChange(e.target.value)}>
                  <option value="">— Обрати —</option>
                  {sows.map(s => <option key={s.id} value={s.id}>{s.name || `#${s.tag}`}</option>)}
                </select>
              ) : (
                <input className="form-input" value={form.sowName} onChange={e => setForm(f => ({ ...f, sowName: e.target.value }))} placeholder="Назва свиноматки" />
              )}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Дата парування</label>
                <input type="date" className="form-input" value={form.matingDate} onChange={e => handleMatingDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Очікуваний опорос (авто)</label>
                <input type="date" className="form-input" value={form.expectedDate} onChange={e => setForm(f => ({ ...f, expectedDate: e.target.value }))} />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Фактична дата опоросу</label>
                <input type="date" className="form-input" value={form.actualDate} onChange={e => setForm(f => ({ ...f, actualDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Кількість поросят</label>
                <input type="number" className="form-input" value={form.pigletCount} onChange={e => setForm(f => ({ ...f, pigletCount: e.target.value }))} />
              </div>
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
