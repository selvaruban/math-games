import { gamesForAge } from '../games/registry'
import { getLevelStars } from '../progress'

const DOODLES = [
  { char: '+', top: '6%', left: '5%', size: 44, color: '#ffd166', delay: '0s' },
  { char: '−', top: '16%', left: '88%', size: 40, color: '#74c0fc', delay: '1.2s' },
  { char: '=', top: '80%', left: '7%', size: 38, color: '#ff8fab', delay: '0.6s' },
  { char: '★', top: '10%', left: '72%', size: 30, color: '#ffd166', delay: '2s' },
  { char: '●', top: '72%', left: '90%', size: 24, color: '#a78bfa', delay: '1.5s' },
  { char: '+', top: '86%', left: '80%', size: 34, color: '#69db7c', delay: '0.9s' },
  { char: '✦', top: '52%', left: '2%', size: 26, color: '#74c0fc', delay: '0.3s' },
  { char: '○', top: '34%', left: '94%', size: 30, color: '#ffd166', delay: '1.8s' },
]

function Home({ levels, onPick }) {
  return (
    <div className="screen">
      <div className="bg-doodles" aria-hidden="true">
        {DOODLES.map((d, i) => (
          <span
            key={i}
            className="doodle"
            style={{
              top: d.top,
              left: d.left,
              fontSize: d.size,
              color: d.color,
              animationDelay: d.delay,
            }}
          >
            {d.char}
          </span>
        ))}
      </div>
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
                {earned > 0 && <span> · ⭐ {total}/{earned}</span>}
              </span>
              <span className="age-cta">▶ Play!</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Home
