import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const a = settings.tables[randInt(0, settings.tables.length - 1)]
  const b = randInt(1, settings.maxMultiplier)
  return { a, b, product: a * b }
}

function MultiplicationGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  const choices = uniqueChoices(q.product, () => Math.max(0, q.product + randInt(-4, 4)), 3)

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="sum-row">
        <span className="op num">{q.a}</span>
        <span className="op">×</span>
        <span className="op num">{q.b}</span>
        <span className="op">=</span>
        <span className="sum-answer">?</span>
      </div>
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
                  isCorrect: c === q.product,
                  game: gameName,
                  question: `${q.a} × ${q.b} = ?`,
                  selected: c,
                  correctAnswer: q.product,
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
      <Feedback feedback={feedback} correctAnswer={q.product} disabled={disabled} />
    </div>
  )
}

export default MultiplicationGame
