import { useState } from 'react'
import { useUser } from '../userContext'

const EMOJIS = ['🦁', '🐼', '🦄', '🐸', '🐧', '🐨', '🦊', '🐯', '🐰', '🐵', '🐶', '🐱', '🐢', '🦋']

function PlayersModal({ onClose, canClose }) {
  const { users, activeUser, addUser, selectUser, deleteUser, clearStats, renameUser } = useUser()
  const [showForm, setShowForm] = useState(users.length === 0)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addUser(trimmed, emoji)
    setName('')
    setShowForm(false)
  }

  function startRename(user) {
    setEditingId(user.id)
    setEditName(user.name)
  }

  function saveRename() {
    const trimmed = editName.trim()
    if (trimmed && editingId) renameUser(editingId, trimmed)
    setEditingId(null)
  }

  function handleCardClick(id) {
    if (editingId && editingId !== id) setEditingId(null)
    selectUser(id)
  }

  return (
    <div className="result-overlay">
      <div className="modal-card players-modal">
        <div className="modal-head">
          <h2>👥 Players</h2>
          {canClose && (
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        {users.length > 0 ? (
          <ul className="user-list">
            {users.map((u) => {
              const active = u.id === activeUser?.id
              return (
                <li
                  key={u.id}
                  className={`user-row ${active ? 'active' : ''}`}
                  onClick={() => handleCardClick(u.id)}
                >
                  <span className="user-emoji">{u.emoji}</span>
                  <div className="user-info">
                    {editingId === u.id ? (
                      <input
                        className="rename-input"
                        value={editName}
                        autoFocus
                        maxLength={12}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename()
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="user-name">
                        {u.name}
                        {active && <span className="active-badge">Active</span>}
                      </span>
                    )}
                    <span className="user-stats">
                      ⭐ {u.stats.points} · ✓ {u.stats.correct} · ✗ {u.stats.wrong}
                    </span>
                  </div>
                  <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                    {editingId === u.id ? (
                      <>
                        <button type="button" className="row-btn save" onClick={saveRename} aria-label="Save name">
                          ✓
                        </button>
                        <button type="button" className="row-btn" onClick={() => setEditingId(null)} aria-label="Cancel">
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="row-btn" title="Rename" aria-label="Rename" onClick={() => startRename(u)}>
                          ✎
                        </button>
                        <button
                          type="button"
                          className="row-btn"
                          title="Reset score"
                          aria-label="Reset score"
                          onClick={() => {
                            if (window.confirm(`Reset ${u.name}'s score?`)) clearStats(u.id)
                          }}
                        >
                          ↺
                        </button>
                        <button
                          type="button"
                          className="row-btn danger"
                          title="Delete player"
                          aria-label="Delete player"
                          onClick={() => {
                            if (window.confirm(`Delete ${u.name}?`)) deleteUser(u.id)
                          }}
                        >
                          🗑
                        </button>
                      </>
                    )}
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
      </div>
    </div>
  )
}

export default PlayersModal
