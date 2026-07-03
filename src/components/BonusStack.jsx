import { bonusStack } from '../data'

export default function BonusStack() {
  const total = bonusStack.reduce((sum, b) => sum + parseInt(b.price, 10), 0)

  return (
    <section className="section" style={{ background: 'var(--cream-50)' }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">При записі до кінця передзапису</span>
          <h2 style={{ marginTop: 16 }}>Бонуси, які ви отримаєте безкоштовно</h2>
          <p>Ці матеріали ми не продаємо окремо — вони входять у пакет для тих, хто записується на III потік зараз.</p>
        </div>

        <div className="bonus-list">
          {bonusStack.map((b) => (
            <div className="card bonus-row" key={b.title}>
              <div className="bonus-row-body">
                <h4>{b.title}</h4>
                <p>{b.text}</p>
              </div>
              <div className="bonus-row-price">
                <span className="old-price">{b.price}</span>
                <span className="new-price">0€</span>
              </div>
            </div>
          ))}
        </div>

        <p className="bonus-total">
          Загальна цінність бонусів — <strong>{total}€</strong>, при оплаті зараз усі входять у вартість навчання.
        </p>
      </div>
    </section>
  )
}
