import { useState } from 'react'
import { randInt, uniqueChoices, randomEmoji } from './helpers'
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
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

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
            className="answer-button"
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
      <Feedback feedback={feedback} correctAnswer={q.count} disabled={disabled} />
    </div>
  )
}

function makeChoices(n, settings) {
  return uniqueChoices(
    n,
    () => n + randInt(-3, 3),
    3,
  ).filter((c) => c >= Math.max(1, settings.min) && c <= settings.max + 1)
}

export default CountingGame
