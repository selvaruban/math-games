import { useEffect, useState } from 'react'
import { LEVELS } from './levels'
import { GAMES } from './games/registry'
import { useUser } from './userContext'
import { MIXED_META } from './games/mixedMeta'
import Home from './components/Home'
import GameLibrary from './components/GameLibrary'
import GameShell from './components/GameShell'
import PlayerBar from './components/PlayerBar'
import PlayersModal from './components/PlayersModal'

function App() {
  const { users, ready } = useUser()
  const [view, setView] = useState({ name: 'home' })
  const [playersOpen, setPlayersOpen] = useState(false)

  const showPlayers = playersOpen || (ready && users.length === 0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  let content
  if (view.name === 'level') {
    const level = LEVELS.find((l) => l.age === view.age)
    content = (
      <GameLibrary
        level={level}
        onBack={() => setView({ name: 'home' })}
        onPick={(gameId) => setView({ name: 'game', age: level.age, gameId })}
      />
    )
  } else if (view.name === 'game') {
    const level = LEVELS.find((l) => l.age === view.age)
    const game = view.gameId === 'mixed' ? MIXED_META : GAMES[view.gameId]
    content = (
      <GameShell
        level={level}
        game={game}
        onBack={() => setView({ name: 'level', age: level.age })}
      />
    )
  } else {
    content = <Home levels={LEVELS} onPick={(age) => setView({ name: 'level', age })} />
  }

  return (
    <>
      <PlayerBar onOpen={() => setPlayersOpen(true)} />
      {content}
      {showPlayers && (
        <PlayersModal onClose={() => setPlayersOpen(false)} canClose={users.length > 0} />
      )}
    </>
  )
}

export default App
