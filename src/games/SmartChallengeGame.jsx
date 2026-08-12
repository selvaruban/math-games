import { useState } from 'react'
import { GAMES } from './registry'
import { pickGameId, tierSettings, ageToTier, TIER_INFO, MAX_TIER } from './smartTiers'
import { RoundDots } from './quiz'

// Adaptive engine:
// - Correct: streak + 1. Two in a row = Level Up (tier + 1), streak resets.
// - Wrong: streak = 0 and tier steps down 1 (min tier 1) so the child gets an
//   easier question to rebuild confidence.
//
// Each question is a real game (Count the Fun, Add, Tell the Time, ...) rendered
// with tier-appropriate settings and rounds = 1.
function makeCurrent(tier, excludeId) {
  const id = pickGameId(tier, excludeId)
  return { id, game: GAMES[id], settings: tierSettings(tier, id) }
}

function SmartChallengeGame({ settings, onFinish, rounds = 30 }) {
  const total = rounds
  const [tier, setTier] = useState(() => ageToTier(settings?.age))
  const [streak, setStreak] = useState(0)
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [current, setCurrent] = useState(() => makeCurrent(ageToTier(settings?.age), null))

  function handleFinish(correctThisQuestion) {
    const isCorrect = correctThisQuestion >= 1
    const newCorrect = correct + (isCorrect ? 1 : 0)
    let newTier = tier
    let newStreak = isCorrect ? streak + 1 : 0
    if (isCorrect) {
      if (newStreak === 2) {
        if (tier < MAX_TIER) newTier = tier + 1
        newStreak = 0
      }
    } else {
      newTier = Math.max(1, tier - 1)
    }

    if (index + 1 >= total) {
      onFinish(newCorrect, total)
      return
    }
    setCorrect(newCorrect)
    setStreak(newStreak)
    setTier(newTier)
    setIndex(index + 1)
    setCurrent(makeCurrent(newTier, current.id))
  }

  const Game = current.game.component

  return (
    <>
      <RoundDots round={index} total={total} />
      <div className="tier-row">
        <span className="tier-chip">🚀 {TIER_INFO[tier]}</span>
        <span className="tier-level">Level {tier}/{MAX_TIER}</span>
        {streak > 0 && <span className="streak-chip">🔥 {streak} in a row</span>}
      </div>
      <Game
        key={index}
        settings={current.settings}
        rounds={1}
        onFinish={handleFinish}
        gameName={current.game.title}
      />
    </>
  )
}

export default SmartChallengeGame
