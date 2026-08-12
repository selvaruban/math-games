import { useState } from 'react'
import { randInt, uniqueChoices, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

// Shows a big number and asks the child to find the group with that many.
function makeQuestion(settings) {
  const n = randInt(settings.min, settings.max)
  return { num: n, groups: makeGroups(n, settings) }
}

function NumberMatchGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  function pick(size) {
    if (disabled) return
    answer(
      {
        isCorrect: size === q.num,
        game: gameName,
        question: `Which group has ${q.num}?`,
        selected: size,
        correctAnswer: q.num,
      },
      5000,
      nextQuestion,
    )
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        Which group has <span className="big-num">{q.num}</span>?
      </div>
      <div className="group-row">
        {q.groups.map((size, i) => (
          <button
            key={i}
            type="button"
            className={`group-button ${answerState(disabled, size === q.num)}`}
            disabled={disabled}
            onClick={() => pick(size)}
          >
            <span className="group-emoji">{'🍪'.repeat(size)}</span>
            <span className="group-label">this one!</span>
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={q.num} disabled={disabled} onNext={next} />
    </div>
  )
}

function makeGroups(n, settings) {
  return uniqueChoices(
    n,
    () => randInt(Math.max(1, settings.min), settings.max),
    3,
  )
}

export default NumberMatchGame
