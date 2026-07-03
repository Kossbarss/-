const features = [
  { icon: '01', title: 'Структуровані модулі з матеріалами', text: 'Записи лекцій, завдання, робочі матеріали та додаткові файли.' },
  { icon: '02', title: 'Навчальні ресурси', text: 'Усе, щоб навчатись системно, без зайвих пошуків.' },
  { icon: '03', title: 'Засвоєння матеріалу', text: 'Прогрес по кожному модулю та курсу видно одразу.' },
]

export default function Platform() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Навчальна платформа</span>
          <h2 style={{ marginTop: 16 }}>Що чекає на платформі?</h2>
          <p>
            Навчальна платформа — це середовище для проходження навчання,
            зручного доступу до матеріалів та організації етапів роботи на
            програмі.
          </p>
        </div>

        <div className="platform-layout">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem' }}>
              Структуровані модулі з матеріалами
            </h3>
            <p style={{ color: 'var(--ink-500)', marginTop: 10, lineHeight: 1.6 }}>
              Кожен модуль містить записи лекцій, завдання, робочі матеріали
              та додаткові файли. Усе, щоб навчатись системно, без зайвих
              пошуків.
            </p>
            <div className="platform-features">
              {features.map((f) => (
                <div className="platform-feature" key={f.title}>
                  <span className="icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginTop: 4 }}>
                      {f.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="platform-mock">
            <div className="platform-mock-top">
              <span>⬢</span> МСММ · I потік
            </div>
            <div className="platform-mock-body">
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-500)', marginBottom: 12 }}>
                Модуль 1 · Додаткові матеріали
              </p>
              <h4 style={{ marginBottom: 16 }}>Урок 1. Інструменти / Книги / Медитації</h4>
              <div className="platform-mock-row">
                <span>Інформація</span>
                <span>✓</span>
              </div>
              <div className="platform-mock-row">
                <span>Запис лекції</span>
                <span>✓</span>
              </div>
              <div className="platform-mock-row">
                <span>Робочий зошит</span>
                <span>—</span>
              </div>
              <div className="platform-mock-row">
                <span>Домашнє завдання</span>
                <span>—</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
