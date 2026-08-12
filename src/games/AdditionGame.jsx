import { Fragment, useState } from 'react'
import { randInt, uniqueChoices, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function randomQuestion(settings) {
  const count = Math.random() < 0.3 ? 3 : 2
  const addends = []
  let remaining = settings.maxSum
  for (let i = 0; i < count; i++) {
    const left = count - i - 1
    const max = remaining - left
    const x = randInt(1, Math.max(1, max))
    addends.push(x)
    remaining -= x
  }
  return {
    addends,
    sum: addends.reduce((s, x) => s + x, 0),
    reversed: Math.random() < 0.3,
  }
}

function AdditionGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => randomQuestion(settings))
  const [choices, setChoices] = useState(() => makeChoices(q.sum))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    const nq = randomQuestion(settings)
    setQ(nq)
    setChoices(makeChoices(nq.sum))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="sum-row">
        {q.reversed && (
          <>
            <span className="sum-answer">?</span>
            <span className="op">=</span>
          </>
        )}
        {q.addends.map((x, i) => (
          <Fragment key={i}>
            <span className="op num">{x}</span>
            {i < q.addends.length - 1 && <span className="op">+</span>}
          </Fragment>
        ))}
        {!q.reversed && (
          <>
            <span className="op">=</span>
            <span className="sum-answer">?</span>
          </>
        )}
      </div>
      <div className="answer-row">
        {choices.map((c) => (
          <button
            key={c}
            type="button"
            className={`answer-button ${answerState(disabled, c === q.sum)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.sum,
                  game: gameName,
                  question: `${q.reversed ? '? = ' : ''}${q.addends.join(' + ')}`,
                  selected: c,
                  correctAnswer: q.sum,
                },
                5000,
                nextQuestion,
              )
            }
          >
            {c}
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={q.sum} disabled={disabled} onNext={next} />
    </div>
  )
}

function makeChoices(sum) {
  return uniqueChoices(sum, () => Math.max(0, sum + randInt(-3, 3)), 3)
}

export default AdditionGame
