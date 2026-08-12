import { useState } from 'react'
import { randInt, shuffle, answerState, ordinal } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const ITEMS = [
  { id: 'pencil', label: 'pencil' },
  { id: 'stick', label: 'stick' },
  { id: 'cucumber', label: 'cucumber' },
  { id: 'carrot', label: 'carrot' },
]

function ItemShape({ type, height }) {
  const width = Math.max(20, Math.round(height * 0.3))
  const props = { width, height, viewBox: '0 0 30 100', preserveAspectRatio: 'none' }
  if (type === 'pencil') {
    return (
      <svg {...props} aria-hidden="true">
        <rect x="8" y="10" width="14" height="82" fill="#f7c948" rx="1" />
        <polygon points="15,0 21,10 9,10" fill="#8b5a2b" />
        <rect x="8" y="92" width="14" height="4" fill="#adb5bd" />
        <rect x="9" y="96" width="12" height="5" fill="#ff8fab" rx="2" />
      </svg>
    )
  }
  if (type === 'carrot') {
    return (
      <svg {...props} aria-hidden="true">
        <polygon points="15,0 24,0 21,100 9,100" fill="#f4a261" />
        <rect x="12" y="34" width="6" height="3" fill="#e76f51" rx="1" />
        <rect x="13" y="64" width="5" height="3" fill="#e76f51" rx="1" />
        <path d="M15 0 C 7 6, 5 14, 9 20 L 15 12 Z" fill="#2d6a4f" />
        <path d="M15 0 C 23 6, 25 14, 21 20 L 15 12 Z" fill="#2d6a4f" />
        <path d="M15 0 L 15 15 L 11 11 Z" fill="#40916c" />
      </svg>
    )
  }
  if (type === 'cucumber') {
    return (
      <svg {...props} aria-hidden="true">
        <rect x="6" y="0" width="18" height="100" rx="9" fill="#52b788" />
        <rect x="6" y="6" width="18" height="5" rx="2.5" fill="#2d9a4e" />
        <rect x="6" y="89" width="18" height="5" rx="2.5" fill="#2d9a4e" />
        <line x1="11" y1="20" x2="11" y2="80" stroke="#2d6a4f" strokeWidth="1.5" />
        <line x1="19" y1="20" x2="19" y2="80" stroke="#2d6a4f" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg {...props} aria-hidden="true">
      <rect x="8" y="0" width="14" height="100" rx="4" fill="#a98467" />
      <line x1="14" y1="10" x2="14" y2="90" stroke="#8a6843" strokeWidth="2" />
      <line x1="18" y1="24" x2="18" y2="78" stroke="#8a6843" strokeWidth="1.5" />
    </svg>
  )
}

function makeQuestion(settings) {
  const item = ITEMS[randInt(0, ITEMS.length - 1)]
  const lengths = shuffle(
    Array.from({ length: settings.count }, (_, i) => settings.maxLen - i * settings.step),
  )
  const askLongest = Math.random() < 0.5
  const target = askLongest ? Math.max(...lengths) : Math.min(...lengths)
  return { item, lengths, askLongest, answer: lengths.indexOf(target) }
}

function LongShortGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  const ask = q.askLongest ? 'longest' : 'shortest'

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        Tap the {ask} {q.item.label}.
      </div>
      <div className="longest-area" style={{ '--pencils': q.lengths.length }}>
        <div className="pencil-row">
          {q.lengths.map((len, i) => (
            <button
              key={i}
              type="button"
              className={`pencil-btn ${answerState(disabled, i === q.answer)}`}
              disabled={disabled}
              onClick={() =>
                answer(
                  {
                    isCorrect: i === q.answer,
                    game: gameName,
                    question: `Tap the ${ask} ${q.item.label}`,
                    selected: `${q.item.label} ${i + 1}`,
                    correctAnswer: ask,
                  },
                  5000,
                  nextQuestion,
                )
              }
            >
              <ItemShape type={q.item.id} height={len * 18} />
            </button>
          ))}
        </div>
        <div className="pencil-ground" aria-hidden="true" />
        <div className="pencil-nums" aria-hidden="true">
          {q.lengths.map((_, i) => (
            <span key={i} className="pencil-num">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
      <Feedback
        feedback={feedback}
        correctAnswer={ask}
        disabled={disabled}
        onNext={next}
        wrongHint={`It was the ${ordinal(q.answer + 1)} one.`}
      />
    </div>
  )
}

export default LongShortGame
