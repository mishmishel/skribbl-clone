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
        <div>
            <h1>Draw & Guess</h1>
            <div>
                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <button onClick={handleCreateRoom}>Create Room</button>
                <input type="text" placeholder="Enter room code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
                <button onClick={handleJoinRoom}>Join Room</button>
                {error && <p>{error}</p>}
            </div>
        </div>
    )
}

export default Home