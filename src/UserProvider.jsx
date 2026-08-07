import { useCallback, useEffect, useState } from 'react'
import { UserContext, POINTS_PER_CORRECT } from './userContext'

const CACHE_KEY = 'math-games-users-cache-v1'

const EMPTY = { users: [], activeId: null, deletedIds: [] }

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || EMPTY
  } catch {
    return EMPTY
  }
}

let idCounter = 0
function makeId() {
  idCounter += 1
  return 'u' + Date.now().toString(36) + idCounter.toString(36)
}

export function UserProvider({ children }) {
  const [data, setData] = useState(loadCache)
  const [ready, setReady] = useState(false)

  // Pull the shared data from the host computer on load.
  useEffect(() => {
    let cancelled = false
    fetch('/api/users')
      .then((res) => res.json())
      .then((server) => {
        if (!cancelled && server && Array.isArray(server.users)) {
          setData({ users: server.users, activeId: server.activeId, deletedIds: [] })
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Save to the shared file whenever the data changes (debounced).
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const server = await res.json()
          const normalized = { users: server.users, activeId: server.activeId, deletedIds: [] }
          if (JSON.stringify(normalized) !== JSON.stringify(data)) {
            setData(normalized)
          }
        }
      } catch {
        // Offline: keep local cache; it will sync on the next save.
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [data])

  const activeUser = data.users.find((u) => u.id === data.activeId) || null

  const addUser = useCallback((name, emoji) => {
    setData((d) => {
      const user = { id: makeId(), name, emoji, stats: { correct: 0, wrong: 0, points: 0 } }
      return { ...d, users: [...d.users, user], activeId: user.id }
    })
  }, [])

  const selectUser = useCallback((id) => {
    setData((d) => ({ ...d, activeId: id }))
  }, [])

  const deleteUser = useCallback((id) => {
    setData((d) => {
      const users = d.users.filter((u) => u.id !== id)
      const activeId = d.activeId === id ? (users[0]?.id ?? null) : d.activeId
      return {
        ...d,
        users,
        activeId,
        deletedIds: [...(d.deletedIds ?? []), id],
      }
    })
  }, [])

  const clearStats = useCallback((id) => {
    setData((d) => ({
      ...d,
      users: d.users.map((u) =>
        u.id === id ? { ...u, stats: { correct: 0, wrong: 0, points: 0 } } : u,
      ),
    }))
  }, [])

  const renameUser = useCallback((id, name) => {
    setData((d) => ({
      ...d,
      users: d.users.map((u) => (u.id === id ? { ...u, name } : u)),
    }))
  }, [])

  const recordAnswer = useCallback((isCorrect) => {
    setData((d) => {
      if (!d.activeId) return d
      return {
        ...d,
        users: d.users.map((u) => {
          if (u.id !== d.activeId) return u
          if (isCorrect) {
            return {
              ...u,
              stats: {
                ...u.stats,
                correct: u.stats.correct + 1,
                points: u.stats.points + POINTS_PER_CORRECT,
              },
            }
          }
          return { ...u, stats: { ...u.stats, wrong: u.stats.wrong + 1 } }
        }),
      }
    })
  }, [])

  const value = {
    users: data.users,
    activeUser,
    ready,
    addUser,
    selectUser,
    deleteUser,
    clearStats,
    renameUser,
    recordAnswer,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
