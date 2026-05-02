import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Vaccination, Pig } from '../types';

const vaccineOptions = [
  'КЧС (класична чума свиней)',
  'Бешиха',
  'Парвовірус',
  'Цирковірус (ЦВС-2)',
  'РРСС',
  'Лептоспіроз',
  'Мікоплазмоз',
  'Глистогінний (івермектин)',
  'Інша',
];

function formatDate(d: string) { return new Date(d).toLocaleDateString('uk-UA'); }
function daysUntil(d: string): number { return Math.round((new Date(d).getTime() - Date.now()) / 86400000); }

const emptyForm = { pigId: '', pigName: '', vaccine: vaccineOptions[0], date: '', nextDate: '', dose: '', notes: '' };

export default function Vaccinations() {
  const [vaccinations, setVaccinations] = useLocalStorage<Vaccination[]>('vaccinations', []);
  const [pigs] = useLocalStorage<Pig[]>('pigs', []);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState<Vaccination | null>(null);
  const [form, setForm] = useState(emptyForm);

  const activePigs = pigs.filter(p => p.status !== 'sold' && p.status !== 'slaughtered');

  const handlePigChange = (id: string) => {
    const pig = pigs.find(p => p.id === id);
    setForm(f => ({ ...f, pigId: id, pigName: pig?.name || id }));
  };

  const openAdd = () => { setEdit(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (v: Vaccination) => { setEdit(v); setForm({ ...v, nextDate: v.nextDate ?? '' }); setShowModal(true); };

  const handleSave = () => {
    if (!form.date || !form.vaccine) return;
    const record: Vaccination = { id: edit?.id || Date.now().toString(), ...form };
    if (edit) {
      setVaccinations(prev => prev.map(v => v.id === edit.id ? record : v));
    } else {
      setVaccinations(prev => [...prev, record]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Видалити?')) setVaccinations(prev => prev.filter(v => v.id !== id));
  };

  const sorted = [...vaccinations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Вакцинація та обробки</h1>
          <p className="page-subtitle">Облік щеплень, дегельмінтизацій та інших обробок</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Додати запис</button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <p>Записів немає. Додайте перше щеплення.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Тварина</th>
                <th>Препарат / Вакцина</th>
                <th>Дата</th>
                <th>Доза</th>
                <th>Наступна обробка</th>
                <th>Примітки</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(v => {
                const diff = v.nextDate ? daysUntil(v.nextDate) : null;
                return (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.pigName || '—'}</td>
                    <td>{v.vaccine}</td>
                    <td>{formatDate(v.date)}</td>
                    <td>{v.dose || '—'}</td>
                    <td>
                      {v.nextDate ? (
                        <>
                          <div>{formatDate(v.nextDate)}</div>
                          {diff !== null && (
                            <span className={`badge ${diff < 0 ? 'badge-red' : diff <= 7 ? 'badge-orange' : 'badge-green'}`} style={{ marginTop: 4 }}>
                              {diff < 0 ? 'Прострочено' : diff === 0 ? 'Сьогодні' : `${diff} дн.`}
                            </span>
                          )}
                        </>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{v.notes || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => openEdit(v)}>Ред.</button>
                        <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete(v.id)}>×</button>
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
              <label className="form-label">Тварина</label>
              {activePigs.length > 0 ? (
                <select className="form-input" value={form.pigId} onChange={e => handlePigChange(e.target.value)}>
                  <option value="">— Обрати або ввести вручну —</option>
                  {activePigs.map(p => <option key={p.id} value={p.id}>{p.name || `#${p.tag}`}</option>)}
                </select>
              ) : null}
              {(!form.pigId || activePigs.length === 0) && (
                <input className="form-input" style={{ marginTop: 6 }} value={form.pigName} onChange={e => setForm(f => ({ ...f, pigName: e.target.value }))} placeholder="Назва або номер тварини" />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Препарат / Вакцина</label>
              <select className="form-input" value={form.vaccine} onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))}>
                {vaccineOptions.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Дата обробки</label>
                <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Наступна обробка</label>
                <input type="date" className="form-input" value={form.nextDate} onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Доза</label>
              <input className="form-input" value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} placeholder="напр. 2 мл" />
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
