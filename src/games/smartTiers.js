import { randInt } from './helpers'

// The Smart Challenge draws from the real 26 games. Each tier allows a set of
// question types with parameter rules (number ranges, visuals, etc). A question
// is picked by pickGameId(tier, excludeId) and rendered by the game's own
// component using tierSettings(tier, id).

export const TIER_INFO = {
  1: 'Visual & Observation',
  2: 'Sequences & Concepts',
  3: 'Core Arithmetic',
  4: 'Applied Math & Spatial',
  5: 'Mastery & Multi-Step',
}

export const MAX_TIER = 5

// Starting tier for each profile age (the child's comfort baseline).
export function ageToTier(age) {
  if (age === 7) return 3
  if (age === 8) return 4
  return 2
}

const BASIC_COLORS = [
  { name: 'red', value: '#e63946' },
  { name: 'blue', value: '#3a86ff' },
  { name: 'green', value: '#2a9d8f' },
]

const EASY_SHAPES = ['circle', 'square', 'triangle']

// tier -> [ [gameId, settings], ... ]
const TIER_QUESTIONS = {
  1: [
    ['counting', { min: 1, max: 10 }],
    ['numbermatch', { min: 1, max: 10 }],
    ['longshort', { count: 3, maxLen: 6, step: 2 }],
    ['shapes', { kinds: EASY_SHAPES }],
    ['volume', { asks: ['full', 'half', 'empty'] }],
    ['compare', { maxCount: 10 }],
  ],
  2: [
    ['moreless', { minBase: 2, maxBase: 20, deltas: [1] }],
    ['patterns', { shapes: EASY_SHAPES, colors: BASIC_COLORS, cycleLengths: [2] }],
    ['matchwords', { maxNum: 20 }],
    ['packs', { maxPacks: 2 }],
    ['dice', { targets: [5, 6, 7, 8] }],
    ['biggest', { count: 3, min: 1, max: 20 }],
    ['halfshaded', { kinds: EASY_SHAPES }],
  ],
  3: [
    ['addition', { maxSum: 20 }],
    ['subtraction', { max: 20 }],
    ['sequence', { maxStart: 20, steps: [1, 2], reverse: false }],
    ['numberline', { span: 20, labelStep: 2 }],
    ['partwhole', { maxWhole: 20 }],
    ['blocks', { maxTens: 1, maxFives: 1 }],
  ],
  4: [
    ['balance', { max: 50 }],
    ['clock', { minutes: [0, 30] }],
    ['wordproblem', { maxSum: 50, maxMinuend: 50, maxHalf: 50, maxDouble: 25, multiply: false }],
    ['fractions', { denoms: [2], maxK: 4 }],
    ['turns', { turns: ['quarter', 'half'] }],
  ],
  5: [
    ['multiplication', { tables: [2, 3, 4, 5, 10], maxMultiplier: 6 }],
    [
      'wordproblem',
      {
        maxSum: 100,
        maxMinuend: 100,
        maxHalf: 100,
        maxDouble: 50,
        multiply: true,
        multTables: [2, 3, 4, 5],
        multMax: 6,
      },
    ],
    ['fractions', { denoms: [3, 4], maxK: 6 }],
    ['balance', { max: 100 }],
  ],
}

// Pick a game id for a tier, avoiding the last-played game when possible.
export function pickGameId(tier, excludeId) {
  const list = TIER_QUESTIONS[tier] || TIER_QUESTIONS[2]
  const pool = excludeId && list.length > 1 ? list.filter(([id]) => id !== excludeId) : list
  return pool[randInt(0, pool.length - 1)][0]
}

// The parameter-rule settings for a game within a tier.
export function tierSettings(tier, gameId) {
  const list = TIER_QUESTIONS[tier] || TIER_QUESTIONS[2]
  const entry = list.find(([id]) => id === gameId)
  return entry ? entry[1] : null
}
