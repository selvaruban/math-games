import SmartChallengeGame from './SmartChallengeGame.jsx'

export const SMART_META = {
  id: 'smart',
  title: 'Smart Challenge',
  icon: '🚀',
  color: '#e76f51',
  blurb: 'Questions that grow with you!',
  component: SmartChallengeGame,
  settingsFor(age) {
    return { age }
  },
}
