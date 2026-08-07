import { useState } from 'react'
import { randInt, shuffle } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function toWords(n) {
  if (n < 20) return ONES[n]
  const t = Math.floor(n / 10)
  const o = n % 10
  return o ? `${TENS[t]}-${ONES[o]}` : TENS[t]
}

function makeQuestion(settings) {
  const n = randInt(1, settings.maxNum)
  const word = toWords(n)
  const candidates = [n]
  while (candidates.length < 3) {
    const d = randInt(1, settings.maxNum)
    if (!candidates.includes(d)) candidates.push(d)
  }
  const mode = Math.random() < 0.5 ? 'word' : 'digit'
  if (mode === 'word') {
    return { mode, prompt: word, answer: n, choices: shuffle(candidates) }
  }
  return { mode, prompt: n, answer: word, choices: shuffle(candidates.map(toWords)) }
}

function MatchWordsGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        Match the {q.mode === 'word' ? 'word' : 'number'} with its{' '}
        {q.mode === 'word' ? 'number' : 'word'}.
      </div>
      <div className="match-prompt">{q.prompt}</div>
      <div className="answer-row">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className={`answer-button ${q.mode === 'digit' ? 'word-answer' : ''}`}
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.answer,
                  game: gameName,
                  question: `Match "${q.prompt}"`,
                  selected: c,
                  correctAnswer: q.answer,
                },
                1000,
                nextQuestion,
              )
            }
          >
            {c}
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={q.answer} disabled={disabled} />
    </div>
  )
}

export default MatchWordsGame
