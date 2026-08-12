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

// During feedback, help the right answer stand out: the correct option
// turns green with a checkmark and the wrong ones fade out.
export function answerState(disabled, isThisCorrect) {
  return disabled ? (isThisCorrect ? 'btn-correct' : 'btn-dim') : ''
}

// "1st", "2nd", "3rd", "4th" ... for pointing at numbered answer choices.
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  const k = (v - 20) % 10
  return n + (s[k] || s[v] || s[0])
}
