import { useState } from 'react'
import { randInt, shuffle } from './helpers'
import { useGame } from './useGame'
import { RoundDots, Feedback } from './quiz'

function format(t) {
  const h = t.hour % 12 === 0 ? 12 : t.hour % 12
  return `${h}:${String(t.minute).padStart(2, '0')}`
}

function distractTime(hour, minute, minutes) {
  const idx = minutes.indexOf(minute)
  const delta = Math.random() < 0.5 ? -1 : 1
  let mi = idx + delta
  let h = hour
  if (mi < 0) {
    mi = minutes.length - 1
    h -= 1
    if (h < 1) h = 12
  }
  if (mi >= minutes.length) {
    mi = 0
    h += 1
    if (h > 12) h = 1
  }
  return { hour: h, minute: minutes[mi] }
}

function makeQuestion(settings) {
  const { minutes } = settings
  const hour = randInt(1, 12)
  const minute = minutes[randInt(0, minutes.length - 1)]
  const time = { hour, minute }
  if (Math.random() < 0.5) {
    const seen = new Set()
    const list = []
    while (list.length < 3) {
      const t = list.length === 0 ? time : distractTime(hour, minute, minutes)
      const key = format(t)
      if (!seen.has(key)) {
        seen.add(key)
        list.push(t)
      }
    }
    return { mode: 'read', time, choices: shuffle(list) }
  }
  const seen = new Set([format(time)])
  const clocks = [time]
  while (clocks.length < 3) {
    const d = distractTime(hour, minute, minutes)
    const key = format(d)
    if (!seen.has(key)) {
      seen.add(key)
      clocks.push(d)
    }
  }
  return { mode: 'match', time, clocks: shuffle(clocks) }
}

function ClockFace({ time, size = 130 }) {
  const rad = (a) => (a * Math.PI) / 180
  const hAngle = (time.hour % 12) * 30 + time.minute * 0.5
  const mAngle = time.minute * 6
  const hx = 60 + 30 * Math.sin(rad(hAngle))
  const hy = 60 - 30 * Math.cos(rad(hAngle))
  const mx = 60 + 44 * Math.sin(rad(mAngle))
  const my = 60 - 44 * Math.cos(rad(mAngle))
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#fff" stroke="#343a40" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30
        const x1 = 60 + 50 * Math.sin(rad(a))
        const y1 = 60 - 50 * Math.cos(rad(a))
        const x2 = 60 + 55 * Math.sin(rad(a))
        const y2 = 60 - 55 * Math.cos(rad(a))
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#343a40" strokeWidth="2.5" />
        )
      })}
      <line
        x1="60"
        y1="60"
        x2={hx}
        y2={hy}
        stroke="#212529"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="60"
        x2={mx}
        y2={my}
        stroke="#e03131"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="5" fill="#212529" />
    </svg>
  )
}

function ClockGame({ settings, onFinish, rounds = 10, gameName = '' }) {
  const [q, setQ] = useState(() => makeQuestion(settings))
  const { round, feedback, disabled, answer, total } = useGame(rounds, onFinish)

  function nextQuestion() {
    setQ(makeQuestion(settings))
  }

  if (q.mode === 'read') {
    return (
      <div className="game">
        <RoundDots round={round} total={total} />
        <div className="question">What time is it?</div>
        <div className="clock-big">
          <ClockFace time={q.time} />
        </div>
        <div className="answer-row">
          {q.choices.map((c) => (
            <button
              key={format(c)}
              type="button"
              className="answer-button time-answer"
              disabled={disabled}
              onClick={() =>
                answer(
                  {
                    isCorrect: format(c) === format(q.time),
                    game: gameName,
                    question: 'What time is it?',
                    selected: format(c),
                    correctAnswer: format(q.time),
                  },
                  1000,
                  nextQuestion,
                )
              }
            >
              {format(c)}
            </button>
          ))}
        </div>
        <Feedback feedback={feedback} correctAnswer={format(q.time)} disabled={disabled} />
      </div>
    )
  }

  return (
    <div className="game">
      <RoundDots round={round} total={total} />
      <div className="question">Which clock shows {format(q.time)}?</div>
      <div className="shape-row">
        {q.clocks.map((t, i) => (
          <button
            key={i}
            type="button"
            className="clock-btn"
            disabled={disabled}
            onClick={() =>
              answer(
                {
                  isCorrect: format(t) === format(q.time),
                  game: gameName,
                  question: `Which clock shows ${format(q.time)}?`,
                  selected: `clock ${i + 1} (${format(t)})`,
                  correctAnswer: format(q.time),
                },
                1000,
                nextQuestion,
              )
            }
          >
            <ClockFace time={t} size={110} />
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} correctAnswer={format(q.time)} disabled={disabled} />
    </div>
  )
}

export default ClockGame
