import { useState } from 'react'
import { randInt, uniqueChoices, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const { span, labelStep } = settings
  const ticks = span / labelStep
  const targetIdx = randInt(1, ticks - 1)
  const target = targetIdx * labelStep
  const choices = uniqueChoices(
    target,
    () => randInt(0, ticks) * labelStep,
    3,
  )
  return { span, labelStep, targetIdx, target, choices }
}

function NumberLineGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  const cellCount = q.span / q.labelStep + 1
  const cells = Array.from({ length: cellCount }, (_, i) => i)

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        Count along the line. What number is the arrow pointing at?
      </div>
      <div className="number-line-wrap">
        <div className="number-line">
          {cells.map((i) => (
            <div key={i} className="line-cell">
              <span className={`arrow ${i === q.targetIdx ? 'show' : ''}`}>▼</span>
              <span className="tick" />
              {i === 0 && <span className="line-label">{0}</span>}
              {i === cells.length - 1 && <span className="line-label">{q.span}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="answer-row">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className={`answer-button ${answerState(disabled, c === q.target)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.target,
                  game: gameName,
                  question: `Number line 0–${q.span}`,
                  selected: c,
                  correctAnswer: q.target,
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
      <Feedback feedback={feedback} correctAnswer={q.target} disabled={disabled} onNext={next} />
    </div>
  )
}

export default NumberLineGame
