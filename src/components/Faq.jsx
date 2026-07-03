import { useState } from 'react'
import { faq } from '../data'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Питання</span>
          <h2 style={{ marginTop: 16 }}>Q/A</h2>
        </div>

        <div className="faq-list">
          {faq.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="q-text">{item.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
