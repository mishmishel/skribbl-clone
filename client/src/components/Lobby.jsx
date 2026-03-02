import { useState } from 'react'
import { socket } from '../socket'

function Lobby({ username, roomCode, players, setGamePhase, hostId, playerId }) {
    function handleLeaveRoom() {
        socket.emit('leave-room', { roomCode })
        setGamePhase('home')
    }

    function handleStartGame() {
        socket.emit('start-game', { roomCode })
    }

    return (
        <div>
          <h1>Lobby</h1>
          <p>Room Code: {roomCode}</p>
          <h2>Players:</h2>
          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.username}</li>
            ))}
          </ul>
          {hostId === playerId && (
            <button onClick={handleStartGame}>Start Game</button>
          )}
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>
    )
}

export default Lobby