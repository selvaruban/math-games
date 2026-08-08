import { useState } from 'react'
import { randInt } from './helpers'
import { LShape } from './Shapes'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const TURN_ANGLE = { quarter: 90, half: 180, threequarter: 270 }
const TURN_NAME = { quarter: 'quarter turn', half: 'half turn', threequarter: 'three quarters turn' }

function makeQuestion(settings) {
  const turn = settings.turns[randInt(0, settings.turns.length - 1)]
  return { turn, angle: TURN_ANGLE[turn] }
}

function TurnsGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">The L shape was turned. Which turn was made?</div>
      <div className="turns-row">
        <LShape />
        <span className="turn-arrow">➡</span>
        <LShape angle={q.angle} />
      </div>
      <div className="answer-row">
        {settings.turns.map((t) => (
          <button
            key={t}
            type="button"
            className="answer-button wide"
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: t === q.turn,
                  game: gameName,
                  question: 'Which turn was made?',
                  selected: TURN_NAME[t],
                  correctAnswer: TURN_NAME[q.turn],
                },
                1000,
                nextQuestion,
              )
            }
          >
            {TURN_NAME[t]}
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={TURN_NAME[q.turn]} disabled={disabled} />
    </div>
  )
}

export default TurnsGame
