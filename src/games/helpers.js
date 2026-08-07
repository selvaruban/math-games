export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max)
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build `count` answer choices including `correct`, using makeDistractor for
// the others. All choices are unique.
export function uniqueChoices(correct, makeDistractor, count = 3) {
  const set = new Set([correct])
  let guard = 0
  while (set.size < count && guard < 200) {
    const d = makeDistractor(correct)
    if (!set.has(d)) set.add(d)
    guard++
  }
  return shuffle([...set])
}

export const EMOJIS = ['⭐', '🍎', '🐶', '🚗', '🎈', '🐟', '🍪', '🌸', '🦄', '🌈']

export function randomEmoji() {
  return EMOJIS[randInt(0, EMOJIS.length - 1)]
}
