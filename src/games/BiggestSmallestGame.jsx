import { useState } from 'react'
import { randInt } from './helpers'
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

function BiggestSmallestGame({ settings, onFinish, rounds = 10 }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const [chosen, setChosen] = useState(null)
  const { round, disabled, answer, total } = useGame(rounds, onFinish)

  function pick(card) {
    if (disabled) return
    setChosen(card)
    answer(card === q.target, 1000, () => {
      setQ(makeQuestion(settings))
      setChosen(null)
    })
  }

  const correctCard = disabled && chosen !== q.target ? q.target : null

  return (
    <div className="game">
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
            className={`number-card ${
              card === correctCard ? 'right-pick' : ''
            } ${chosen === card && card !== q.target ? 'wrong-pick' : ''}`}
            disabled={disabled}
            onClick={() => pick(card)}
          >
            {card}
          </button>
        ))}
      </div>
      <RoundDots round={round} total={total} />
    </div>
  )
}

export default BiggestSmallestGame
