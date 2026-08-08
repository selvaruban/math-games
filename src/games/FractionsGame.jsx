import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const DENOM_WORD = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth' }

function makeQuestion(settings) {
  const denom = settings.denoms[randInt(0, settings.denoms.length - 1)]
  const k = randInt(1, settings.maxK)
  const total = denom * k
  return { denom, total, answer: k, choices: makeChoices(k) }
}

function FractionsGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        There are {q.total} sweets. What is one {DENOM_WORD[q.denom]} of them?
      </div>
      <div className="object-grid">
        {Array.from({ length: q.total }, (_, i) => (
          <span key={i} className="sweet">
            🍬
          </span>
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
                  isCorrect: c === q.answer,
                  game: gameName,
                  question: `one ${DENOM_WORD[q.denom]} of ${q.total} sweets`,
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

function makeChoices(answer) {
  return uniqueChoices(answer, () => Math.max(1, answer + randInt(-2, 2)), 3)
}

export default FractionsGame
