import { gamesForAge } from '../games/registry'
import { getLevelStars } from '../progress'

function Home({ levels, onPick }) {
  return (
    <div className="screen">
      <header className="screen-header">
        <h1>🎈 Math Fun!</h1>
        <p>Pick your age and let's play!</p>
      </header>
      <div className="level-grid">
        {levels.map((level) => {
          const gameIds = gamesForAge(level.age).map((g) => g.id)
          const { total, earned } = getLevelStars(level.age, gameIds)
          return (
            <button
              key={level.age}
              type="button"
              className="age-card"
              style={{ '--card-color': level.color }}
              onClick={() => onPick(level.age)}
            >
              <span className="age-emoji">{level.emoji}</span>
              <span className="age-title">{level.title}</span>
              <span className="age-blurb">{level.blurb}</span>
              <span className="age-stars">
                {gameIds.length} {gameIds.length === 1 ? 'game' : 'games'}
                {earned > 0 && <span> · {total}/{earned} stars</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Home
