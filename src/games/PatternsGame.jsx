import { useState } from 'react'
import { randInt, shuffle, answerState, ordinal } from './helpers'
import { Shape } from './Shapes'
import { SHAPE_NAMES } from './shapeMeta'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeItem(settings) {
  const shape = settings.shapes[randInt(0, settings.shapes.length - 1)]
  const color = settings.colors[randInt(0, settings.colors.length - 1)]
  return { shape, color: color.name, value: color.value }
}

function itemKey(item) {
  return `${item.shape}|${item.color}`
}

function describe(item) {
  return `${item.color} ${SHAPE_NAMES[item.shape]}`
}

function makeQuestion(settings) {
  const L = settings.cycleLengths[randInt(0, settings.cycleLengths.length - 1)]
  const seen = new Set()
  const cycle = []
  while (cycle.length < L) {
    const item = makeItem(settings)
    const key = itemKey(item)
    if (!seen.has(key)) {
      seen.add(key)
      cycle.push(item)
    }
  }
  const shown = 2 * L + (L - 1)
  const pattern = Array.from({ length: shown }, (_, i) => cycle[i % L])
  const answer = cycle[shown % L]
  const need = 3 - L
  const pool = []
  while (pool.length < Math.max(0, need)) {
    const item = makeItem(settings)
    const key = itemKey(item)
    if (!seen.has(key) && !pool.some((p) => itemKey(p) === key)) {
      pool.push(item)
    }
  }
  const choices = shuffle([...cycle, ...pool])
  return { pattern, answer, choices, qText: `${pattern.map(describe).join(' ')} ?` }
}

function PatternsGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">What comes next?</div>
      <div className="pattern-row">
        {q.pattern.map((it, i) => (
          <span key={i} className="pattern-item">
            <Shape kind={it.shape} fill={it.value} size={44} />
          </span>
        ))}
        <span className="pattern-blank">?</span>
      </div>
      <div className="shape-row">
        {q.choices.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`shape-btn ${answerState(disabled, itemKey(c) === itemKey(q.answer))}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: itemKey(c) === itemKey(q.answer),
                  game: gameName,
                  question: q.qText,
                  selected: describe(c),
                  correctAnswer: describe(q.answer),
                },
                5000,
                nextQuestion,
              )
            }
          >
            <span className="option-num">{i + 1}</span>
            <Shape kind={c.shape} fill={c.value} size={52} />
          </button>
        ))}
      </div>
      <Feedback
        feedback={feedback}
        correctAnswer={describe(q.answer)}
        disabled={disabled}
        onNext={next}
        wrongHint={`It was the ${ordinal(q.choices.findIndex((c) => itemKey(c) === itemKey(q.answer)) + 1)} one.`}
      />
    </div>
  )
}

export default PatternsGame
