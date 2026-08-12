import { useState } from 'react'
import { randInt, shuffle, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

function makeQuestion(settings) {
  const target = settings.targets[randInt(0, settings.targets.length - 1)]
  let av = randInt(1, 6)
  while (target - av < 1 || target - av > 6) av = randInt(1, 6)
  const bv = target - av
  const dist = pickDistractors(target, [av, bv], 2)
  if (dist.length < 2) return makeQuestion(settings)
  const values = shuffle([av, bv, ...dist])
  return { values, pair: [av, bv], target }
}

// Pick `count` dice values that cannot combine with any other shown die to
// reach the target, so exactly one pair of dice adds up to it.
function pickDistractors(target, pair, count) {
  const chosen = []
  for (let v = 1; v <= 6 && chosen.length < count; v++) {
    if (pair.includes(v)) continue
    if (pair.some((p) => p + v === target)) continue
    if (chosen.some((c) => c + v === target)) continue
    chosen.push(v)
  }
  return chosen
}

function DiceGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const [marked, setMarked] = useState([])
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  function onDiceTap(i) {
    if (disabled) return
    const next = marked.includes(i) ? marked.filter((x) => x !== i) : [...marked, i]
    setMarked(next)
    if (next.length === 2) {
      const sum = next.reduce((s, x) => s + q.values[x], 0)
      answer(
        {
          isCorrect: sum === q.target,
          game: gameName,
          question: `Tap two dice that make ${q.target}`,
          selected: `${next.map((x) => q.values[x]).join(' + ')} = ${sum}`,
          correctAnswer: q.target,
        },
        5000,
        () => {
          setMarked([])
          nextQuestion()
        },
      )
    }
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        Tap the two dice that add up to <b>{q.target}</b>.
      </div>
      <div className="dice-row">
        {q.values.map((v, i) => (
          <button
            key={i}
            type="button"
            className={`dice-btn ${marked.includes(i) ? 'picked' : ''} ${answerState(disabled, q.pair.includes(v))}`}
            disabled={disabled}
            onClick={() => onDiceTap(i)}
          >
            <span className="dice-face">{DICE_FACES[v - 1]}</span>
            <span className="dice-num">{v}</span>
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={q.target} disabled={disabled} onNext={next} />
    </div>
  )
}

export default DiceGame
