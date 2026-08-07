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
}

export function gamesForAge(age) {
  return Object.values(GAMES).filter((g) => g.settingsFor(age) !== null)
}
