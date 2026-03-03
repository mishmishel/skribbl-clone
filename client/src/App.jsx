import { useState, useEffect } from 'react'
import { socket } from './socket'
import Home from './components/Home'
import Lobby from './components/Lobby'
import Canvas from './components/Canvas'
import Chat from './components/Chat'

function App() {
  const [gamePhase, setGamePhase] = useState('home') // 'home' | 'lobby' | 'game' | 'scoreboard'
  const [roomCode, setRoomCode] = useState('')
  const [players, setPlayers] = useState([])
  const [username, setUsername] = useState('')
  const [hostId, setHostId] = useState('')
  const [currentDrawer, setCurrentDrawer] = useState(null)
  const [currentWord, setCurrentWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    socket.on('room-update', (room) => {
      setPlayers(room.players)
    })

    socket.on('game-started', (room) => {
      const drawer = room.players[room.currentDrawerIndex]
      setCurrentDrawer(drawer.id)
      setCurrentWord(room.currentWord)
      setGamePhase('game')
    })

    socket.on('next-turn', (room) => {
      const drawer = room.players[room.currentDrawerIndex]
      setCurrentDrawer(drawer.id)
      setCurrentWord(room.currentWord)
      setTimeLeft(60)
    })

    socket.on('timer', ({ timeLeft }) => {
      setTimeLeft(timeLeft)
    })
  
    return () => {
      socket.off('room-update') // cleanup when component unmounts
      socket.off('game-started')
      socket.off('next-turn')
      socket.off('timer')
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
        <div>
          <p>Time left: {timeLeft}s</p>
          <p>{currentDrawer === socket.id
          ? currentWord
          : currentWord.split('').map(char => char === ' ' ? ' ' : '_').join(' ')
          }</p>
          <Canvas
          roomCode={roomCode}
          isDrawer={currentDrawer === socket.id}
          />
          <Chat 
          roomCode={roomCode} 
          username={username} 
          isDrawer={currentDrawer === socket.id} />
        </div>
      )}
      {gamePhase === 'scoreboard' && <p>Scoreboard goes here</p>}
    </div>
  )
}

export default App