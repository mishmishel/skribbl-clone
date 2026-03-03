import { useState, useEffect } from 'react'
import { socket } from './socket'
import Home from './components/Home'
import Lobby from './components/Lobby'
import Canvas from './components/Canvas'
import Chat from './components/Chat'
import Scoreboard from './components/Scoreboard'
import Playerlist from './components/Playerlist'

function App() {
  const [gamePhase, setGamePhase] = useState('home') // 'home' | 'lobby' | 'game' | 'scoreboard'
  const [roomCode, setRoomCode] = useState('')
  const [players, setPlayers] = useState([])
  const [username, setUsername] = useState('')
  const [hostId, setHostId] = useState('')
  const [currentDrawer, setCurrentDrawer] = useState(null)
  const [currentWord, setCurrentWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [finalScores, setFinalScores] = useState([])

  useEffect(() => {
    socket.on('room-update', (room) => {
      setPlayers(room.players)
    })

    socket.on('game-started', (room) => {
      console.log('game-started received')
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

    socket.on('game-over', (room) => {
      console.log('game-over received on client!')
      setFinalScores(room.players)
      setCurrentDrawer(null)
      setCurrentWord('')
      setTimeLeft(60)
      setPlayers(room.players)
      setGamePhase('scoreboard')
    })

    socket.on('correct-guess', ({ username, scores }) => {
      setPlayers(prev => prev.map(player => {
        const updated = scores.find(s => s.username === player.username)
        return updated ? { ...player, score: updated.score } : player
      }))
    })
  
    return () => {
      socket.off('room-update') // cleanup when component unmounts
      socket.off('game-started')
      socket.off('next-turn')
      socket.off('timer')
      socket.off('correct-guess')
      socket.off('game-over')
    }
  }, [])

  function handleGoHome() {
    setGamePhase('home')
    setRoomCode('')
    setPlayers([])
    setHostId('')
    setCurrentDrawer(null)
    setCurrentWord('')
    setTimeLeft(60)
    setFinalScores([])
    setUsername('')
  }

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
          <Playerlist players={players} currentDrawer={currentDrawer} />
        </div>
      )}
      {gamePhase === 'scoreboard' && (
        <Scoreboard finalScores={finalScores} onGoHome={handleGoHome}/>
      )}
    </div>
  )
}

export default App