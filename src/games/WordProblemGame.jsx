import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const NAMES = ['Tom', 'Sam', 'Mia', 'Leo', 'Zoe', 'Ana']

const SUB_STORIES = [
  (n, a, b) => ({
    text: `🍬 ${n} has ${a} sweets. ${n} eats ${b}. How many are left?`,
    emoji: '🍬',
    count: a,
  }),
  (n, a, b) => ({
    text: `🐦 There are ${a} birds on a branch. ${b} fly away. How many are left?`,
    emoji: '🐦',
    count: a,
  }),
  (n, a, b) => ({
    text: `🎈 ${n} has ${a} balloons. ${b} float away. How many are left?`,
    emoji: '🎈',
    count: a,
  }),
]

const ADD_STORIES = [
  (n, a, b) => ({
    text: `🍪 ${n} has ${a} cookies. Mum gives ${n} ${b} more. How many cookies does ${n} have now?`,
    emoji: '🍪',
    count: a + b,
  }),
  (n, a, b) => ({
    text: `🚗 There are ${a} cars in the garage and ${b} outside. How many cars in total?`,
    emoji: '🚗',
    count: a + b,
  }),
  (n, a, b) => ({
    text: `🍎 ${n} picks ${a} apples. Then ${n} picks ${b} more. How many apples does ${n} have?`,
    emoji: '🍎',
    count: a + b,
  }),
]

const MULT_STORIES = [
  (n, a, b) => ({
    text: `🍭 There are ${a} boxes. Each box has ${b} lollies. How many lollies altogether?`,
    emoji: '🍭',
    count: a * b,
  }),
  (n, a, b) => ({
    text: `🐾 ${n} sees ${a} cats. Each cat has ${b} paws. How many paws in total?`,
    emoji: '🐾',
    count: a * b,
  }),
]

function makeQuestion(settings) {
  const name = NAMES[randInt(0, NAMES.length - 1)]
  const pool = ['add', 'sub']
  if (settings.multiply) pool.push('mult')
  const op = pool[randInt(0, pool.length - 1)]

  let a, b, answer, story
  if (op === 'add') {
    a = randInt(2, settings.maxSum - 1)
    b = randInt(1, settings.maxSum - a)
    answer = a + b
    story = ADD_STORIES[randInt(0, ADD_STORIES.length - 1)](name, a, b)
  } else if (op === 'sub') {
    a = randInt(2, settings.maxMinuend)
    b = randInt(1, a)
    answer = a - b
    story = SUB_STORIES[randInt(0, SUB_STORIES.length - 1)](name, a, b)
  } else {
    a = settings.multTables[randInt(0, settings.multTables.length - 1)]
    b = randInt(2, settings.multMax)
    answer = a * b
    story = MULT_STORIES[randInt(0, MULT_STORIES.length - 1)](name, a, b)
  }

  return { text: story.text, emoji: story.emoji, count: story.count, answer }
}

function WordProblemGame({ settings, onFinish, rounds = 10 }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  const choices = uniqueChoices(q.answer, () => Math.max(0, q.answer + randInt(-3, 3)), 3)

  return (
    <div className="game">
      <div className="question story">{q.text}</div>
      {q.count <= 24 && (
        <div className="story-visual">
          <span className="group-emoji">{q.emoji.repeat(q.count)}</span>
        </div>
      )}
      <div className="answer-row">
        {choices.map((c) => (
          <button
            key={c}
            type="button"
            className="answer-button"
            disabled={disabled}
            onClick={() => answer(c === q.answer, 1200, nextQuestion)}
          >
            {c}
          </button>
        ))}
      </div>
      <RoundDots round={round} total={total} />
      <Feedback feedback={feedback} correctAnswer={q.answer} disabled={disabled} />
    </div>
  )
}

export default WordProblemGame
