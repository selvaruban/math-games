import { useState } from 'react'
import { useUser } from '../userContext'

const EMOJIS = ['🦁', '🐼', '🦄', '🐸', '🐧', '🐨', '🦊', '🐯', '🐰', '🐵', '🐶', '🐱', '🐢', '🦋']

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleString([], {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function PlayersModal({ onClose, canClose }) {
  const { users, activeUser, addUser, selectUser, deleteUser, clearStats, renameUser } = useUser()
  const [showForm, setShowForm] = useState(users.length === 0)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [historyUser, setHistoryUser] = useState(null)
  const [editUser, setEditUser] = useState(null)

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addUser(trimmed, emoji)
    setName('')
    setShowForm(false)
  }

  return (
    <div className="result-overlay">
      <div className="modal-card players-modal">
        <div className="modal-head">
          {historyUser ? (
            <h2 className="history-title">📊 {historyUser.name}'s answers</h2>
          ) : editUser ? (
            <div className="history-head-left">
              <button
                type="button"
                className="history-back"
                onClick={() => setEditUser(null)}
                aria-label="Back to players"
              >
                ←
              </button>
              <h2 className="history-title">✎ Edit {editUser.name}</h2>
            </div>
          ) : (
            <h2>👥 Players</h2>
          )}
        </div>

        {historyUser ? (
          <HistoryView user={historyUser} onBack={() => setHistoryUser(null)} />
        ) : editUser ? (
          <EditView
            user={editUser}
            onBack={() => setEditUser(null)}
            renameUser={renameUser}
            clearStats={clearStats}
            deleteUser={deleteUser}
          />
        ) : (
          <>
            {users.length > 0 ? (
              <ul className="user-list">
                {users.map((u) => {
                  const active = u.id === activeUser?.id
                  return (
                    <li
                      key={u.id}
                      className={`user-row ${active ? 'active' : ''}`}
                      onClick={() => selectUser(u.id)}
                    >
                      <span className="user-emoji">{u.emoji}</span>
                      <div className="user-info">
                        <span className="user-name">
                          {u.name}
                          {active && <span className="active-badge">Active</span>}
                        </span>
                        <span className="user-stats">
                          ⭐ {u.stats.points} · ✓ {u.stats.correct} · ✗ {u.stats.wrong}
                        </span>
                      </div>
                      <div className="mini-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="mini-btn"
                          title="Answer history"
                          aria-label="Answer history"
                          onClick={() => setHistoryUser(u)}
                        >
                          📊
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          title="Edit player"
                          aria-label="Edit player"
                          onClick={() => setEditUser(u)}
                        >
                          ✎
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="empty-players">No players yet. Add your first one below!</p>
            )}

            {!showForm ? (
              <button type="button" className="add-player-toggle" onClick={() => setShowForm(true)}>
                ＋ Add New Player
              </button>
            ) : (
              <form className="add-player" onSubmit={handleAdd}>
                <input
                  type="text"
                  value={name}
                  maxLength={12}
                  placeholder="Player's name"
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                <div className="emoji-picker">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`emoji-opt ${e === emoji ? 'selected' : ''}`}
                      onClick={() => setEmoji(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="submit" className="add-submit" disabled={!name.trim()}>
                    Add player
                  </button>
                  {users.length > 0 && (
                    <button type="button" className="add-cancel" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
        {canClose && (
          <button type="button" className="modal-close-bottom" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  )
}

function EditView({ user, onBack, renameUser, clearStats, deleteUser }) {
  const [editName, setEditName] = useState(user.name)

  function saveName() {
    const trimmed = editName.trim()
    if (trimmed) renameUser(user.id, trimmed)
    onBack()
  }

  return (
    <div className="edit-view">
      <div className="edit-profile">
        <span className="user-emoji">{user.emoji}</span>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-stats">
            ⭐ {user.stats.points} · ✓ {user.stats.correct} · ✗ {user.stats.wrong}
          </span>
        </div>
      </div>

      <label className="edit-label" htmlFor="edit-player-name">
        Player's name
      </label>
      <input
        id="edit-player-name"
        className="rename-input"
        value={editName}
        maxLength={12}
        autoFocus
        onChange={(e) => setEditName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') saveName()
          if (e.key === 'Escape') onBack()
        }}
      />
      <button type="button" className="edit-save" onClick={saveName} disabled={!editName.trim()}>
        ✓ Save name
      </button>

      <div className="edit-danger">
        <button
          type="button"
          className="danger-btn"
          onClick={() => {
            if (window.confirm(`Reset ${user.name}'s scores and answers?`)) {
              clearStats(user.id)
              onBack()
            }
          }}
        >
          ↺ Reset scores & answers
        </button>
        <button
          type="button"
          className="danger-btn delete"
          onClick={() => {
            if (window.confirm(`Delete ${user.name}'s profile?`)) {
              deleteUser(user.id)
              onBack()
            }
          }}
        >
          🗑 Delete player
        </button>
      </div>
    </div>
  )
}

function HistoryView({ user, onBack }) {
  const history = user.history ?? []
  const right = history.filter((h) => h.isCorrect).length
  const wrong = history.length - right

  return (
    <>
      <p className="history-summary">
        {history.length} answers · <span className="ok-text">✓ {right} right</span> ·{' '}
        <span className="no-text">✗ {wrong} wrong</span>
      </p>
      {history.length > 0 ? (
        <ul className="history-list">
          {[...history].reverse().map((h) => (
            <li key={h.id} className={`history-row ${h.isCorrect ? 'ok' : 'no'}`}>
              <div className="history-top">
                <span className="history-game">{h.game || 'Game'}</span>
                <span className="history-time">{formatTime(h.at)}</span>
              </div>
              <div className="history-question">{h.question}</div>
              <div className="history-answer">
                You picked: <b>{h.selected}</b>
                {h.isCorrect ? ' ✓' : ` ✗ · correct: ${h.correctAnswer}`}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-players">No answers recorded yet. Go play a game!</p>
      )}
      <button type="button" className="history-back-bottom" onClick={onBack}>
        ← Back to Players
      </button>
    </>
  )
}

export default PlayersModal
