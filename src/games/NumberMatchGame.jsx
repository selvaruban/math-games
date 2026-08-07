import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

// Shows a big number and asks the child to find the group with that many.
function makeQuestion(settings) {
  const n = randInt(settings.min, settings.max)
  return { num: n, groups: makeGroups(n, settings) }
}

function NumberMatchGame({ settings, onFinish, rounds = 10 }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const [reveal, setReveal] = useState(null)
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
    setReveal(null)
  }

  function pick(size) {
    if (disabled) return
    if (size !== q.num) setReveal(q.num)
    answer(size === q.num, 1000, nextQuestion)
  }

  return (
    <div className="game">
      <div className="question">
        Which group has <span className="big-num">{q.num}</span>?
      </div>
      <div className="group-row">
        {q.groups.map((size, i) => (
          <button
            key={i}
            type="button"
            className={`group-button ${disabled && size === reveal ? 'correct-group' : ''} ${disabled && size !== q.num && size !== reveal ? 'dim-group' : ''}`}
            disabled={disabled}
            onClick={() => pick(size)}
          >
            <span className="group-emoji">{'🍪'.repeat(size)}</span>
            <span className="group-label">this one!</span>
          </button>
        ))}
      </div>
      <RoundDots round={round} total={total} />
      <Feedback feedback={feedback} correctAnswer={q.num} disabled={disabled} />
    </div>
  )
}

function makeGroups(n, settings) {
  const sizes = uniqueChoices(
    n,
    () => Math.max(1, n + randInt(-2, 2)),
    3,
  )
  return sizes.filter((s) => s >= Math.max(1, settings.min) && s <= settings.max)
}

export default NumberMatchGame
