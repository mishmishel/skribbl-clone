import { useState } from 'react'
import { socket } from '../socket'

function Lobby({ username, roomCode, players, setGamePhase }) {

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
          {/* only show start button to the host */}
          <button onClick={handleStartGame}>Start Game</button>
        </div>
    )
}

export default Lobby