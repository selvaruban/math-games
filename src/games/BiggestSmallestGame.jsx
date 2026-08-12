import { useState } from 'react'
import { randInt, answerState } from './helpers'
import { useGame } from './useGame'
import { RoundDots } from './quiz'

function makeQuestion(settings) {
  const nums = new Set()
  let guard = 0
  while (nums.size < settings.count && guard < 100) {
    nums.add(randInt(settings.min, settings.max))
    guard++
  }
  const cards = [...nums]
  const findBiggest = Math.random() < 0.5
  const target = findBiggest ? Math.max(...cards) : Math.min(...cards)
  return { cards, target, findBiggest }
}

function BiggestSmallestGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, disabled, answer, total } = useGame(rounds, onFinish)

  function pick(card) {
    if (disabled) return
    answer(
      {
        isCorrect: card === q.target,
        game: gameName,
        question: `Which is ${q.findBiggest ? 'biggest' : 'smallest'}: ${q.cards.join(', ')}?`,
        selected: card,
        correctAnswer: q.target,
      },
      5000,
      () => setQ(makeQuestion(settings)),
    )
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        Tap the{' '}
        <span className={q.findBiggest ? 'word-big' : 'word-small'}>
          {q.findBiggest ? 'biggest' : 'smallest'}
        </span>{' '}
        number!
      </div>
      <div className="number-cards">
        {q.cards.map((card) => (
          <button
            key={card}
            type="button"
            className={`number-card ${answerState(disabled, card === q.target)}`}
            disabled={disabled}
            onClick={() => pick(card)}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BiggestSmallestGame
