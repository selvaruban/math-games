import { useState } from 'react'
import { shuffle } from './helpers'
import { RoundDots } from './quiz'

// Build a shuffled queue that cycles through every game type until we have
// enough questions (each type appears once before any repeats).
function buildQueue(games, total) {
  const q = []
  while (q.length < total) {
    q.push(...shuffle(games))
  }
  return q.slice(0, total)
}

function MixedGame({ settings, onFinish }) {
  const total = 10
  const [queue] = useState(() => buildQueue(settings.games, total))
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const current = queue[index]

  function handleFinish(correctThisRound) {
    const newCorrect = correct + correctThisRound
    if (index + 1 >= total) {
      onFinish(newCorrect, total)
    } else {
      setCorrect(newCorrect)
      setIndex((i) => i + 1)
    }
  }

  const Game = current.component
  return (
    <>
      <RoundDots round={index} total={total} />
      <Game
        key={index}
        settings={current.settingsFor(settings.age)}
        rounds={1}
        onFinish={handleFinish}
        gameName={current.title}
      />
    </>
  )
}

export default MixedGame
