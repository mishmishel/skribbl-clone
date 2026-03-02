import { useState, useEffect } from 'react'
import { socket } from './socket'
import Home from './components/Home'
import Lobby from './components/Lobby'
import Canvas from './components/Canvas'

function App() {
  const [gamePhase, setGamePhase] = useState('home') // 'home' | 'lobby' | 'game' | 'scoreboard'
  const [roomCode, setRoomCode] = useState('')
  const [players, setPlayers] = useState([])
  const [username, setUsername] = useState('')
  const [hostId, setHostId] = useState('')
  const [currentDrawer, setCurrentDrawer] = useState(null)

  useEffect(() => {
    socket.on('room-update', (room) => {
      setPlayers(room.players)
    })

    socket.on('game-started', (room) => {
      const drawer = room.players[room.currentDrawerIndex]
      setCurrentDrawer(drawer.id)
      setGamePhase('game')
    })
  
    return () => {
      socket.off('room-update') // cleanup when component unmounts
      socket.off('game-started')
    }
  }, [])

  return (
    <div>
      {gamePhase === 'home' && 
      (
        <Home
        username={username}
        setUsername={setUsername}
        setPlayers={setPlayers}
        setRoomCode={setRoomCode}
        setGamePhase={setGamePhase}
        setHostId={setHostId}
      />
      )}
      {gamePhase === 'lobby' && (
        <Lobby
        username={username}
        roomCode={roomCode}
        players={players}
        setGamePhase={setGamePhase}
        hostId={hostId}
        playerId={socket.id}
      />
      )}
      {gamePhase === 'game' && (
        <Canvas
        roomCode={roomCode}
        isDrawer={currentDrawer === socket.id}
      />
      )}
      {gamePhase === 'scoreboard' && <p>Scoreboard goes here</p>}
    </div>
  )
}

export default App