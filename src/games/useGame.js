import { useCallback, useRef, useState } from 'react'
import { useUser } from '../userContext'

// Shared quiz state for every game:
// - round: which question we're on (0-based)
// - correct: number of correct answers so far
// - feedback: { ok: boolean } shown between questions
// - disabled: true while showing feedback
export function useGame(total, onFinish) {
  const { recordAnswer } = useUser()
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const correctRef = useRef(0)
  const roundRef = useRef(0)

  const answer = useCallback(
    (isCorrect, delay = 1000, advance = () => {}) => {
      recordAnswer(isCorrect)
      if (isCorrect) {
        correctRef.current += 1
        setCorrect(correctRef.current)
      }
      setFeedback({ ok: isCorrect })
      setDisabled(true)
      const isLast = roundRef.current === total - 1
      window.setTimeout(() => {
        setFeedback(null)
        if (isLast) {
          onFinish(correctRef.current, total)
        } else {
          roundRef.current += 1
          setRound(roundRef.current)
          setDisabled(false)
          advance()
        }
      }, delay)
    },
    [total, onFinish, recordAnswer],
  )

  return { round, correct, feedback, disabled, answer, total }
}
