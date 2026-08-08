import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  return Math.random() < 0.5 ? makeBalance(settings) : makeMissing(settings)
}

// a + b = ? + c  ->  ? = a + b - c
function makeBalance(settings) {
  const a = randInt(1, settings.max)
  const b = randInt(1, settings.max)
  const sum = a + b
  const c = randInt(1, Math.max(1, sum - 1))
  const answer = sum - c
  return { type: 'balance', a, b, c, answer, choices: makeChoices(answer) }
}

// 13 = ? - 6  ->  ? = a + b
function makeMissing(settings) {
  const a = randInt(1, settings.max)
  const b = randInt(1, settings.max)
  const answer = a + b
  return { type: 'missing', a, b, flipped: Math.random() < 0.5, answer, choices: makeChoices(answer) }
}

function BalanceGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  const header = q.type === 'balance' ? 'Make both sides equal!' : 'What number makes this true?'
  const qText =
    q.type === 'balance'
      ? `${q.a} + ${q.b} = ? + ${q.c}`
      : q.flipped
        ? `? − ${q.b} = ${q.a}`
        : `${q.a} = ? − ${q.b}`

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">{header}</div>
      <div className="sum-row">
        {q.type === 'balance' ? (
          <>
            <span className="op num">{q.a}</span>
            <span className="op">+</span>
            <span className="op num">{q.b}</span>
            <span className="op">=</span>
            <span className="sum-answer">?</span>
            <span className="op">+</span>
            <span className="op num">{q.c}</span>
          </>
        ) : q.flipped ? (
          <>
            <span className="sum-answer">?</span>
            <span className="op">−</span>
            <span className="op num">{q.b}</span>
            <span className="op">=</span>
            <span className="op num">{q.a}</span>
          </>
        ) : (
          <>
            <span className="op num">{q.a}</span>
            <span className="op">=</span>
            <span className="sum-answer">?</span>
            <span className="op">−</span>
            <span className="op num">{q.b}</span>
          </>
        )}
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
                  question: qText,
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
