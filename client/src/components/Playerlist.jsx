function PlayerList({ players, currentDrawer }) {
    return (
      <div>
        <h1>Players</h1>
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.id === currentDrawer ? '✏️ ' : ''}{player.username}: {player.score}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  
  export default PlayerList