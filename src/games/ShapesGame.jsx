import { useState } from 'react'
import { randInt, shuffle } from './helpers'
import { Shape } from './Shapes'
import { SHAPE_NAMES } from './shapeMeta'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const answer = settings.kinds[randInt(0, settings.kinds.length - 1)]
  const others = shuffle(settings.kinds.filter((k) => k !== answer)).slice(0, 2)
  const choices = shuffle([answer, ...others])
  return { answer, choices }
}

function ShapesGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">Tap the {SHAPE_NAMES[q.answer]}.</div>
      <div className="shape-row">
        {q.choices.map((k) => (
          <button
            key={k}
            type="button"
            className="shape-btn"
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: k === q.answer,
                  game: gameName,
                  question: `Tap the ${SHAPE_NAMES[q.answer]}`,
                  selected: SHAPE_NAMES[k],
                  correctAnswer: SHAPE_NAMES[q.answer],
                },
                1000,
                nextQuestion,
              )
            }
          >
            <Shape kind={k} />
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={SHAPE_NAMES[q.answer]} disabled={disabled} />
    </div>
  )
}

export default ShapesGame
