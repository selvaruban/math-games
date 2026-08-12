import { useState } from 'react'
import { randInt, uniqueChoices, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const tens = randInt(1, settings.maxTens)
  const fives = randInt(0, settings.maxFives)
  let ones = randInt(0, 4)
  if (tens === 0 && fives === 0 && ones === 0) ones = 1
  const answer = tens * 10 + fives * 5 + ones
  return { tens, fives, ones, answer, choices: makeChoices(answer) }
}

function BlocksGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        These blocks make what number?
        <div className="blocks-hint">Tall blocks are 10, medium blocks are 5, small blocks are 1.</div>
      </div>
      <div className="blocks-area">
        {Array.from({ length: q.tens }, (_, i) => (
          <div key={`t${i}`} className="block-col tens">
            {Array.from({ length: 10 }, (_, j) => (
              <span key={j} className="block-cell" />
            ))}
          </div>
        ))}
        {Array.from({ length: q.fives }, (_, i) => (
          <div key={`f${i}`} className="block-col fives">
            {Array.from({ length: 5 }, (_, j) => (
              <span key={j} className="block-cell" />
            ))}
          </div>
        ))}
        {Array.from({ length: q.ones }, (_, i) => (
          <div key={`o${i}`} className="block-col ones">
            <span className="block-cell" />
          </div>
        ))}
      </div>
      <div className="answer-row">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className={`answer-button ${answerState(disabled, c === q.answer)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.answer,
                  game: gameName,
                  question: `${q.tens} tens, ${q.fives} fives and ${q.ones} ones`,
                  selected: c,
                  correctAnswer: q.answer,
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
      <Feedback feedback={feedback} correctAnswer={q.answer} disabled={disabled} onNext={next} />
    </div>
  )
}

function makeChoices(answer) {
  return uniqueChoices(answer, () => Math.max(1, answer + randInt(-9, 9)), 3)
}

export default BlocksGame
