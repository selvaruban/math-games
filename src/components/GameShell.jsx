import { useState } from 'react'
import { saveProgress } from '../progress'
import { POINTS_PER_CORRECT } from '../userContext'
import { gamesForAge } from '../games/registry'

function GameShell({ level, game, onBack }) {
  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const Game = game.component
  const settings =
    game.id === 'mixed'
      ? { age: level.age, games: gamesForAge(level.age) }
      : game.settingsFor(level.age)

  function handleFinish(correct, total) {
    const ratio = correct / total
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.5 ? 2 : 1
    setResult({ correct, total, stars })
    saveProgress(level.age, game.id, { stars })
  }

  return (
    <div className="screen">
      <button type="button" className="back-button" onClick={onBack}>
        <span aria-hidden="true">←</span>
        <span>{level.title}</span>
      </button>
      <header className="screen-header">
        <h1>
          {game.icon} {game.title}
        </h1>
        <p>{game.blurb}</p>
      </header>
      <Game
        key={`${level.age}-${game.id}-${attempt}`}
        settings={settings}
        onFinish={handleFinish}
        gameName={game.title}
      />
      {result && (
        <div className="result-overlay">
          <div className="result-card">
            <div className="result-emoji">{result.stars === 3 ? '🏆' : '🎉'}</div>
            <div className="result-stars">
              {'⭐'.repeat(result.stars)}
              {'☆'.repeat(3 - result.stars)}
            </div>
            <p className="result-text">
              You got {result.correct} of {result.total} right!
            </p>
            <p className="result-points">
              +{result.correct * POINTS_PER_CORRECT} points ⭐
            </p>
            <div className="result-buttons">
              <button type="button" className="play-button" onClick={() => { setResult(null); setAttempt((a) => a + 1) }}>
                🔁 Play again
              </button>
              <button type="button" className="play-button ghost" onClick={onBack}>
                🎮 More games
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameShell
