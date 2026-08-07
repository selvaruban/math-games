import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const more = Math.random() < 0.5
  const delta = settings.deltas[randInt(0, settings.deltas.length - 1)]
  const low = more ? settings.minBase : settings.minBase + delta
  const high = more ? settings.maxBase - delta : settings.maxBase
  const base = randInt(low, high)
  const answer = more ? base + delta : base - delta
  return { base, delta, more, answer, choices: makeChoices(answer) }
}

function MoreLessGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="sum-row">
        <span className="op num">{q.delta}</span>
        <span className="op">{q.more ? 'more' : 'less'}</span>
        <span className="op">than</span>
        <span className="op num">{q.base}</span>
        <span className="op">is</span>
        <span className="sum-answer">?</span>
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
                  question: `${q.delta} ${q.more ? 'more' : 'less'} than ${q.base} is ?`,
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
  return uniqueChoices(answer, () => Math.max(0, answer + randInt(-3, 3)), 3)
}

export default MoreLessGame
