import { useState } from 'react'
import { randInt, shuffle } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const L = settings.cycleLengths[randInt(0, settings.cycleLengths.length - 1)]
  const cycle = shuffle(settings.symbols).slice(0, L)
  const shown = 2 * L + (L - 1)
  const pattern = Array.from({ length: shown }, (_, i) => cycle[i % L])
  const answer = cycle[shown % L]
  const need = 3 - L
  const pool = shuffle(settings.symbols.filter((s) => !cycle.includes(s))).slice(0, Math.max(0, need))
  const choices = shuffle([...cycle, ...pool])
  return { pattern, answer, choices }
}

function PatternsGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">What comes next?</div>
      <div className="pattern-row">
        {q.pattern.map((s, i) => (
          <span key={i} className="pattern-item">
            {s}
          </span>
        ))}
        <span className="pattern-blank">?</span>
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
                  question: `${q.pattern.join(' ')} ?`,
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

export default PatternsGame
