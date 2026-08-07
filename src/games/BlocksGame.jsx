import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const tens = randInt(1, settings.maxTens)
  const ones = randInt(0, settings.maxOnes)
  const answer = tens * 10 + ones
  return { tens, ones, answer, choices: makeChoices(answer) }
}

function BlocksGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        These blocks make what number?
        <div className="blocks-hint">Each long block is 10.</div>
      </div>
      <div className="blocks-area">
        {Array.from({ length: q.tens }, (_, i) => (
          <div key={i} className="rod">
            {Array.from({ length: 10 }, (_, j) => (
              <span key={j} className="rod-cell" />
            ))}
          </div>
        ))}
        <div className="units">
          {Array.from({ length: q.ones }, (_, i) => (
            <span key={i} className="unit-cell" />
          ))}
        </div>
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
                  question: `${q.tens} tens and ${q.ones} ones`,
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
  return uniqueChoices(answer, () => Math.max(1, answer + randInt(-9, 9)), 3)
}

export default BlocksGame
