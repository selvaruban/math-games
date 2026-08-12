import { useCallback, useRef, useState } from 'react'
import { useUser } from '../userContext'

// Shared quiz state for every game:
// - round: which question we're on (0-based)
// - correct: number of correct answers so far
// - feedback: { ok: boolean } shown between questions
// - disabled: true while showing feedback
// - next: skip the wait and move to the next question right away
export function useGame(total, onFinish) {
  const { recordAnswer } = useUser()
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const correctRef = useRef(0)
  const roundRef = useRef(0)
  const nextRef = useRef(() => {})
  const timerRef = useRef(null)

  const advance = useCallback(() => {
    setFeedback(null)
    timerRef.current = null
    if (roundRef.current === total - 1) {
      onFinish(correctRef.current, total)
    } else {
      roundRef.current += 1
      setRound(roundRef.current)
      setDisabled(false)
      nextRef.current()
    }
  }, [total, onFinish])

  const answer = useCallback(
    (details, delay = 5000, next = () => {}) => {
      recordAnswer(details)
      if (details?.isCorrect) {
        correctRef.current += 1
        setCorrect(correctRef.current)
      }
      nextRef.current = next
      setFeedback({ ok: details.isCorrect })
      setDisabled(true)
      timerRef.current = window.setTimeout(advance, delay)
    },
    [recordAnswer, advance],
  )

  // Tap-to-advance: a correct answer can skip the wait immediately.
  const next = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      advance()
    }
  }, [advance])

  return { round, correct, feedback, disabled, answer, next, total }
}
