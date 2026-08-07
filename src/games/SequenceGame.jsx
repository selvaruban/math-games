import { useState } from 'react'
import { randInt, uniqueChoices, clamp } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const reverse = Math.random() < 0.5
  const step = settings.steps[randInt(0, settings.steps.length - 1)]
  const length = 5
  const span = step * (length - 1)
  const start = reverse
    ? randInt(1 + span, settings.maxStart)
    : randInt(1, settings.maxStart - span)
  const seq = Array.from(
    { length },
    (_, i) => start + (reverse ? -1 : 1) * step * i,
  )
  const blankIndex = randInt(1, length - 2)
  const answer = seq[blankIndex]
  return { seq, blankIndex, answer, choices: makeChoices(answer, seq, step, settings.maxStart) }
}

function makeChoices(answer, seq, step, maxStart) {
  const seqSet = new Set(seq)
  const choices = uniqueChoices(
    answer,
    () => clamp(answer + randInt(-2, 2) * step, 1, maxStart),
    4,
  )
  const filtered = choices.filter((c) => c === answer || !seqSet.has(c))
  return filtered.length >= 3 ? filtered : choices
}

function SequenceGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)
  const question = q.seq.map((n, i) => (i === q.blankIndex ? '?' : n)).join(' · ')

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">Fill in the missing number!</div>
      <div className="sequence-row">
        {q.seq.map((n, i) =>
          i === q.blankIndex ? (
            <span key={i} className="sequence-blank">
              ?
            </span>
          ) : (
            <span key={i} className="sequence-num">
              {n}
            </span>
          ),
        )}
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
                  question,
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

export default SequenceGame
