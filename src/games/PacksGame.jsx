import { useState } from 'react'
import { randInt, uniqueChoices } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function makeQuestion(settings) {
  const packs = randInt(1, settings.maxPacks)
  const perPack = 10
  const answer = packs * perPack
  return { packs, perPack, answer, choices: makeChoices(answer) }
}

function PacksGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">
        🎈 Balloons come in packs of {q.perPack}. Mo buys {q.packs} packs.
        <br />
        How many balloons does he have?
      </div>
      <div className="packs-row">
        {Array.from({ length: q.packs }, (_, i) => (
          <div key={i} className={`pack-box ${q.packs > 4 ? 'small' : ''}`}>
            {q.packs > 4 ? (
              <span className="pack-badge">{q.perPack}</span>
            ) : (
              <>
                <span className="pack-emojis">{'🎈'.repeat(q.perPack)}</span>
                <span className="pack-label">= {q.perPack}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="answer-row">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className="answer-button"
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: c === q.answer,
                  game: gameName,
                  question: `${q.packs} packs of ${q.perPack} balloons`,
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

function makeChoices(answer) {
  return uniqueChoices(answer, () => Math.max(0, answer + randInt(-10, 10)), 3)
}

export default PacksGame
