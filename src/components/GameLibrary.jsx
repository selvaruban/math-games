import { gamesForAge } from '../games/registry'
import { MIXED_META } from '../games/mixedMeta'
import { getProgress } from '../progress'

function GameLibrary({ level, onBack, onPick }) {
  const games = gamesForAge(level.age)
  const mixedProgress = getProgress(level.age, MIXED_META.id)

  return (
    <div className="screen">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back
      </button>
      <header className="screen-header">
        <h1>
          {level.emoji} {level.title}
        </h1>
        <p>{level.blurb}</p>
      </header>
      <div className="game-grid">
        <button
          type="button"
          className="game-card"
          style={{ '--card-color': MIXED_META.color }}
          onClick={() => onPick(MIXED_META.id)}
        >
          <span className="game-icon">{MIXED_META.icon}</span>
          <span className="game-title">{MIXED_META.title}</span>
          <span className="game-blurb">{MIXED_META.blurb}</span>
          <span className="game-stars" aria-label={`Stars: ${mixedProgress ? mixedProgress.stars : 0} of 3`}>
            {'⭐'.repeat(mixedProgress ? mixedProgress.stars : 0)}
            {'☆'.repeat(mixedProgress ? 3 - mixedProgress.stars : 3)}
          </span>
        </button>
        {games.map((game) => {
          const progress = getProgress(level.age, game.id)
          return (
            <button
              key={game.id}
              type="button"
              className="game-card"
              style={{ '--card-color': game.color }}
              onClick={() => onPick(game.id)}
            >
              <span className="game-icon">{game.icon}</span>
              <span className="game-title">{game.title}</span>
              <span className="game-blurb">{game.blurb}</span>
              <span className="game-stars" aria-label={`Stars: ${progress ? progress.stars : 0} of 3`}>
                {'⭐'.repeat(progress ? progress.stars : 0)}
                {'☆'.repeat(progress ? 3 - progress.stars : 3)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GameLibrary
