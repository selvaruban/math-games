export function RoundDots({ round, total }) {
  if (total < 2) return null
  return (
    <div className="round-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`dot ${i <= round ? 'done' : ''}`} />
      ))}
    </div>
  )
}

export function Feedback({ feedback, correctAnswer, disabled }) {
  if (!feedback || !disabled) return null
  if (feedback.ok) {
    return <div className="feedback good">🌟 Great job! 🌟</div>
  }
  return <div className="feedback bad">Oops! The answer was {correctAnswer}.</div>
}
