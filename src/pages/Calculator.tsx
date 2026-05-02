import { useState } from 'react';
import '../styles/calculator.css';

type AnimalType = 'piglet' | 'grower' | 'finisher' | 'sow_pregnant' | 'sow_lactating' | 'boar';

interface AnimalPreset {
  label: string;
  dailyFeed: number;
  protein: number;
  energy: number;
  description: string;
}

const presets: Record<AnimalType, AnimalPreset> = {
  piglet: {
    label: 'Поросята (до 30 кг)',
    dailyFeed: 1.0,
    protein: 20,
    energy: 13.5,
    description: 'Стартовий раціон. Висока потреба у білку та лізині.',
  },
  grower: {
    label: 'Молодняк на відгодівлі (30–60 кг)',
    dailyFeed: 2.2,
    protein: 18,
    energy: 13.0,
    description: 'Ростовий раціон. Акцент на збалансованому наборі ваги.',
  },
  finisher: {
    label: 'Відгодівля (60–110 кг)',
    dailyFeed: 3.0,
    protein: 15,
    energy: 12.8,
    description: 'Фінішний раціон. Зниження білку, збільшення калорійності.',
  },
  sow_pregnant: {
    label: 'Свиноматка вагітна',
    dailyFeed: 2.5,
    protein: 14,
    energy: 12.5,
    description: 'Помірне годування. Уникати ожиріння у першій половині поросності.',
  },
  sow_lactating: {
    label: 'Свиноматка підсосна',
    dailyFeed: 6.5,
    protein: 17,
    energy: 13.8,
    description: 'Максимальний раціон. Підтримка молочності та кондиції.',
  },
  boar: {
    label: 'Кнур-плідник',
    dailyFeed: 3.0,
    protein: 16,
    energy: 12.5,
    description: 'Стабільне годування. Уникати ожиріння.',
  },
};



export default function Calculator() {
  const [animalType, setAnimalType] = useState<AnimalType>('grower');
  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);
  const [customFeed, setCustomFeed] = useState(false);
  const [customDaily, setCustomDaily] = useState(2.5);

  const preset = presets[animalType];
  const daily = customFeed ? customDaily : preset.dailyFeed;
  const totalPerAnimal = daily * days;
  const totalAll = totalPerAnimal * count;

  const composition = [
    { name: 'Ячмінь', pct: 35 },
    { name: 'Пшениця', pct: 20 },
    { name: 'Кукурудза', pct: 15 },
    { name: 'Шрот соєвий', pct: 15 },
    { name: 'Шрот соняшниковий', pct: 10 },
    { name: 'Висівки', pct: 4 },
    { name: 'Премікс', pct: 1 },
  ];

  const costPerKg = 9.5;
  const totalCost = totalAll * costPerKg;

  return (
    <div className="page calc-page">
      <div className="page-header">
        <h1 className="page-title">Калькулятор корму</h1>
        <p className="page-subtitle">Розрахунок раціону та витрат на годування</p>
      </div>

      <div className="calc-layout">
        <div className="calc-left">
          <div className="card">
            <div className="card-title">Тип тварини</div>
            <div className="animal-types">
              {(Object.entries(presets) as [AnimalType, AnimalPreset][]).map(([key, p]) => (
                <button
                  key={key}
                  className={`animal-btn ${animalType === key ? 'active' : ''}`}
                  onClick={() => setAnimalType(key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title">Параметри розрахунку</div>

            <div className="form-group">
              <label className="form-label">Кількість голів</label>
              <input
                type="number"
                className="form-input"
                value={count}
                min={1}
                onChange={e => setCount(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Кількість днів</label>
              <input
                type="number"
                className="form-input"
                value={days}
                min={1}
                onChange={e => setDays(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={customFeed}
                  onChange={e => setCustomFeed(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Власна норма годування
              </label>
              {customFeed && (
                <input
                  type="number"
                  className="form-input"
                  value={customDaily}
                  step={0.1}
                  min={0.1}
                  onChange={e => setCustomDaily(Number(e.target.value))}
                  placeholder="кг/добу"
                />
              )}
            </div>
          </div>
        </div>

        <div className="calc-right">
          <div className="card preset-info">
            <div className="preset-description">{preset.description}</div>
            <div className="preset-specs">
              <div className="spec">
                <div className="spec-value">{daily} кг</div>
                <div className="spec-label">Добова норма</div>
              </div>
              <div className="spec">
                <div className="spec-value">{preset.protein}%</div>
                <div className="spec-label">Сирий протеїн</div>
              </div>
              <div className="spec">
                <div className="spec-value">{preset.energy} МДж</div>
                <div className="spec-label">ОЕ / кг</div>
              </div>
            </div>
          </div>

          <div className="card results-card">
            <div className="card-title">Результати</div>
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">На 1 тварину за {days} днів</div>
                <div className="result-value">{totalPerAnimal.toFixed(1)} кг</div>
              </div>
              <div className="result-item">
                <div className="result-label">На {count} голів за {days} днів</div>
                <div className="result-value highlight">{totalAll.toFixed(0)} кг</div>
              </div>
              <div className="result-item">
                <div className="result-label">Добова витрата на {count} голів</div>
                <div className="result-value">{(daily * count).toFixed(1)} кг/день</div>
              </div>
              <div className="result-item">
                <div className="result-label">Орієнтовні витрати</div>
                <div className="result-value cost">{totalCost.toFixed(0)} грн</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Орієнтовний склад раціону</div>
            <div className="composition">
              {composition.map(c => (
                <div key={c.name} className="comp-row">
                  <span className="comp-name">{c.name}</span>
                  <div className="comp-bar-wrap">
                    <div className="comp-bar" style={{ width: `${c.pct * 3}%` }} />
                  </div>
                  <span className="comp-pct">{c.pct}%</span>
                  <span className="comp-kg">{((totalAll * c.pct) / 100).toFixed(1)} кг</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
