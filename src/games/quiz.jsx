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

export function Feedback({ feedback, correctAnswer, disabled, onNext, wrongHint }) {
  if (!feedback || !disabled) return null
  if (feedback.ok) {
    return (
      <>
        <button type="button" className="feedback good tappable" onClick={onNext}>
          🌟 Great job! <span className="feedback-arrow">Continue ➔</span>
        </button>
        <div className="reward-float" aria-hidden="true">
          <span className="reward-points">+10 ⭐</span>
          <span className="reward-correct">+1 ✔</span>
        </div>
      </>
    )
  }
  const bad = wrongHint ? `Oops! ${wrongHint}` : `Oops! The answer was ${correctAnswer}.`
  return (
    <button type="button" className="feedback bad tappable" onClick={onNext}>
      {bad} <span className="feedback-arrow">Continue ➔</span>
    </button>
  )
}
