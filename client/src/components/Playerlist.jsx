function Playerlist({ players, currentDrawer }) {
    return (
        <div className="card" style={{ height: '100%' }}>
          <h2 className="card-title">players & scores</h2>
          <ul style={{ listStyle: 'none' }}>
            {players.map((player) => (
              <li className="player-item" key={player.id}>
                {player.id === currentDrawer ? '✏️ ' : ''}{player.username}: {player.score}
              </li>
            ))}
          </ul>
        </div>
    )
  }
  
  export default Playerlist