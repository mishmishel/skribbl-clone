import { useState } from 'react'
import { socket } from '../socket'

function Home({ username, setUsername, setPlayers, setRoomCode, setGamePhase, setHostId }) {
    const [joinCode, setJoinCode] = useState('')
    const [error, setError] = useState('')

    function handleCreateRoom() {
        if (!username.trim()) {
            setError('Please enter a username!')
            return
        }

        socket.emit('create-room', { username }, (response) => {
          // server sends back { roomCode, players }
          setHostId(response.playerId)
          console.log('Full response:', response)
          setRoomCode(response.roomCode)
          console.log(response.roomCode)
          setPlayers(response.players)
          setGamePhase('lobby')
        })
    }

    function handleJoinRoom() {
        if (!username.trim()) {
            setError('Please enter a username!')
            return
        }
        
        socket.emit('join-room', { roomCode: joinCode, username }, (response) => {
            if (response.error) {
              // room not found — show an error
              setError('Room not found!')
              return
            }
            setHostId(response.room.hostId)
            setRoomCode(response.room.code)
            setPlayers(response.room.players)
            setGamePhase('lobby')
        })
    }

    return (
        <div className="page">
          <h1 className="page-title">Draw & Guess</h1>
    
          <div className="card" style={{ width: '480px' }}>
    
            <div className="form-row">
              <span className="form-label">enter your username:</span>
              <input
                className="input"
                type="text"
                placeholder="username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
    
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <button className="btn btn-green" onClick={handleCreateRoom}>
                create room
              </button>
            </div>
    
            <div className="form-row">
              <span className="form-label">join room</span>
              <input
                className="input"
                type="text"
                placeholder="room code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button className="btn btn-grey" onClick={handleJoinRoom}>
                join
              </button>
            </div>
    
            {error && (
              <p style={{ color: '#ff4444', textAlign: 'center', marginTop: '8px' }}>
                {error}
              </p>
            )}
    
          </div>
        </div>
    )
}

export default Home