export default function AssociationTransition() {
  return (
    <section className="section">
      <div className="container">
        <div className="card association-strip">
          <div>
            <h3>Перша Українська Асоціація Ментор-Коучів</h3>
            <p>Знайди свого фахівця</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="avatar-row">
              <span className="avatar" />
              <span className="avatar" />
              <span className="avatar" />
            </div>
            <a href="#pricing" className="link-arrow">
              Розгорнути →
            </a>
          </div>
        </div>

        <div className="transition-block">
          <h2>
            Ти вже хороший фахівець. <em>Настав час стати дорогим</em>
          </h2>

          <ul className="transition-list">
            <li>
              <span className="plus">+</span>
              <span>
                Я знаю, як це — бути хорошим фахівцем, багато вчитись, бути
                емпатичним і тонко відчувати людей.
              </span>
            </li>
            <li>
              <span className="plus">+</span>
              <span>
                Але правда в тому, що світ не платить «за глибину», кількість
                сертифікатів, і те, скільки ти вчився.
              </span>
            </li>
            <li>
              <span className="plus">+</span>
              <span>
                Платять за те, що можеш змінити — за ясність, результат і
                рішучість, які ти приносиш.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
