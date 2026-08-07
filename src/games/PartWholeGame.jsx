import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const findWhole = Math.random() < 0.5
  if (findWhole) {
    const a = randInt(1, settings.maxWhole - 1)
    const b = randInt(1, settings.maxWhole - a)
    return { a, b, whole: a + b, unknown: 'whole', answer: a + b }
  }
  const w = randInt(3, settings.maxWhole)
  const a = randInt(1, w - 1)
  const b = w - a
  const missingA = Math.random() < 0.5
  return {
    a: missingA ? null : a,
    b: missingA ? b : null,
    whole: w,
    unknown: missingA ? 'a' : 'b',
    answer: missingA ? a : b,
  }
}

function makeChoices(answer) {
  return uniqueChoices(answer, () => Math.max(1, answer + randInt(-3, 3)), 3)
}

function PartWholeModel({ a, b, whole, unknown }) {
  return (
    <svg
      className="partwhole-svg"
      viewBox="0 0 320 230"
      role="img"
      aria-label="Part whole model: two smaller circles join into one big circle"
    >
      <line x1="160" y1="60" x2="80" y2="170" stroke="#3a2e3f" strokeWidth="5" />
      <line x1="160" y1="60" x2="240" y2="170" stroke="#3a2e3f" strokeWidth="5" />
      <circle cx="160" cy="60" r="50" fill="#fff8e1" stroke="#b08968" strokeWidth="5" />
      <text x="160" y="78" textAnchor="middle" fontSize="34" fontWeight="800" fill="#3a2e3f">
        {unknown === 'whole' ? '?' : whole}
      </text>
      <circle cx="80" cy="172" r="50" fill="#eef7ff" stroke="#2d6a9f" strokeWidth="5" />
      <text x="80" y="190" textAnchor="middle" fontSize="34" fontWeight="800" fill="#3a2e3f">
        {unknown === 'a' ? '?' : a}
      </text>
      <circle cx="240" cy="172" r="50" fill="#eef7ff" stroke="#2d6a9f" strokeWidth="5" />
      <text x="240" y="190" textAnchor="middle" fontSize="34" fontWeight="800" fill="#3a2e3f">
        {unknown === 'b' ? '?' : b}
      </text>
    </svg>
  )
}

function PartWholeGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const [choices, setChoices] = useState(() => makeChoices(q.answer))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)
  const question =
    q.unknown === 'whole'
      ? `${q.a} + ${q.b} = ?`
      : q.unknown === 'a'
        ? `? + ${q.b} = ${q.whole}`
        : `${q.a} + ? = ${q.whole}`

  function nextQuestion() {
    const nq = makeQuestion(settings)
    setQ(nq)
    setChoices(makeChoices(nq.answer))
  }

  return (
    <div className="game">
      <div className="question">
        Two parts make the whole. Find the missing number!
      </div>
      <div className="partwhole-hint">whole = part + part</div>
      <PartWholeModel a={q.a} b={q.b} whole={q.whole} unknown={q.unknown} />
      <div className="answer-row">
        {choices.map((c) => (
          <button
            key={c}
            type="button"
            className="answer-button"
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.answer,
                  game: gameName,
                  question,
                  selected: c,
                  correctAnswer: q.answer,
                },
                1000,
                nextQuestion,
              )
            }
          >
            {c}
          </button>
        ))}
      </div>
      <RoundDots round={round} total={total} />
      <Feedback feedback={feedback} correctAnswer={q.answer} disabled={disabled} />
    </div>
  )
}

export default PartWholeGame
