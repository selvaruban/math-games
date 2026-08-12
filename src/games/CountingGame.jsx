import { useState } from 'react'
import { randInt, uniqueChoices, randomEmoji, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const n = randInt(settings.min, settings.max)
  return { count: n, choices: makeChoices(n, settings) }
}

function CountingGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const [emoji, setEmoji] = useState(randomEmoji)
  const [marked, setMarked] = useState([])
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
    setEmoji(randomEmoji())
    setMarked([])
  }

  function toggle(i) {
    if (disabled) return
    setMarked((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        How many <span className="question-emoji">{emoji}</span> can you see?
      </div>
      <div className="counter-chip">
        You counted: <b>{marked.length}</b>
      </div>
      <div className="object-grid">
        {Array.from({ length: q.count }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`object-button ${marked.includes(i) ? 'counted' : ''}`}
            onClick={() => toggle(i)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="answer-row">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className={`answer-button ${answerState(disabled, c === q.count)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.count,
                  game: gameName,
                  question: `How many ${emoji}?`,
                  selected: c,
                  correctAnswer: q.count,
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
      <Feedback feedback={feedback} correctAnswer={q.count} disabled={disabled} onNext={next} />
    </div>
  )
}

function makeChoices(n, settings) {
  return uniqueChoices(
    n,
    () => randInt(Math.max(1, settings.min), settings.max + 1),
    3,
  )
}

export default CountingGame
