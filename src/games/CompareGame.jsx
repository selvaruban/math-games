import { useState } from 'react'
import { randInt, shuffle, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const NAMES = ['Kim', 'Ron', 'Mia', 'Leo', 'Zoe', 'Ana', 'Sam', 'Tom']
const ITEMS = ['apple', 'cookie', 'balloon', 'sweet', 'rocket', 'pearl', 'scoop']

function makeQuestion(settings) {
  const names = shuffle(NAMES).slice(0, 2)
  const [n1, n2] = names
  const a = randInt(1, settings.maxCount)
  let b = randInt(1, settings.maxCount)
  while (b === a) b = randInt(1, settings.maxCount)
  const more = Math.random() < 0.5
  const item = ITEMS[randInt(0, ITEMS.length - 1)]
  const correct = more ? (a > b ? n1 : n2) : (a < b ? n1 : n2)
  return { n1, n2, a, b, more, item, correct }
}

function CompareGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, next, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        {q.n1} has {q.a} {q.item}s. {q.n2} has {q.b} {q.item}s.
        <br />
        Who has {q.more ? 'more' : 'fewer'}?
      </div>
      <div className="compare-row">
        {[
          { name: q.n1, count: q.a },
          { name: q.n2, count: q.b },
        ].map((c) => (
          <button
            key={c.name}
            type="button"
            className={`compare-card ${answerState(disabled, c.name === q.correct)}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c.name === q.correct,
                  game: gameName,
                  question: `${q.n1} has ${q.a} ${q.item}s. ${q.n2} has ${q.b} ${q.item}s. Who has ${q.more ? 'more' : 'fewer'}?`,
                  selected: c.name,
                  correctAnswer: q.correct,
                },
                5000,
                nextQuestion,
              )
            }
          >
            <span className="compare-name">{c.name}</span>
            {c.count <= 12 ? (
              <span className="count-emojis">{'⭐'.repeat(c.count)}</span>
            ) : (
              <span className="count-num">×{c.count}</span>
            )}
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={q.correct} disabled={disabled} onNext={next} />
    </div>
  )
}

export default CompareGame
