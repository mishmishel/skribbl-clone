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
          <p className="pill" style={{ marginBottom: '24px', fontSize: '28px' }}>
            room code: {roomCode}
          </p>
      
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            
            {/* Players card */}
            <div className="card" style={{ width: '340px', minHeight: '260px' }}>
              <h2 className="card-title">Players</h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {players.map((player) => (
                  <span className="player-item" key={player.id}>
                    {player.username}
                  </span>
                ))}
              </div>
            </div>
      
            {/* How to play card */}
            <div className="card" style={{ width: '340px', minHeight: '260px' }}>
              <h2 className="card-title">how to play</h2>
              <p style={{ fontSize: '18px', lineHeight: '2', textAlign: 'center' }}>
                one player draws a word<br/>
                others type their guesses<br/>
                correct guess = points<br/>
                most points wins!<br/>
              </p>
            </div>
      
          </div>
      
          {/* Buttons below cards */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
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
            <p style={{ marginTop: '24px', fontSize: '16px' }}>
              waiting for more players...
            </p>
          )}
        </div>
    )
}

export default Lobby