import CountingGame from './CountingGame.jsx'
import NumberMatchGame from './NumberMatchGame.jsx'
import AdditionGame from './AdditionGame.jsx'
import SubtractionGame from './SubtractionGame.jsx'
import SequenceGame from './SequenceGame.jsx'
import WordProblemGame from './WordProblemGame.jsx'
import MultiplicationGame from './MultiplicationGame.jsx'
import BiggestSmallestGame from './BiggestSmallestGame.jsx'
import NumberLineGame from './NumberLineGame.jsx'
import PartWholeGame from './PartWholeGame.jsx'
import MoreLessGame from './MoreLessGame.jsx'
import CompareGame from './CompareGame.jsx'
import PatternsGame from './PatternsGame.jsx'
import DiceGame from './DiceGame.jsx'
import VolumeGame from './VolumeGame.jsx'
import BlocksGame from './BlocksGame.jsx'
import MatchWordsGame from './MatchWordsGame.jsx'
import BalanceGame from './BalanceGame.jsx'
import ShapesGame from './ShapesGame.jsx'
import ClockGame from './ClockGame.jsx'
import LongShortGame from './LongShortGame.jsx'
import HalfShadedGame from './HalfShadedGame.jsx'
import PacksGame from './PacksGame.jsx'
import TurnsGame from './TurnsGame.jsx'
import FractionsGame from './FractionsGame.jsx'
import { SHAPE_KINDS } from './shapeMeta.js'

// Game registry. To add a new game: create a component that receives
// { settings, onFinish }, give it an id here, and a settingsFor(age) that
// describes the difficulty at each age (return null to hide it for that age).
export const GAMES = {
  counting: {
    id: 'counting',
    title: 'Count the Fun',
    icon: '🔢',
    color: '#ffb703',
    blurb: 'How many can you see? Tap and count!',
    component: CountingGame,
    settingsFor(age) {
      if (age === 6) return { min: 3, max: 10 }
      if (age === 7) return { min: 8, max: 20 }
      if (age === 8) return { min: 15, max: 40 }
      return null
    },
  },
  numbermatch: {
    id: 'numbermatch',
    title: 'Find the Number',
    icon: '🔍',
    color: '#fb8500',
    blurb: 'Spot the group that matches the number!',
    component: NumberMatchGame,
    settingsFor(age) {
      if (age === 6) return { min: 1, max: 8 }
      if (age === 7) return { min: 1, max: 12 }
      if (age === 8) return { min: 1, max: 15 }
      return null
    },
  },
  addition: {
    id: 'addition',
    title: 'Add',
    icon: '➕',
    color: '#06d6a0',
    blurb: 'Add the two numbers together!',
    component: AdditionGame,
    settingsFor(age) {
      if (age === 6) return { maxSum: 10 }
      if (age === 7) return { maxSum: 20 }
      if (age === 8) return { maxSum: 50 }
      return null
    },
  },
  subtraction: {
    id: 'subtraction',
    title: 'Take Away',
    icon: '➖',
    color: '#118ab2',
    blurb: 'Cross out the ones that go away!',
    component: SubtractionGame,
    settingsFor(age) {
      if (age === 6) return { max: 10 }
      if (age === 7) return { max: 20 }
      if (age === 8) return { max: 50 }
      return null
    },
  },
  sequence: {
    id: 'sequence',
    title: 'Fill the Blank',
    icon: '🧩',
    color: '#e76f51',
    blurb: 'Find the missing number — forwards and backwards!',
    component: SequenceGame,
    settingsFor(age) {
      if (age === 6) return { maxStart: 20, steps: [1], reverse: true }
      if (age === 7) return { maxStart: 100, steps: [1, 2, 5, 10], reverse: true }
      if (age === 8) return { maxStart: 200, steps: [2, 3, 5, 10], reverse: true }
      return null
    },
  },
  wordproblem: {
    id: 'wordproblem',
    title: 'Story Sums',
    icon: '📖',
    color: '#2a9d8f',
    blurb: 'Read the story and work out the answer!',
    component: WordProblemGame,
    settingsFor(age) {
      if (age === 6) return { maxSum: 10, maxMinuend: 10, maxHalf: 10, maxDouble: 5, multiply: false }
      if (age === 7)
        return {
          maxSum: 20,
          maxMinuend: 20,
          maxHalf: 20,
          maxDouble: 10,
          multiply: true,
          multTables: [2, 5, 10],
          multMax: 5,
        }
      if (age === 8)
        return {
          maxSum: 50,
          maxMinuend: 50,
          maxHalf: 50,
          maxDouble: 25,
          multiply: true,
          multTables: [2, 3, 4, 5, 6, 7, 8, 9],
          multMax: 6,
        }
      return null
    },
  },
  multiplication: {
    id: 'multiplication',
    title: 'Times Table',
    icon: '✖️',
    color: '#9b5de5',
    blurb: 'Groups of stars — learn your times tables!',
    component: MultiplicationGame,
    settingsFor(age) {
      if (age === 6) return { tables: [1, 2, 10], maxMultiplier: 5 }
      if (age === 7) return { tables: [2, 3, 4, 5, 10], maxMultiplier: 10 }
      if (age === 8) return { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], maxMultiplier: 12 }
      return null
    },
  },
  biggest: {
    id: 'biggest',
    title: 'Biggest or Smallest',
    icon: '🎯',
    color: '#e63946',
    blurb: 'Find the biggest number, or the smallest!',
    component: BiggestSmallestGame,
    settingsFor(age) {
      if (age === 6) return { count: 3, min: 1, max: 20 }
      if (age === 7) return { count: 4, min: 1, max: 100 }
      if (age === 8) return { count: 5, min: 1, max: 1000 }
      return null
    },
  },
  numberline: {
    id: 'numberline',
    title: 'Number Line',
    icon: '📏',
    color: '#f4a261',
    blurb: 'Where is the arrow pointing on the number line?',
    component: NumberLineGame,
    settingsFor(age) {
      if (age === 6) return { span: 10, labelStep: 1 }
      if (age === 7) return { span: 20, labelStep: 2 }
      if (age === 8) return { span: 50, labelStep: 5 }
      return null
    },
  },
  partwhole: {
    id: 'partwhole',
    title: 'Part–Whole Model',
    icon: '🔗',
    color: '#43aa8b',
    blurb: 'Two parts make a whole. Find the missing number!',
    component: PartWholeGame,
    settingsFor(age) {
      if (age === 6) return { maxWhole: 10 }
      if (age === 7) return { maxWhole: 20 }
      if (age === 8) return { maxWhole: 50 }
      return null
    },
  },
  moreless: {
    id: 'moreless',
    title: 'More or Less',
    icon: '🪜',
    color: '#f15bb5',
    blurb: 'One more, one less — what comes next?',
    component: MoreLessGame,
    settingsFor(age) {
      if (age === 6) return { minBase: 3, maxBase: 10, deltas: [1, 2] }
      if (age === 7) return { minBase: 10, maxBase: 100, deltas: [1, 2, 10] }
      if (age === 8) return { minBase: 10, maxBase: 200, deltas: [1, 2, 5, 10] }
      return null
    },
  },
  compare: {
    id: 'compare',
    title: 'Who Has More?',
    icon: '🍎',
    color: '#ef476f',
    blurb: 'Two kids, two amounts — who has more?',
    component: CompareGame,
    settingsFor(age) {
      if (age === 6) return { maxCount: 10 }
      if (age === 7) return { maxCount: 20 }
      if (age === 8) return { maxCount: 50 }
      return null
    },
  },
  patterns: {
    id: 'patterns',
    title: 'Guess the Pattern',
    icon: '🔁',
    color: '#8338ec',
    blurb: 'What shape and colour comes next?',
    component: PatternsGame,
    settingsFor(age) {
      if (age === 6)
        return {
          shapes: ['circle', 'square', 'triangle'],
          colors: [
            { name: 'red', value: '#e63946' },
            { name: 'blue', value: '#3a86ff' },
            { name: 'green', value: '#2a9d8f' },
          ],
          cycleLengths: [2],
        }
      if (age === 7)
        return {
          shapes: ['circle', 'square', 'triangle', 'star', 'diamond'],
          colors: [
            { name: 'red', value: '#e63946' },
            { name: 'blue', value: '#3a86ff' },
            { name: 'green', value: '#2a9d8f' },
            { name: 'yellow', value: '#f4a261' },
            { name: 'purple', value: '#8338ec' },
          ],
          cycleLengths: [2, 3],
        }
      if (age === 8)
        return {
          shapes: SHAPE_KINDS,
          colors: [
            { name: 'red', value: '#e63946' },
            { name: 'blue', value: '#3a86ff' },
            { name: 'green', value: '#2a9d8f' },
            { name: 'yellow', value: '#f4a261' },
            { name: 'purple', value: '#8338ec' },
            { name: 'orange', value: '#fb8500' },
          ],
          cycleLengths: [2, 3, 4],
        }
      return null
    },
  },
  dice: {
    id: 'dice',
    title: 'Dice Pairs',
    icon: '🎲',
    color: '#f8961e',
    blurb: 'Tap the two dice that add up to the number!',
    component: DiceGame,
    settingsFor(age) {
      if (age === 6) return { targets: [5, 6, 7, 8] }
      if (age === 7) return { targets: [6, 7, 8, 9, 10] }
      if (age === 8) return { targets: [7, 8, 9, 10, 11, 12] }
      return null
    },
  },
  volume: {
    id: 'volume',
    title: 'Full or Half',
    icon: '🥛',
    color: '#90be6d',
    blurb: 'Which glass is full? Which is half full?',
    component: VolumeGame,
    settingsFor(age) {
      if (age === 6) return { asks: ['full', 'half', 'empty'] }
      if (age === 7) return { asks: ['full', 'half', 'empty', 'quarter', 'threequarter'] }
      if (age === 8) return { asks: ['full', 'half', 'empty', 'quarter', 'threequarter'] }
      return null
    },
  },
  blocks: {
    id: 'blocks',
    title: 'Number Blocks',
    icon: '🧱',
    color: '#577590',
    blurb: 'Tens and ones — what number is it?',
    component: BlocksGame,
    settingsFor(age) {
      if (age === 6) return { maxTens: 3, maxOnes: 9 }
      if (age === 7) return { maxTens: 9, maxOnes: 9 }
      if (age === 8) return { maxTens: 9, maxOnes: 9 }
      return null
    },
  },
  matchwords: {
    id: 'matchwords',
    title: 'Number Words',
    icon: '🔤',
    color: '#00bbf9',
    blurb: 'Match the word to the number and back!',
    component: MatchWordsGame,
    settingsFor(age) {
      if (age === 6) return { maxNum: 10 }
      if (age === 7) return { maxNum: 20 }
      if (age === 8) return { maxNum: 99 }
      return null
    },
  },
  balance: {
    id: 'balance',
    title: 'Balance It',
    icon: '⚖️',
    color: '#d62828',
    blurb: 'Make both sides equal — find the missing number!',
    component: BalanceGame,
    settingsFor(age) {
      if (age === 6) return { max: 10 }
      if (age === 7) return { max: 20 }
      if (age === 8) return { max: 50 }
      return null
    },
  },
  shapes: {
    id: 'shapes',
    title: 'Find the Shape',
    icon: '🔷',
    color: '#3a86ff',
    blurb: 'Can you spot the shape?',
    component: ShapesGame,
    settingsFor(age) {
      if (age === 6) return { kinds: ['circle', 'square', 'triangle', 'star', 'heart'] }
      if (age === 7) return { kinds: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'oval'] }
      if (age === 8) return { kinds: SHAPE_KINDS }
      return null
    },
  },
  clock: {
    id: 'clock',
    title: 'Tell the Time',
    icon: '🕐',
    color: '#6d597a',
    blurb: 'Read the clock and pick the right time!',
    component: ClockGame,
    settingsFor(age) {
      if (age === 6) return { minutes: [0, 15, 30, 45] }
      if (age === 7) return { minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] }
      if (age === 8) return { minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] }
      return null
    },
  },
  longshort: {
    id: 'longshort',
    title: 'Longest or Shortest',
    icon: '✏️',
    color: '#bc6c25',
    blurb: 'Find the longest pencil, or the shortest!',
    component: LongShortGame,
    settingsFor(age) {
      if (age === 6) return { count: 3, maxLen: 8, step: 2 }
      if (age === 7) return { count: 4, maxLen: 10, step: 2 }
      if (age === 8) return { count: 5, maxLen: 12, step: 2 }
      return null
    },
  },
  halfshaded: {
    id: 'halfshaded',
    title: 'Half Shaded',
    icon: '🟩',
    color: '#2d6a4f',
    blurb: 'Which shape is exactly half shaded?',
    component: HalfShadedGame,
    settingsFor(age) {
      if (age === 6) return { kinds: ['square', 'circle', 'triangle'] }
      if (age === 7) return { kinds: ['square', 'circle', 'triangle', 'diamond', 'hexagon'] }
      if (age === 8) return { kinds: SHAPE_KINDS }
      return null
    },
  },
  packs: {
    id: 'packs',
    title: 'Packs of Ten',
    icon: '🎈',
    color: '#ff7b54',
    blurb: 'Count the packs of ten!',
    component: PacksGame,
    settingsFor(age) {
      if (age === 6) return { maxPacks: 3 }
      if (age === 7) return { maxPacks: 5 }
      if (age === 8) return { maxPacks: 9 }
      return null
    },
  },
  turns: {
    id: 'turns',
    title: 'Shape Turns',
    icon: '🔄',
    color: '#7b2cbf',
    blurb: 'Was it a half turn or a quarter turn?',
    component: TurnsGame,
    settingsFor(age) {
      if (age === 6) return { turns: ['quarter', 'half'] }
      if (age === 7) return { turns: ['quarter', 'half'] }
      if (age === 8) return { turns: ['quarter', 'half', 'threequarter'] }
      return null
    },
  },
  fractions: {
    id: 'fractions',
    title: 'Sweets Fractions',
    icon: '🍬',
    color: '#d00000',
    blurb: 'What is one quarter of the sweets?',
    component: FractionsGame,
    settingsFor(age) {
      if (age === 6) return { denoms: [2, 4], maxK: 4 }
      if (age === 7) return { denoms: [2, 3, 4, 5], maxK: 4 }
      if (age === 8) return { denoms: [2, 3, 4, 5, 6], maxK: 4 }
      return null
    },
  },
}

export function gamesForAge(age) {
  return Object.values(GAMES).filter((g) => g.settingsFor(age) !== null)
}
