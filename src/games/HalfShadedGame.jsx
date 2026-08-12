import { useState } from 'react'
import { randInt, shuffle, answerState, ordinal } from './helpers'
import { ShadedShape } from './Shapes'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const FRACTIONS = ['half', 'quarter', 'threequarter', 'full', 'empty']

function makeQuestion(settings) {
  const kind = settings.kinds[randInt(0, settings.kinds.length - 1)]
  const others = shuffle(FRACTIONS.filter((f) => f !== 'half')).slice(0, 2)
  const fractions = shuffle(['half', ...others])
  return { kind, fractions, answer: fractions.indexOf('half') }
}

function HalfShadedGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">Which shape has one half shaded?</div>
      <div className="shape-row">
        {q.fractions.map((f, i) => (
          <button
            key={i}
            type="button"
            className={`shape-btn ${answerState(disabled, i === q.answer)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: i === q.answer,
                  game: gameName,
                  question: 'Which shape has one half shaded?',
                  selected: f,
                  correctAnswer: 'half',
                },
                5000,
                nextQuestion,
              )
            }
          >
            <span className="option-num">{i + 1}</span>
            <ShadedShape kind={q.kind} fraction={f} />
          </button>
        ))}
      </div>
      <Feedback
        feedback={feedback}
        correctAnswer="half"
        disabled={disabled}
        onNext={next}
        wrongHint={`It was the ${ordinal(q.answer + 1)} one.`}
      />
    </div>
  )
}

export default HalfShadedGame
