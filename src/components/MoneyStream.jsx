import { moneyTopics } from '../data'

export default function MoneyStream() {
  return (
    <section className="section money-section">
      <div className="container">
        <div className="money-layout">
          <div>
            <span className="eyebrow">III потік МСММ</span>
            <h2 style={{ marginTop: 16, fontStyle: 'italic' }}>
              Присвячений темі «Ген грошей»
            </h2>
            <p style={{ marginTop: 16, color: 'var(--ink-500)', lineHeight: 1.6, maxWidth: 560 }}>
              Ми додатково вивчатимемо питання, які стоять за більшістю
              запитів підприємців і експертів: як перестати жити нижче рівня
              свого мислення?
            </p>

            <h3 style={{ marginTop: 32, fontSize: '1.1rem', fontFamily: 'var(--font-body)' }}>
              На менторських сесіях з Юлією Козачковою:
            </h3>
            <ul className="money-topics">
              {moneyTopics.map((t) => (
                <li key={t}>
                  <span className="plus">+</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="card outcomes-box">
              <h4>У результаті</h4>
              <p>Ви зміните підхід до фінансових рішень, доходу та цінності своєї роботи.</p>
              <p>
                А також опануєте інструменти, які дозволять працювати з темою
                грошей у професійній практиці — допомагаючи іншим людям
                виявляти та трансформувати їхні фінансові обмеження.
              </p>
            </div>

            <div style={{ marginTop: 28 }}>
              <a href="#pricing" className="btn btn-primary">
                Записатись на III потік
              </a>
            </div>
          </div>

          <div className="gift-card">
            <span className="kicker-gold">🎁 Отримай подарунок до старту навчання</span>
            <h4>Авторська книга-практикум «Ген грошей»</h4>
            <blockquote>
              «Я об’єднала свій 12-річний досвід роботи з підприємцями різного
              масштабу, наукову базу та коучинг, щоб передати вам систему
              мислення, що змінює підхід до фінансових результатів.»
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
