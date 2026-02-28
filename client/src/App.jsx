import { useState } from 'react'
import { socket } from './socket'

function App() {
  const [gamePhase, setGamePhase] = useState('home') // 'home' | 'lobby' | 'game' | 'scoreboard'
  const [roomCode, setRoomCode] = useState('')
  const [players, setPlayers] = useState([])
  const [username, setUsername] = useState('')

  return (
    <div>
      {gamePhase === 'home' && <p>Home screen goes here</p>}
      {gamePhase === 'lobby' && <p>Lobby goes here</p>}
      {gamePhase === 'game' && <p>Game goes here</p>}
      {gamePhase === 'scoreboard' && <p>Scoreboard goes here</p>}
    </div>
  )
}

export default App