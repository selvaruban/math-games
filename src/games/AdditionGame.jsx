import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function randomQuestion(settings) {
  const a = randInt(1, settings.maxSum - 1)
  const b = randInt(1, Math.max(1, settings.maxSum - a))
  return { a, b, sum: a + b }
}

function AdditionGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => randomQuestion(settings))
  const [choices, setChoices] = useState(() => makeChoices(q.sum))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    const nq = randomQuestion(settings)
    setQ(nq)
    setChoices(makeChoices(nq.sum))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="sum-row">
        <span className="op num">{q.a}</span>
        <span className="op">+</span>
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
                  isCorrect: c === q.sum,
                  game: gameName,
                  question: `${q.a} + ${q.b} = ?`,
                  selected: c,
                  correctAnswer: q.sum,
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
      <Feedback feedback={feedback} correctAnswer={q.sum} disabled={disabled} />
    </div>
  )
}

function makeChoices(sum) {
  return uniqueChoices(sum, () => Math.max(0, sum + randInt(-3, 3)), 3)
}

export default AdditionGame
