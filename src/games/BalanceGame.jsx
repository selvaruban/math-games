import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const a = randInt(1, settings.max)
  const b = randInt(1, settings.max)
  const sum = a + b
  const c = randInt(1, Math.max(1, sum - 1))
  const answer = sum - c
  return { a, b, c, answer, choices: makeChoices(answer) }
}

function BalanceGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">Make both sides equal!</div>
      <div className="sum-row">
        <span className="op num">{q.a}</span>
        <span className="op">+</span>
        <span className="op num">{q.b}</span>
        <span className="op">=</span>
        <span className="sum-answer">?</span>
        <span className="op">+</span>
        <span className="op num">{q.c}</span>
      </div>
      <div className="answer-row">
        {q.choices.map((c) => (
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
                  question: `${q.a} + ${q.b} = ? + ${q.c}`,
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
      <Feedback feedback={feedback} correctAnswer={q.answer} disabled={disabled} />
    </div>
  )
}

function makeChoices(answer) {
  return uniqueChoices(answer, () => Math.max(0, answer + randInt(-3, 3)), 3)
}

export default BalanceGame
