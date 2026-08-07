const KEY = 'math-games-progress-v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export function getProgress(age, gameId) {
  return load()[age]?.[gameId] ?? null
}

export function getLevelStars(age, gameIds) {
  let total = 0
  let earned = 0
  for (const id of gameIds) {
    const p = getProgress(age, id)
    if (p) {
      total += p.stars
      earned += 3
    }
  }
  return { total, earned }
}

export function saveProgress(age, gameId, { stars }) {
  const data = load()
  const current = data[age]?.[gameId]
  if (!current || stars > current.stars) {
    if (!data[age]) data[age] = {}
    data[age][gameId] = { stars }
    localStorage.setItem(KEY, JSON.stringify(data))
  }
}
