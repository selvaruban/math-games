import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function randomQuestion(settings) {
  const a = randInt(1, settings.max)
  const b = randInt(0, a)
  return { a, b, result: a - b }
}

function SubtractionGame({ settings, onFinish, rounds = 10 }) {
  const [q, setQ] = useState(() => randomQuestion(settings))
  const [choices, setChoices] = useState(() => makeChoices(q.result))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    const nq = randomQuestion(settings)
    setQ(nq)
    setChoices(makeChoices(nq.result))
  }

  return (
    <div className="game">
      <div className="sum-row">
        <span className="op num">{q.a}</span>
        <span className="op">−</span>
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
            onClick={() => answer(c === q.result, 1000, nextQuestion)}
          >
            {c}
          </button>
        ))}
      </div>
      <RoundDots round={round} total={total} />
      <Feedback feedback={feedback} correctAnswer={q.result} disabled={disabled} />
    </div>
  )
}

function makeChoices(result) {
  return uniqueChoices(result, () => Math.max(0, result + randInt(-3, 3)), 3)
}

export default SubtractionGame
