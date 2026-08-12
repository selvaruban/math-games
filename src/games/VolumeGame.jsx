import { useState } from 'react'
import { randInt, shuffle, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const LEVELS = { full: 100, half: 50, empty: 0, quarter: 25, threequarter: 75 }
const NAMES = {
  full: 'full',
  half: 'half full',
  empty: 'empty',
  quarter: 'quarter full',
  threequarter: 'three quarters full',
}

function makeQuestion(settings) {
  const ask = settings.asks[randInt(0, settings.asks.length - 1)]
  const targetLevel = LEVELS[ask]
  const others = shuffle(Object.values(LEVELS).filter((l) => l !== targetLevel))
  const levels = shuffle([targetLevel, others[0], others[1]])
  return { ask, levels, targetIndex: levels.indexOf(targetLevel) }
}

function VolumeGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">Tap the glass that is {NAMES[q.ask]}.</div>
      <div className="glass-row">
        {q.levels.map((lvl, i) => (
          <button
            key={i}
            type="button"
            className={`glass-btn ${answerState(disabled, i === q.targetIndex)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: i === q.targetIndex,
                  game: gameName,
                  question: `Tap the glass that is ${NAMES[q.ask]}`,
                  selected: i === q.targetIndex ? NAMES[q.ask] : `glass ${i + 1}`,
                  correctAnswer: NAMES[q.ask],
                },
                5000,
                nextQuestion,
              )
            }
          >
            <span className="glass">
              <span className="glass-liquid" style={{ height: `${lvl}%` }} />
            </span>
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={NAMES[q.ask]} disabled={disabled} onNext={next} />
    </div>
  )
}

export default VolumeGame
