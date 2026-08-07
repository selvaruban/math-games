import { useUser } from '../userContext'

function PlayerBar({ onOpen }) {
  const { activeUser } = useUser()

  return (
    <div className="player-bar">
      <div className="player-bar-left">
        {activeUser ? (
          <>
            <span className="player-chip">
              {activeUser.emoji} {activeUser.name}
            </span>
            <span className="stat-chip points" title="Total points">
              ⭐ {activeUser.stats.points}
            </span>
            <span className="stat-chip good" title="Correct answers">
              ✓ {activeUser.stats.correct}
            </span>
            <span className="stat-chip bad" title="Wrong answers">
              ✗ {activeUser.stats.wrong}
            </span>
          </>
        ) : (
          <span className="player-chip muted">No player yet</span>
        )}
      </div>
      <button type="button" className="players-button" onClick={onOpen}>
        👥 Players
      </button>
    </div>
  )
}

export default PlayerBar
