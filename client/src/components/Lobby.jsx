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
        <div className="page">
          <p className="pill" style={{ marginBottom: '24px' }}>room code: {roomCode}</p>
      
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            
            <div className="card" style={{ width: '240px' }}>
              <h2 className="card-title">Players</h2>
              <ul style={{ listStyle: 'none' }}>
                {players.map((player) => (
                  <li className="player-item" key={player.id}>
                    {player.username}
                  </li>
                ))}
              </ul>
      
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className='btn btn-red' onClick={handleLeaveRoom}>
                  leave room
                </button>
                {hostId === playerId && (
                  <button
                    className='btn btn-green'
                    onClick={handleStartGame}
                    disabled={players.length < 2}
                  >
                    start game
                  </button>
                )}
              </div>
      
              {hostId === playerId && players.length < 2 && (
                <p style={{ marginTop: '8px', fontSize: '14px' }}>
                  waiting for more players...
                </p>
              )}
            </div>
      
            <div className="card" style={{ width: '280px', minHeight: '200px' }}>
              <h2 className="card-title">how to play</h2>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                one player draws a word<br/>
                others type their guesses<br/>
                correct guess = points<br/>
                most points wins!
              </p>
            </div>
      
          </div>
        </div>
    )
}

export default Lobby